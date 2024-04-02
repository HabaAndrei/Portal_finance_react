
import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useState, useEffect } from "react";
import "chart.js/auto";
import axios from "axios";
import "firebase/compat/auth";
import CandlestickChart from "../Pages/CandlestickChart";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import {
  ContextLimbaAplicatiei,
  ContextConexiuneWSPreturi,
  ContextUser,
  ContextIdConexiuneWS, ContextIdWidth
} from "../App";
import { styleDoiJS, TransparentBackdrop } from "../stylinguri";
import {
  trimitemArraySubscribe,
  trimitemEroareaInNode,
  luamScrisul,
  luamLimbaDinLocSto,
  vedemNumarulLimbii,
} from "../diverse";
import { ReactComponent as Stea } from "../icons/stea.svg";
import {ReactComponent as Close} from '../icons/close.svg';
import { styled } from '@mui/system';

///////////////////////////////

const Doi = (props) => {
  let arrayCuObiecte = props.arrayCuDate;
  const [isEroareServer, setIsEroareServer] = useState('');
  const [numeSymbol, setNumeSymbol] = useState("A");
  const [user, setUser] = React.useContext(ContextUser);
  const idConexWS = React.useContext(ContextIdConexiuneWS)
  const [valoareSort, setValoareSort] = useState("");
  const [arrayPtTabel, setArrayPtTabel] = useState(arrayCuObiecte);
  const [arataAlert, setArataAlert] = useState(false);
  const [valoarePortofel, setValoarePortofel] = useState();
  const [valoareSymbol, setValoareSymbol] = useState();
  const [symbolAlesCumparat, setSymbolAlesCumparat] = useState();
  const [inputNumar, setInputNumar] = useState('');
  const [alertaBani, setAlertaBani] = useState(false);
  const [open, setOpen] = useState(false);
  const [valaoreAscDesc, setValoareAscDesc] = useState(1);
  const [preturiChart, setPreturiChart] = useState([]);
  let conexiuneCuPreturi = React.useContext(ContextConexiuneWSPreturi);
  const [limbaAplicatiei, setLimbaAplicatiei] = React.useContext(
    ContextLimbaAplicatiei
  );
  const [scrisulPaginii, setScrisulPaginii] = useState([]);
  const [windowWidth, setWindowWidth] = React.useContext(ContextIdWidth)
  //////////////////////////////////////////

  //// =>>>>>>
  const CustomTableCell = styled('td')({

    padding: windowWidth < 1000 && 0,
    margin:  windowWidth < 1000 && 0,
    fontWeight:  "normal",
    fontSize: windowWidth < 500 && '10px'
  
  });
  /// <============

  useEffect(() => {
    async function luamScris() {
      let limba = luamLimbaDinLocSto();
      const rezultat = await luamScrisul("doi_js", limba);
      setScrisulPaginii(rezultat);
    }
    luamScris();

    axios
      .get(`${window.adresa_cereri}/luamDateDupaSymbol`, {
        params: {
          symbol: numeSymbol,
        },
      })
      .then((data) => {
        const arrayCuData = data.data;
        if (!data?.data) {
          throw new Error("eroare la luamDateDupaSymbol ");
        }
        const arrayNou = arrayCuData.map((obiect) => ({
          ...obiect,
          time: obiect.time.slice(0, 10),
          open: Number(obiect.open),
          high: Number(obiect.high),
          low: Number(obiect.low),
          close: Number(obiect.close),
        }));
        setPreturiChart(arrayNou);
      })
      .catch((err) =>{
        trimitemEroareaInNode(err, user ? user.uid : "fara user");
        setIsEroareServer(1);
      }
      );

    //////////////////////// trimit symbolurile de pe pagina =>
    trimitemArraySubscribe([numeSymbol], idConexWS);
    // < ==== ///////////////////////
  }, []);

  useEffect(() => {
    async function schimbamLimba() {
      let lb = vedemNumarulLimbii(limbaAplicatiei);
      let rezultat = await luamScrisul("doi_js", lb);
      setScrisulPaginii(rezultat);
    }
    schimbamLimba();
  }, [limbaAplicatiei]);

  function clickPeSymbol(event) {
    const symbol = event.target.innerText;
    setNumeSymbol(symbol);
    /////////////////////////

    trimitemArraySubscribe([symbol], idConexWS);

    ////////////////////////
    axios
      .get(`${window.adresa_cereri}/luamDateDupaSymbol`, {
        params: {
          symbol: symbol,
        },
      })
      .then((data) => {
        const arrayCuData = data.data;
        if (!data?.data) throw new Error("eroare la luamDateDupaSymbol ");

        const arrayNou = arrayCuData.map((obiect) => ({
          ...obiect,
          time: obiect.time.slice(0, 10),
          open: Number(obiect.open),
          high: Number(obiect.high),
          low: Number(obiect.low),
          close: Number(obiect.close),
        }));
        setPreturiChart(arrayNou);
      })
      .catch((err) =>{
        trimitemEroareaInNode(err, user ? user.uid : "fara user")
        setIsEroareServer(2)
      
      });
  }

  /////////////////// Tabel si functionalitati =>

  useEffect(() => {
    setArrayPtTabel([...props.arrayCuDate]);
  }, [props.arrayCuDate]);

  const schimbamValoareSort = (event) => setValoareSort(event.target.value);

  const schimbamValoareAscDesc = (event) =>
    setValoareAscDesc(event.target.value);

  function sortam() {
    let arraySortat = arrayPtTabel.sort((a, b) => {
      const valA = parseFloat(a[valoareSort]);
      const valB = parseFloat(b[valoareSort]);
      if (valA < valB) {
        return -1 * valaoreAscDesc;
      } else {
        return 1 * valaoreAscDesc;
      }
    });
    setArrayPtTabel([...arraySortat]);
  }

  /////////////////////////////
  const update = props.forceUpdate;
  /////////////////////////////
  function adaugLaFavorite(valoareSimbol) {
    ///// =>  daca nu este conectat nu poate adauga la favorite
    if (!user) {
      alert("Please Sign up or sign in");
      return;
    }
    axios
      .get(`${window.adresa_cereri}/adaugamInFavoriteUserSiSymbol`, {
        params: {
          user: user.uid,
          symbol: valoareSimbol,
        },
      })
      .then((data) => {
        props.setForceUpdate(!update);
      })
      .catch((err) =>{
        trimitemEroareaInNode(err, user ? user.uid : "fara user")
        setIsEroareServer(3);
      }
      );

    setArataAlert(true);

    setTimeout(() => {
      setArataAlert(false);
    }, 3500);
  }

  const handleChange = (value, event) => {
    const numarulPaginii = event;
    const numarRandPostgres = (numarulPaginii - 1) * 50;
    axios
      .get(`${window.adresa_cereri}/luamDateDupaRanduri`, {
        params: {
          numarRand: numarRandPostgres,
        },
      })
      .then((data) => {
        if (!data?.data) throw new Error("eroare luamDateDupaRanduri doi.js");
        const DateleCareAuVenit = data.data;
        setArrayPtTabel([...DateleCareAuVenit]);
      })
      .catch((err) =>{
        trimitemEroareaInNode(err, user ? user.uid : "fara user")
        setIsEroareServer(4)
      }
      );
  };

  ////////////////////////////////////////////
  ////
  function handleClose() {
    setOpen(false);
    setValoarePortofel();
    setSymbolAlesCumparat();
    setValoareSymbol();
    setInputNumar();
  }

  function actualizamInput(event) {
    setInputNumar(event.target.value);
  }
  function buy(symbol) {
    if (!user) {
      alert("Please Sign up or sign in ");
      return;
    }
    setOpen(true);
    ///////////////////////
    trimitemArraySubscribe([symbol], idConexWS);
    ///////////////////////
    setSymbolAlesCumparat(symbol);
    axios
      .get(`${window.adresa_cereri}/luamPretulDupaSymbol`, {
        params: {
          uid: user.uid,
          symbol: symbol,
        },
      })
      .then((data) => {
        if (!data?.data?.[0]?.bani || !data?.data?.[0]?.banisymbol) {
          throw new Error("Eroare in doi.js la luamPretulDupaSymbol");
        }
        setValoarePortofel(data.data[0].bani);
        setValoareSymbol(data.data[0].banisymbol);
      })
      .catch((err) =>{

        trimitemEroareaInNode(err, user ? user.uid : "fara user")
        setIsEroareServer(5);
      }
      );
  }

  function cumparam() {
    if (inputNumar * valoareSymbol > valoarePortofel) {
      setAlertaBani(true);
      setTimeout(() => {
        setAlertaBani(false);
      }, 3500);
      return;
    }

    axios
      .get(`${window.adresa_cereri}/adaugamStockInPortofel`, {
        params: {
          uid: user.uid,
          symbol: symbolAlesCumparat,
          cantitate: inputNumar,
          valoare: inputNumar * valoareSymbol,
        },
      })
      .then((data) => {
        if (!data?.data) throw new Error("eroare la adaugam stockInPortofel");
        setValoarePortofel(data.data);
        setOpen(false);
        setInputNumar('');
      })
      .catch((err) =>{
        setIsEroareServer(6);
        trimitemEroareaInNode(err, user ? user.uid : "fara user")
      }
      );
  }

  ///////////////////////// => cod pentru a aduga preturi in timp real cu useContext

  useEffect(() => {
    if (conexiuneCuPreturi.s === symbolAlesCumparat) {
      setValoareSymbol(conexiuneCuPreturi.p);
    }

    if (numeSymbol === conexiuneCuPreturi.s) {
      let time = conexiuneCuPreturi.t / 1000;
      let price = conexiuneCuPreturi.p;

      const tim = new Date(time * 1000);
      let an = tim.getFullYear();
      let luna = (tim.getMonth() + 1).toString().padStart(2, "0");
      var zi = tim.getDate().toString().padStart(2, "0");
      const timp = an + "-" + luna + "-" + zi;

      setPreturiChart((prev) => {
        let index = prev.findIndex((ob) => {
          return ob.time === timp;
        });

        if (index < 0) {
          axios
            .get(`${window.adresa_cereri}/luamPreturiOHLCdinRealTime`, {
              params: {
                s: numeSymbol,
              },
            })
            .then((data) => {
              
              if (
                !data?.data?.[0] ||
                !data?.data?.[0]?.max ||
                !data?.data?.[0]?.min ||
                !data?.data?.[0]?.open
              )
                throw new Error("eroare la luamPreturiOHLC din doi js");
              let { max, min, open } = data.data[0];

              let ultimulObiect = prev.slice(-1)[0];
              if (ultimulObiect.time === timp) {
                setPreturiChart((prev) => {
                  prev[prev.length - 1].open = Number(open);
                  prev[prev.length - 1].high = Number(max);
                  prev[prev.length - 1].low = Number(min);
                  return [...prev];
                });
              }
            })
            .catch((err) =>{
              setIsEroareServer(7);
              trimitemEroareaInNode(err, user ? user.uid : "fara user")
            }
            );

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
  }, [conexiuneCuPreturi]);

  

  return (
    <div className="doi">

      <div className="errEcran" >
        {isEroareServer && (
          <Alert severity="warning">ERR {isEroareServer}</Alert>
        )}
      </div>

      <div className="jumateSusDoi">
        <h4 className="totulPeZero">{numeSymbol}</h4>
        <div className="chartDinDoi">
          <CandlestickChart data={preturiChart} width={windowWidth <= 1000 ? windowWidth : 800} height={windowWidth <= 1000 ? windowWidth / 3.5 : 400}  />
        </div>
      </div>

      <div className="tabelTot">
        <div className="butonSort">
          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <InputLabel>
              <a className="cloaneTabel">{scrisulPaginii?.[0]?.scris}</a>
            </InputLabel>
            <Select
              value={valoareSort}
              label="Age"
              onChange={schimbamValoareSort}
            >
              <MenuItem value={"price"}>
                <a className="cloaneTabel">{scrisulPaginii?.[1]?.scris}</a>
              </MenuItem>
              <MenuItem value={"highest"}>
                <a className="cloaneTabel">{scrisulPaginii?.[2]?.scris}</a>
              </MenuItem>
              <MenuItem value={"lowest"}>
                <a className="cloaneTabel">{scrisulPaginii?.[3]?.scris}</a>
              </MenuItem>
              <MenuItem value={"open"}>
                <a className="cloaneTabel">{scrisulPaginii?.[4]?.scris}</a>
              </MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ m: 1, minWidth: 110 }} size="small">
            <InputLabel>
              <a className="cloaneTabel">{scrisulPaginii?.[5]?.scris}</a>
            </InputLabel>
            <Select
              value={valaoreAscDesc}
              label="Age"
              onChange={schimbamValoareAscDesc}
            >
              <MenuItem value={1}>
                <a className="cloaneTabel">{scrisulPaginii?.[6]?.scris}</a>
              </MenuItem>
              <MenuItem value={-1}>
                <a className="cloaneTabel">{scrisulPaginii?.[7]?.scris}</a>
              </MenuItem>
            </Select>
          </FormControl>

          <button className=" butonSortA" onClick={() => sortam()}>
            <a className="cloaneTabel ">{scrisulPaginii?.[8]?.scris}</a>
          </button>
        </div>

        <div>
          {arataAlert && (
            <Alert severity="success" color="info">
              {scrisulPaginii?.[9]?.scris}
            </Alert>
          )}
        </div>

        <div className="tabelSimboluri">
          <div className="tabelFaraButoane ">
            <TableContainer>
              <Table aria-label="caption table">
                <TableHead>
                  <TableRow>
                    <CustomTableCell>
                      {" "}
                      <a className="cloaneTabel">
                        {scrisulPaginii?.[10]?.scris}
                      </a>
                    </CustomTableCell>
                    <CustomTableCell align="right">
                      <a className="cloaneTabel">
                        {scrisulPaginii?.[1]?.scris}
                      </a>
                    </CustomTableCell>
                    <CustomTableCell align="right">
                      <a className="cloaneTabel">
                        {scrisulPaginii?.[2]?.scris}
                      </a>
                    </CustomTableCell>
                    <CustomTableCell align="right">
                      <a className="cloaneTabel">
                        {scrisulPaginii?.[3]?.scris}
                      </a>
                    </CustomTableCell>
                    <CustomTableCell align="right">
                      <a className="cloaneTabel">
                        {scrisulPaginii?.[4]?.scris}
                      </a>
                    </CustomTableCell>
                    <CustomTableCell align="right">
                      <a className="cloaneTabel">
                        {scrisulPaginii?.[11]?.scris}
                      </a>
                    </CustomTableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {arrayPtTabel.map((proprietati) => (
                    <TableRow key={proprietati.id}>
                      <CustomTableCell
                        className="cursorPointer"
                        onClick={clickPeSymbol}
                      >
                        {" "}
                        <a className="cloaneTabel">{proprietati.symbol}</a>
                      </CustomTableCell>
                      <CustomTableCell align="right">
                        <a className="cloaneTabel">{proprietati.price}</a>
                      </CustomTableCell>
                      <CustomTableCell align="right">
                        <a className="cloaneTabel">{proprietati.highest}</a>
                      </CustomTableCell>
                      <CustomTableCell align="right">
                        <a className="cloaneTabel">{proprietati.lowest}</a>
                      </CustomTableCell>
                      <CustomTableCell align="right">
                        <a className="cloaneTabel">{proprietati.open}</a>
                      </CustomTableCell>
                      <CustomTableCell align="right">
                        <a className="cloaneTabel">
                          {proprietati.data.slice(0, 10)}
                        </a>
                      </CustomTableCell>
                      <CustomTableCell>
                        <button
                          className="butonSteaFavorite"
                          onClick={()=>adaugLaFavorite(proprietati.symbol)}
                        >
                          <Stea/>
                        </button>
                        <button className="buyButton" onClick={()=>buy(proprietati.symbol)}>
                          {scrisulPaginii?.[12]?.scris}{" "}
                        </button>
                      </CustomTableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
                BackdropComponent={TransparentBackdrop}
              >
                <Box sx={styleDoiJS}>
                  <Button
                    sx={{ position: "absolute", top: 0, right: 0 }}
                    onClick={handleClose}
                  >
                    <Close/>
                  </Button>

                  <p className="p">
                    {symbolAlesCumparat} - {valoareSymbol}
                  </p>
                  <p className="p">
                    {scrisulPaginii?.[13]?.scris}: {valoarePortofel}$
                  </p>
                  <input
                    className="modal-input"
                    type="number"
                    placeholder="Enter the amount"
                    onChange={actualizamInput}
                  />

                  {inputNumar ? (
                    <p className="p">{inputNumar * valoareSymbol} $</p>
                  ) : (
                    <p></p>
                  )}
                  <div>
                    {alertaBani && (
                      <Alert severity="error">
                        {" "}
                        {scrisulPaginii?.[14]?.scris}!{" "}
                      </Alert>
                    )}
                  </div>
                  <Button
                    onClick={cumparam}
                    sx={{
                      position: "absolute",
                      buttom: 0,
                      right: 200,
                    }}
                  >
                    {scrisulPaginii?.[12]?.scris}
                  </Button>
                </Box>
              </Modal>

              <Stack spacing={4}>
                <Pagination count={146} onChange={handleChange} />
              </Stack>
            </TableContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Doi;
