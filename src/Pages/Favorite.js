import React from "react";

import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "chart.js/auto";
import "firebase/compat/auth";
import CandlestickChart from "./CandlestickChart";
import Alert from "@mui/material/Alert";
import {
  ContextConexiuneWSPreturi,
  ContextLimbaAplicatiei,
  ContextUser, ContextIdConexiuneWS, ContextIdWidth
} from "../App";
import {
  trimitemArraySubscribe,
  milionSauMiliard,
  trimitemEroareaInNode,
  luamScrisul,
  luamLimbaDinLocSto,
  vedemNumarulLimbii,
} from "../diverse";
import { ReactComponent as Gunoi } from "../icons/gunoi.svg";
import pozaInvatare  from '../pozeProiect/pozaInvatare.jpg'
const FavoriteNou = () => {
  const [user, setUser] = React.useContext(ContextUser);
  const idConexWS = React.useContext(ContextIdConexiuneWS)
  const [arrayCuObiecteFavorite, setArrayCuObiecteFavorite] = useState([]);
  const [arrayCuDetalii, setArrayCuDetalii] = useState([]);
  const [arrayCuPreturi, setArrayCuPreturi] = useState([]);
  const [veziDetalii, setVeziDetalii] = useState(null);
  let conexiuneCuPreturi = React.useContext(ContextConexiuneWSPreturi);
  const [limbaAplicatiei, setLimbaAplicatiei] = React.useContext(
    ContextLimbaAplicatiei
  );

  const [isEroareServer, setIsEroareServer] = useState('');
  const [scrisulPaginii, setScrisulPaginii] = useState([]);
  const [windowWidth, setWindowWidth] = React.useContext(ContextIdWidth)
  //////////////////////////////
  useEffect(() => {
    async function luamScris() {
      let limba = luamLimbaDinLocSto();
      const rezultat = await luamScrisul("favorite_js", limba);
      setScrisulPaginii(rezultat);
    }
    luamScris();
    aratamFavoritele();
    
  }, []);

  useEffect(() => {
    async function schimbamLimba() {
      let lb = vedemNumarulLimbii(limbaAplicatiei);
      let rezultat = await luamScrisul("favorite_js", lb);
      setScrisulPaginii(rezultat);
    }
    schimbamLimba();
  }, [limbaAplicatiei]);

  function aratamFavoritele() {
    if (user) {
      const uid = user.uid;

      axios
        .get(`${window.adresa_cereri}/luamSymbolDupaUid`, {
          params: {
            uid: uid,
          },
        })
        .then((data) => {
          if (!data?.data)
            throw new Error("eroare la luamSymbolDupauid favorite js");
          setArrayCuObiecteFavorite(data.data);
          const arrayCuOb = data.data;

          let arraySymb = arrayCuOb.map((ob) => ob.symbol);

          //////////////////////// trimit symbolurile de pe pagina =>
          trimitemArraySubscribe(arraySymb, idConexWS);
          //    < ==== ///////////////////////
          axios
            .get(`${window.adresa_cereri}/luamDetaliisiPreturi`, {
              params: {
                symboluri: arraySymb,
              },
            })
            .then((data) => {
              if (!data?.data)
                throw new Error("eroare la luamDetaliisiPreturi favorite js");
              setArrayCuDetalii(data.data.rezultatDetalii);
              setArrayCuPreturi(data.data.rezultatPreturi);
            })
            .catch((err) => {
              trimitemEroareaInNode(err, user ? user.uid : "fara user");
              console.log('err pret si detalii');
            });
        })
        .catch((err) => {
          trimitemEroareaInNode(err, user ? user.uid : "fara user");
          console.log('-- err pret si detalii --');
          setIsEroareServer(1);

        });
    }
  }

  useEffect(() => {
    if (user) {
      aratamFavoritele(user);
    }
  }, [user]);

  function stergemDinFavorite(symbol) {
    axios
      .get(`${window.adresa_cereri}/stergemDinFavorite`, {
        params: {
          symbol: symbol,
          user: user.uid,
        },
      })
      .then((data) => {
        if (!data?.data) throw new Error("stergem din favorite favorite js");
        setArrayCuObiecteFavorite(data.data);
      })
      .catch((err) => {
        trimitemEroareaInNode(err, user ? user.uid : "fara user");
        console.log('err la stergere');
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

  /////////////////////////// => cod pt preturi real time cu useContext

    useEffect(() => {
    let arraySymb = arrayCuObiecteFavorite.map((ob) => ob.symbol);
    if (arraySymb.includes(conexiuneCuPreturi.s)) {
      const timpul = conexiuneCuPreturi.t;
      const timpulSec = timpul / 1000;
      const time = new Date(timpulSec * 1000);
      let an = time.getFullYear();
      let luna = (time.getMonth() + 1).toString().padStart(2, "0");
      var zi = time.getDate().toString().padStart(2, "0");
      const timp = an + "-" + luna + "-" + zi;
      const price = conexiuneCuPreturi.p;
      const symbol = conexiuneCuPreturi.s;

      const obiectDeAdaugare = {
        symbol: symbol,
        close: price,
        low: price,
        open: price,
        time: timp,
      };

      
      if(arrayCuPreturi.length){setArrayCuPreturi((arrayCuObiecte) => {
        const index = arrayCuObiecte.findIndex(
          (obiect) =>
            JSON.stringify([obiect.symbol, obiect.time]) ===
            JSON.stringify([obiectDeAdaugare.symbol, obiectDeAdaugare.time])
        );
        if (index < 0) {
          arrayCuObiecte.push(obiectDeAdaugare);
          let indexUndeAdaug = arrayCuObiecte.length - 1;
          axios
            .get(`${window.adresa_cereri}/luamPreturiOHLCdinRealTime`, {
              params: {
                s: symbol,
              },
            })
            .then((data) => {
              if (!data?.data?.[0]) {
                throw new Error(
                  "eroare la luamPreturiOHLCdinRealTime favorite js"
                );
              }
              let { max, min, open } = data.data[0];
              //console.log(max, open, min);
              if(max && min && open, indexUndeAdaug){
                setArrayCuPreturi((prev) => {
                  prev[indexUndeAdaug].open = Number(open);
                  prev[indexUndeAdaug].high = Number(max);
                  prev[indexUndeAdaug].low = Number(min);
                  return [...prev];
                });
              }
            })
            .catch((err) => {
              trimitemEroareaInNode(err, user ? user.uid : "fara user");
              console.log('err la OHLC');
              setIsEroareServer(3);
            });
        } else {
          let ultim = arrayCuObiecte[index];
          //ultim.time = timp;
          if (ultim.high < price) ultim.high = price;
          if (ultim.low > price) ultim.low = price;
          ultim.close = price;
        }
        return [...arrayCuObiecte];
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
    <div>
      <div className="favoriteTabele">

      <div className="errEcran" >
        {isEroareServer && (
          <Alert severity="warning">ERR {isEroareServer}</Alert>
        )}
      </div>
        {user ? (
          <div>
            {!arrayCuObiecteFavorite.length ? 
            <div>
              <p className="pFav" >
                {scrisulPaginii?.[8]?.scris}
              </p>
                <div className="pozaPeCentru" >
                
                <img src={pozaInvatare} alt="Descrierea imaginii" />
                
              </div> 
              
              </div>
            : <div>
              {arrayCuObiecteFavorite.map((obiectPrincipal) => {

                function luamDateDinDetalii() {
                  let obiect = {};
                
                  let arrayFiltratCuDetalii = arrayCuDetalii?.filter(
                    (obiect) => obiect.symbol === obiectPrincipal.symbol
                  );

                  if (!arrayFiltratCuDetalii?.[0]) {
                    obiect.name = "";
                    obiect.description = "";
                    obiect.homepage_url = "";
                    obiect.id = "";
                    obiect.list_date = "";
                    obiect.logo_url = "";
                    obiect.market_cap = "";
                    obiect.symbol = "";
                  } else {
                    obiect.name = arrayFiltratCuDetalii[0].name;
                    obiect.description = arrayFiltratCuDetalii[0].description;
                    obiect.homepage_url = arrayFiltratCuDetalii[0].homepage_url;
                    obiect.id = arrayFiltratCuDetalii[0].id;
                    obiect.list_date = arrayFiltratCuDetalii[0].list_date;
                    obiect.logo_url = arrayFiltratCuDetalii[0].logo_url;
                    obiect.market_cap = arrayFiltratCuDetalii[0].market_cap;
                    obiect.symbol = arrayFiltratCuDetalii[0].symbol;
                  }
                  return obiect;
                }
                let rezultatDetalii = luamDateDinDetalii();

                function luamDateDinPreturi() {
                  let arrayFiltratCuPreturi = arrayCuPreturi.filter(
                    (obiect) => obiect.symbol === obiectPrincipal.symbol
                  );
                  return arrayFiltratCuPreturi;
                }
                let rezultatPreturi = luamDateDinPreturi();

                let arrayNouPret = rezultatPreturi.map(
                  ({ symbol, ...obiect }) => {
                    return { ...obiect };
                  }
                );
                let arrayPretFinal = arrayNouPret.map((obiect) => ({
                  ...obiect,
                  time: obiect.time.slice(0, 10),
                  open: Number(obiect.open),
                  high: Number(obiect.high),
                  low: Number(obiect.low),
                  close: Number(obiect.close),
                }));
                return (
                  <div className="divCuFiecareFavorit" key={obiectPrincipal.id}>
                    <h3 className="h3DinFavorite">{obiectPrincipal.symbol}</h3>
                    {rezultatDetalii.name === "" ? (
                      <div></div>
                    ) : (
                      <div>
                        <button
                          className="butonVeziDetalii"
                          onClick={() => veziDetaliiFunctie(rezultatDetalii.id)}
                        >
                          {veziDetalii === rezultatDetalii.id
                            ? scrisulPaginii?.[0]?.scris
                            : scrisulPaginii?.[1]?.scris}
                        </button>
                        {veziDetalii === rezultatDetalii.id && (
                          <div>
                            <p className="visitSiteWeb">
                              <Link to={rezultatDetalii.homepage_url}>
                                {scrisulPaginii?.[2]?.scris}
                              </Link>
                            </p>

                            <p>
                              <a className="numeCompanie">
                                {scrisulPaginii?.[3]?.scris}:
                              </a>{" "}
                              {rezultatDetalii.name}
                            </p>
                            <p>
                              <a className="detaliiCompanie">
                                {scrisulPaginii?.[4]?.scris}:
                              </a>{" "}
                              {rezultatDetalii.description}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    <div>
                      <div className="divPtChartSiDetalii">
                        <div className="chartDinFavorite">
                          <CandlestickChart data={arrayPretFinal} width={windowWidth <= 1000 ? windowWidth / 1.2 : 800} height={windowWidth <= 1000 ? windowWidth / 3.5 : 400}  />
                        </div>

                        <div className="detaliiImparteCuChart">
                          {rezultatDetalii.list_date === "" ? (
                            <div></div>
                          ) : (
                            <div className="detaliiFavorite">
                              <p className="numeCompanie">
                                {scrisulPaginii?.[5]?.scris}:{" "}
                                {rezultatDetalii.list_date.slice(0, 10)}
                              </p>

                              <p className="numeCompanie">
                                {scrisulPaginii?.[7]?.scris}:{" "}
                                {milionSauMiliard(rezultatDetalii.market_cap)} $
                              </p>
                            </div>
                          )}
                          <div className="detaliiFavorite">
                            {" "}
                            <button
                              className="cosDeGunoi"
                              onClick={()=>stergemDinFavorite(obiectPrincipal.symbol)}
                            >
                              <Gunoi />
                    
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>  }
          </div>
        ) : (
          <div>
            <h4>{scrisulPaginii?.[6]?.scris}</h4>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoriteNou;
