import React from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useState, useEffect, useContext, createContext } from "react";
import axios from "axios";
import "chart.js/auto";
import "firebase/compat/auth";
import CandlestickChart from "./CandlestickChart";
import Alert from "@mui/material/Alert";
import { styled } from "@mui/system";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import LineChart from "./LineChart";
import {
  ContextConexiuneWSPreturi,
  ContextLimbaAplicatiei,
  ContextUser, ContextIdConexiuneWS, ContextIdWidth
} from "../App";
import { styleDoiJS, TransparentBackdrop } from "../stylinguri";
import {
  trimitemArraySubscribe,
  milionSauMiliard,
  facemArrayFaraDulicate,
  trimitemEroareaInNode,
  vedemNumarulLimbii,
  luamLimbaDinLocSto,
  luamScrisul,
} from "../diverse";
import { ReactComponent as Close } from "../icons/close.svg";

const Symbol = () => {
  const [isEroareServer, setIsEroareServer] = useState('');
  const idConexWS = React.useContext(ContextIdConexiuneWS)
  const [user, setUser] = React.useContext(ContextUser);
  const params = useParams();
  const [preturi, setPreturi] = useState([]);
  const [input, setInput] = useState();
  const [pretRealTimeChart, setPretRealTimeChart] = useState([]);
  const [veziRealTime, setVeziRealTime] = useState(null);
  const [alerta, setAlerta] = useState(false);
  const [detalii, setDetalii] = useState([]);
  const [veziDetalii, setVeziDetalii] = useState(null);
  const [pretSymbol, setPretSymbol] = useState();
  const [portofel, setPortofel] = useState();
  const [open, setOpen] = useState(false);
  const [windowWidth, setWindowWidth] = React.useContext(ContextIdWidth)

  let conexiuneCuPreturi = React.useContext(ContextConexiuneWSPreturi);

  const [limbaAplicatiei, setLimbaAplicatiei] = useContext(
    ContextLimbaAplicatiei
  );

  //
  const [scrisulPaginii, setScrisulPaginii] = useState([]);
  /////////////////////////////////
  useEffect(() => {
    async function luamScris() {
      let limba = luamLimbaDinLocSto();
      const rezultat = await luamScrisul("symbol_js", limba);
      setScrisulPaginii(rezultat);
    }
    luamScris();
  }, []);
  useEffect(() => {
    async function schimbamLimba() {
      let lb = vedemNumarulLimbii(limbaAplicatiei);
      let rezultat = await luamScrisul("symbol_js", lb);
      setScrisulPaginii(rezultat);
    }
    schimbamLimba();
  }, [limbaAplicatiei]);

  const symbol = params.id;

  function luamDateNode() {
    axios
      .get(`${window.adresa_cereri}/datePentruPagSymbol`, {
        params: {
          valoare: symbol,
        },
      })
      .then((data) => {
        if (!data?.data?.resultPreturi)
          throw new Error("err datePentruPagSymbol symbol js");
        const arrayPreturi = data.data.resultPreturi;
        if (arrayPreturi) {
          const arrayNou = arrayPreturi.map((obiect) => ({
            ...obiect,
            time: obiect.time.slice(0, 10),
            open: Number(obiect.open),
            high: Number(obiect.high),
            low: Number(obiect.low),
            close: Number(obiect.close),
          }));

          let arr = facemArrayFaraDulicate(arrayNou);

//console.log(arr, 'asta reprezinte principalul --------')
          setPreturi(arr);
          setDetalii(data.data.resultDetalii);
        }
      })
      .catch((err) => {
        trimitemEroareaInNode(err, user ? user.uid : "fara user");
        console.log('err date pag symbol');
        setIsEroareServer(1);
      });
  }
  useEffect(() => {
    luamDateNode();
    setVeziRealTime(null);
    //////////////////////// trimit symbolurile de pe pagina =>
    trimitemArraySubscribe([symbol], idConexWS);
    //< ==== ///////////////////////
  }, [symbol]);

  function luamDetalii() {
    let obiect = {};
    if (!detalii?.[0]) {
      obiect = {
        logo_url: "",
        description: "",
        homepage_url: "",
        id: "",
        list_data: "",
        market_cap: "",
        name: "",
      };
    } else {
      obiect = {
        logo_url: detalii[0].logo_url,
        description: detalii[0].description,
        homepage_url: detalii[0].homepage_url,
        id: detalii[0].id,
        list_data: detalii[0].list_date,
        market_cap: detalii[0].market_cap,
        name: detalii[0].name,
      };
    }
    return obiect;
  }
  let obiectCuDetalii = luamDetalii();

  function adaugamLaFavorite(symbol) {
    if (!user) return;
    
    const uid = user.uid;
    
    axios
      .get(`${window.adresa_cereri}/adaugamInFavoriteUserSiSymbol`, {
        params: {
          user: uid,
          symbol: symbol,
        },
      })
      .catch((err) => {
        trimitemEroareaInNode(err, user ? user.uid : "fara user");
        console.log('err adaugare fav');
        setIsEroareServer(2);

      });
  }

  function veziDetaliiFunctie(id) {
    if (veziDetalii === id) {
      setVeziDetalii(null);
    } else {
      setVeziDetalii(id);
    }
  }

  function deschidModal(symbol) {
    setOpen(true);
    axios
      .get(`${window.adresa_cereri}/luamPretulDupaSymbolRealTime`, {
        params: {
          uid: user.uid,
          symbol: symbol,
        },
      })
      .then((data) => {
        if (!data?.data?.[0]?.p || !data?.data?.[0]?.bani)
          throw new Error("err luamPretulDupaSymbolRealTime symbol js");
        setPretSymbol(data.data[0].p);
        setPortofel(data.data[0].bani);
      })
      .catch((err) => {
        trimitemEroareaInNode(err, user ? user.uid : "fara user");
        console.log('err luam pret realtime');
        setIsEroareServer(3);

      });
  }
  function inchidModal() {
    setOpen(false);
    setInput();
    setPretSymbol();
    setPortofel();
  }

  function schimbValoareInput(event) {
    setInput(event.target.value);
  }

  function cumparam() {
    if (input * pretSymbol > portofel) {
      
      setAlerta(true);
      setTimeout(() => {
        setAlerta(false);
      }, 3500);
      return;
    }
    axios
      .get(`${window.adresa_cereri}/adaugamStockInPortofel`, {
        params: {
          uid: user.uid,
          symbol: symbol,
          cantitate: input,
          valoare: input * pretSymbol,
        },
      })
      .then((data) => {
        if (!data?.data) throw new Error("err adaugare in portofel symbol js");
        setPortofel(data.data);
        setOpen(false);
      })
      .catch((err) => {
        trimitemEroareaInNode(err, user ? user.uid : "fara user");
        console.log('err adaugare stock');
        setIsEroareServer(4);

      });
  }
  //////////////////////////////////// => cod realtimeprice
  function veziRealTimePrice() {
    setVeziRealTime(!veziRealTime);

    if (!veziRealTime) {
      axios
        .get(`${window.adresa_cereri}/luamDatePeJumate`, {
          params: {
            symbol: symbol,
          },
        })
        .then((data) => {
          if (!data?.data) throw new Error("err luamDatePeJumate js");
          let arrayFinal = data.data.map((obiect) => ({
            time: Number(obiect.t) / 1000,
            price: Number(obiect.p),
          }));
          arrayFinal.reverse();
          setPretRealTimeChart(arrayFinal);
        })
        .catch((err) => {
          trimitemEroareaInNode(err, user ? user.uid : "fara user");
          console.log('err date pe jumate');
          setIsEroareServer(5);

        });
    }
  }

  ////////////////////////////// => pun preturile in timp real in chart pentru symbol

  useEffect(() => {
    if (conexiuneCuPreturi.s === symbol) {
      let time = conexiuneCuPreturi.t / 1000;
      let price = conexiuneCuPreturi.p;


      setPretSymbol(price);

      if (pretRealTimeChart) {
        setPretRealTimeChart((prev) => {

          let verificare = prev.slice(-7).find((ob) => ob.time >= time);
          if (verificare) {
            return [...prev];
          } else {
            return [...prev, { time, price }];
          }
        });
      }

      ///// adaug o candela pentru data de azi
      if (preturi.length) {
        const tim = new Date(time * 1000);
        let an = tim.getFullYear();
        let luna = (tim.getMonth() + 1).toString().padStart(2, "0");
        var zi = tim.getDate().toString().padStart(2, "0");
        const timp = an + "-" + luna + "-" + zi;


	

        setPreturi((prev) => {
          let index = prev.findIndex((ob) => {
            return ob.time === timp;
          });

          if (index < 0) {
            axios
              .get(`${window.adresa_cereri}/luamPreturiOHLCdinRealTime`, {
                params: {
                  s: symbol,
                },
              })
              .then((data) => {
                let { max, min, open } = data?.data?.[0];
                if ((!max, !min, !open)){
                  throw new Error("err luamPreturiOHLCdinRealTime js")};
                let ultimulObiect = prev.slice(-1)[0];
                if (ultimulObiect.time === timp) {
                  setPreturi((prev) => {
                    prev[prev.length - 1].open = Number(open);
                    prev[prev.length - 1].high = Number(max);
                    prev[prev.length - 1].low = Number(min);
                    return [...prev];
                  });
                }
              })
              .catch((err) => {
                trimitemEroareaInNode(err, user ? user.uid : "fara user");
                console.log('err luam ohlc');
                setIsEroareServer(6);
              });
            prev.push({
              time: timp,
              open: price,
              high: price,
              low: price,
              close: price,
            });

          } else {
            let ultim = prev[index];
            if (ultim.high < price) ultim.high = price;
            if (ultim.low > price) ultim.low = price;
            ultim.close = price;
          }
          return [...prev];
        });
      }
    }
  }, [conexiuneCuPreturi]);

  useEffect(()=>{
    if (isEroareServer) {
      setTimeout(() => {
        setIsEroareServer(false);
      }, 2500);
    }
  }, [isEroareServer])

  return (
    <div className="toataPagina">
      <div className="parteaDreapta">

      <div className="errEcran" >
        {isEroareServer && (
          <Alert severity="warning">ERR {isEroareServer}</Alert>
        )}
      </div>

        <div className="distantaFataDeSus">
          <h4 className="averageH4">{symbol}</h4>

          <div className="cont  divPentruScroll ">
            <div className="coloanaCu60 divStangaScroll  ">
              <button className="intraDaily" onClick={veziRealTimePrice}>
                {!veziRealTime
                  ? scrisulPaginii?.[0]?.scris
                  : scrisulPaginii?.[1]?.scris}
              </button>
              {!veziRealTime ? (
                <div className="chartDinSymbol">
                  <CandlestickChart data={preturi}  width={windowWidth <= 1000 ? windowWidth : 800} height={windowWidth <= 1000 ? windowWidth / 3.5 : 400} />
                </div>
              ) : (
                <div className="chartDinSymbol">
                  <LineChart data={pretRealTimeChart}  width={windowWidth <= 1000 ? windowWidth : 800} height={windowWidth <= 1000 ? windowWidth / 3.5 : 400}  />
                </div>
              )}
            </div>
            <div className="coloanaCu40 divDreaptaScroll  ">
              {obiectCuDetalii.homepage_url ? (
                <button className="visitWebSite  unulDinTrei">
                  <Link to={obiectCuDetalii.homepage_url}>
                    {scrisulPaginii?.[10]?.scris}
                  </Link>
                </button>
              ) : (
                <div></div>
              )}

              <button
                onClick={()=>adaugamLaFavorite(symbol)}
                className="butonFavorite unulDinTrei"
              >
                {scrisulPaginii?.[2]?.scris}
              </button>

              {!obiectCuDetalii.name ? (
                <div className="unulDinTrei"></div>
              ) : (
                <div className="unulDinTrei">
                  <button
                    className="butonVeziDetalii  "
                    onClick={() => veziDetaliiFunctie(obiectCuDetalii.id)}
                  >
                    {veziDetalii === obiectCuDetalii.id
                      ? scrisulPaginii?.[12]?.scris
                      : scrisulPaginii?.[11]?.scris}
                  </button>

                  {veziDetalii === obiectCuDetalii.id && (
                    <div>
                      <p>
                        <a className="numeCompanie">
                          {" "}
                          {scrisulPaginii?.[3]?.scris}:
                        </a>{" "}
                        {obiectCuDetalii.name}
                      </p>
                      <p>
                        <a className="detaliiCompanie">
                          {" "}
                          {scrisulPaginii?.[4]?.scris}:
                        </a>{" "}
                        {obiectCuDetalii.description}
                      </p>
                      <p>
                        <a className="detaliiCompanie">
                          {" "}
                          {scrisulPaginii?.[8]?.scris}:
                        </a>{" "}
                        {obiectCuDetalii.list_data.slice(0, 10)}
                      </p>
                      <p>
                        <a className="detaliiCompanie">
                          {" "}
                          {scrisulPaginii?.[5]?.scris}:
                        </a>{" "}
                        {milionSauMiliard(obiectCuDetalii.market_cap)} $
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="centru fixed">
            {user && (
              <button className="buyButton" onClick={()=>deschidModal(symbol)}>
                {scrisulPaginii?.[6]?.scris}{" "}
              </button>
            )}
          </div>

          <Modal
            open={open}
            onClose={inchidModal}
            aria-labelledby="keep-mounted-modal-title"
            aria-describedby="keep-mounted-modal-description"
            BackdropComponent={TransparentBackdrop}
          >
            <Box sx={styleDoiJS}>
              <Button
                sx={{ position: "absolute", top: 0, right: 0 }}
                onClick={inchidModal}
              >
                <Close />
              </Button>
              <p className="p">
                {" "}
                {scrisulPaginii?.[9]?.scris}: {portofel}$
              </p>
              <p className="p">
                {symbol} - {pretSymbol}$
              </p>
              <input
                type="number"
                className="modal-input"
                onChange={schimbValoareInput}
              />
              {input ? <p className="p">{input * pretSymbol}$</p> : <p></p>}
              {alerta && (
                <Alert severity="error"> {scrisulPaginii?.[7]?.scris}</Alert>
              )}
              <Button
                onClick={cumparam}
                sx={{
                  position: "absolute",
                  buttom: 0,
                  right: 200,
                }}
              >
                {scrisulPaginii?.[6]?.scris}
              </Button>
            </Box>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Symbol;
