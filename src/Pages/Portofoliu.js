import React from "react";

import axios from "axios";
import { useState, useEffect } from "react";
import Alert from "@mui/material/Alert";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
//import { getUser } from "../User";
import {
  ContextConexiuneWSPreturi,
  ContextLimbaAplicatiei,
  ContextUser, ContextIdConexiuneWS
} from "../App";
//import { ContextConexiuneWSPreturi } from "../FullPages";
import { styleDoiJS, TransparentBackdrop } from "../stylinguri";
import {
  trimitemArraySubscribe,
  trimitemEroareaInNode,
  luamScrisul,
  luamLimbaDinLocSto,
  vedemNumarulLimbii,
} from "../diverse";
import { ReactComponent as Close } from "../icons/close.svg";

const Portofoliu = () => {
  //let connection = window.diverseObiect.connection;
  //const [user, setUser] = useState(null);
  const idConexWS = React.useContext(ContextIdConexiuneWS)
  const [user, setUser] = React.useContext(ContextUser);
  const [alerta, setAlerta] = useState(false);
  const [pretulSymboluluiModal, setPretulSymboluluiModal] = useState();
  const [cantitateSymbolModal, setCantitateSymbolModal] = useState();
  const [alertaSucces, setAlertaSucces] = useState(false);
  const [alertaSuccesSell, setAlertaSuccesSell] = useState(false);
  const [valoareTranzactii, setValoareTranzactii] = useState();
  const [tranzactii, setTranzactii] = useState([]);
  const [numeFrecventaTopLost, setNumeFrecventaTopLost] = useState("Daily");
  const [numeFrecventaTopGain, setNumeFrecventaTopGain] = useState("Daily");
  const [valoareSelectata, setValoareaSelectata] = useState("");
  const [inputModal, setInputModal] = useState();
  const [symbolAlesModal, setSymbolAlesModal] = useState();
  const [literaInInput, setLiteraInInput] = useState("");
  const [rezultatCautare, setRezultatCautare] = useState([]);
  const [symbol, setSymbol] = useState("MSFT");
  const [numarInput, setNumarInput] = useState(1);
  const [plata, setPlata] = useState();
  const [symbolCantitatePortofel, setSymbolCantitatePortofel] = useState([]);
  const [valaorePortofel, setValoarePortofel] = useState();
  const [valaoreSymbol, setValoareSymbol] = useState();
  const [topLost, setTopLost] = useState([]);
  const [topGain, setTopGain] = useState([]);
  const [open, setOpen] = useState(false);
  let conexiuneCuPreturi = React.useContext(ContextConexiuneWSPreturi);
  const [limbaAplicatiei, setLimbaAplicatiei] = React.useContext(
    ContextLimbaAplicatiei
  );
  const [tranzatiiFaraUid, setTranzactiiFaraUid] = useState([]);

  const [scrisulPaginii, setScrisulPaginii] = useState([]);
  //////////////////////////////
  useEffect(() => {
    async function luamScris() {
      let limba = luamLimbaDinLocSto();
      const rezultat = await luamScrisul("portofoliu_js", limba);
      setScrisulPaginii(rezultat);
    }
    luamScris();

    if(!symbolCantitatePortofel.length){
      axios.get(`${window.adresa_cereri}/toateTranzactiileFaraUid`).then(data=>{
        setTranzactiiFaraUid(data.data);
      }).catch((err) => {
          trimitemEroareaInNode(err, user ? user.uid : "fara user");
          console.log('err, tranzactii fara uid');
        });
    }
  }, []);

  useEffect(() => {
    async function schimbamLimba() {
      let lb = vedemNumarulLimbii(limbaAplicatiei);
      let rezultat = await luamScrisul("portofoliu_js", lb);
      //console.log(rezultat);
      setScrisulPaginii(rezultat);
    }
    schimbamLimba();
  }, [limbaAplicatiei]);
  useEffect(() => {
    if (user) {
      facemTopGain(user);
      facemTopLost(user);
      istoricTranzactii(user);

      axios
        .get(`${window.adresa_cereri}/luamPretulDupaSymbol`, {
          params: {
            uid: user.uid,
            symbol: "MSFT",
          },
        })
        .then((data) => {
         // console.log(data.data);
          if (!data?.data?.[0]?.bani || !data?.data?.[0]?.banisymbol) {
            throw new Error("err luamPretDupaSymbol portof js");
          }
          const valaorePortofel = data.data[0].bani;
          const valaoreSymbol = data.data[0].banisymbol;
          //console.log(valaoreSymbol);
          setValoarePortofel(valaorePortofel);
          setValoareSymbol(valaoreSymbol);
          const inmultireBani = valaoreSymbol * numarInput;
          setPlata(inmultireBani);
        })
        .catch((err) => {
          trimitemEroareaInNode(err, user ? user.uid : "fara user");
          console.log('err pret dupa symbol');
        });
      axios
        .get(`${window.adresa_cereri}/luamDateDesprePortofoliu`, {
          params: {
            uid: user.uid,
          },
        })
        .then((data) => {
          if (!data?.data?.[0]) {
            throw new Error("err luamDateDesprePortofoliu portof js");
          }
          const arraySymb = data.data.map((ob) => ob.symbol);
          //////////////////////// trimit symbolurile de pe pagina =>
          trimitemArraySubscribe(arraySymb, idConexWS);
          //    < ==== ///////////////////////
          setSymbolCantitatePortofel(data.data);
        })
        .catch((err) => {
          trimitemEroareaInNode(err, user ? user.uid : "fara user");
          console.log('err date portofoliu');
        });
    }
  }, [user]);

  function facemTopGain(user) {
    axios
      .get(`${window.adresa_cereri}/topGainDailyPortofoliu`, {
        params: {
          uid: user.uid,
        },
      })
      .then((data) => {
        if (!data?.data) throw new Error("err top gain daily portof js");
        setTopGain(data.data);
        setNumeFrecventaTopGain(scrisulPaginii?.[14]?.scris);
      })
      .catch((err) => {
        trimitemEroareaInNode(err, user ? user.uid : "fara user");
        console.log('err top gain portofoliu');
      });
  }

  function facemTopLost(user) {
    axios
      .get(`${window.adresa_cereri}/topLostDailyPortofoliu`, {
        params: {
          uid: user.uid,
        },
      })
      .then((data) => {
        if (!data?.data) throw new Error("err top lost daily portof js");
        setTopLost(data.data);
        setNumeFrecventaTopLost(scrisulPaginii?.[14]?.scris);
      })
      .catch((err) => {
        trimitemEroareaInNode(err, user ? user.uid : "fara user");
        console.log('err top lost daily');

      });
  }
  ///////////////////////////////////////////////
  function actualizamInput(event) {
    const input = event.target.value;
    setLiteraInInput(input);
    axios
      .get(`${window.adresa_cereri}/cautamDupaInput`, {
        params: {
          input: input,
        },
      })
      .then((data) => {
        if (!data?.data?.rows) throw new Error("err caut input portof js");
        setRezultatCautare(data.data.rows);
      })
      .catch((err) => {
        trimitemEroareaInNode(err, user ? user.uid : "fara user");
        console.log('err input ')
      });
  }

  function vedemSymbolAles(event) {
    trimitemArraySubscribe([event.target.innerText], idConexWS);
    setSymbol(event.target.innerText);
    setLiteraInInput("");

    axios
      .get(`${window.adresa_cereri}/luamPretulDupaSymbol`, {
        params: {
          uid: user.uid,
          symbol: event.target.innerText,
        },
      })
      .then((data) => {
        if (!data?.data?.[0]?.bani || !data?.data?.[0]?.banisymbol) {
          throw new Error("err luamPretDupaSymbol portof js");
        }
        const valaorePortofel = data.data[0].bani;
        const valaoreSymbol = data.data[0].banisymbol;
        setValoarePortofel(valaorePortofel);
        setValoareSymbol(valaoreSymbol);
        ////////////////////
      })
      .catch((err) => {
        trimitemEroareaInNode(err, user ? user.uid : "fara user");
        console.log('err luam pret symbol porto');
      });
  }
  function vedemNumarInput(event) {
    setNumarInput(event.target.value);
  }

  function cumpara() {
    const inmultireBani = valaoreSymbol * numarInput;
    setPlata(inmultireBani);
    if (inmultireBani > valaorePortofel) {
      //console.log("nu ai destui bani");
      setAlerta(true);

      setTimeout(() => {
        setAlerta(false);
      }, 3500);
    } else {
      activamAlertaSucces();
      axios
        .get(`${window.adresa_cereri}/adaugamStockInPortofel`, {
          params: {
            uid: user.uid,
            symbol: symbol,
            cantitate: numarInput,
            valoare: valaoreSymbol,
          },
        })
        .then((data) => {
          console.log(data.data);
          if (!data?.data) throw new Error("err stock portofel portof js");
          setValoarePortofel(data.data);
          axios
            .get(`${window.adresa_cereri}/luamDateDesprePortofoliu`, {
              params: {
                uid: user.uid,
              },
            })
            .then((data) => {
              if (!data?.data) throw new Error("err date user  portof js");
              setSymbolCantitatePortofel(data.data);

              facemTopGain(user);
              facemTopLost(user);
              istoricTranzactii(user);
            })
            .catch((err) => {
              trimitemEroareaInNode(err, user ? user.uid : "fara user");
              console.log('err add date portof ');
            });
        })
        .catch((err) => {
          trimitemEroareaInNode(err, user ? user.uid : "fara user");
          console.log('err adaugare date port');
        });
    }
  }

  function calculeaza() {
    const inmultireBani = valaoreSymbol * numarInput;
    setPlata(inmultireBani);
  }

  //// modal
  ////
  function handleClose() {
    setOpen(false);
    setInputModal();
  }
  function vindemModal(symbol) {
    setOpen(true);
    setSymbolAlesModal(symbol);

    axios
      .get(`${window.adresa_cereri}/iauCantitateaSiPretulDupaSymbol`, {
        params: {
          symbol: symbol,
          uid: user.uid,
        },
      })
      .then((data) => {
        if (!data?.data?.[0])
          throw new Error("err stock CantitateaSiPretulDupaSymbol portof js");
        const { banisymbol, cantitate, cash } = data.data[0];
        // console.log(banisymbol, cantitate, cash);
        setPretulSymboluluiModal(banisymbol);
        setCantitateSymbolModal(cantitate);
      })
      .catch((err) => {
        trimitemEroareaInNode(err, user ? user.uid : "fara user");
        console.log('err cantitate pret symbol');
      });
  }
  function actualizamInputModal(event) {
    setInputModal(event.target.value);
  }

  function sell() {
    let baniPtIncasare = pretulSymboluluiModal * inputModal;

    if (cantitateSymbolModal >= inputModal && inputModal) {
      axios(`${window.adresa_cereri}/sesiuneaDeVanzare`, {
        params: {
          symbol: symbolAlesModal,
          cantitate: inputModal,
          baniPtIncasare: baniPtIncasare,
          uid: user.uid,
        },
      })
        .then((data) => {
          if (!data?.data) throw new Error("err sesiuneVanzare portof js");
          setOpen(false);
          activamAlertaSuccesSell();
          setValoarePortofel(data.data[0].cash);
          setSymbolCantitatePortofel(data.data);
          facemTopGain(user);
          facemTopLost(user);
          istoricTranzactii(user);
        })
        .catch((err) => {
          trimitemEroareaInNode(err, user ? user.uid : "fara user");
          console.log('err sell');
        });
    }
  }

  /////////// => partea cu fund
  const schimbValoarea = (event) => {
    setValoareaSelectata(event.target.value);
  };

  function addMoney() {
    axios
      .get(`${window.adresa_cereri}/addMoney`, {
        params: {
          uid: user.uid,
          bani: valoareSelectata,
        },
      })
      .then((data) => {
        if (!data?.data[0]?.sum) throw new Error("err add Money portof js");
        //console.log(data.data[0].sum);
        setValoarePortofel(data.data[0].sum);
      })
      .catch((err) => {
        trimitemEroareaInNode(err, user ? user.uid : "fara user");
        console.log('err add money ');
      });
  }
  //////////////////////////////////////
  function vedemFrecventaTopGain(frecventa) {
    //console.log(event.target.innerText);
    if (frecventa === "1") {
      setNumeFrecventaTopGain(scrisulPaginii?.[14]?.scris);
      axios
        .get(`${window.adresa_cereri}/topGainDailyPortofoliu`, {
          params: {
            uid: user.uid,
          },
        })
        .then((data) => {
          if (!data?.data) throw new Error("err gain daily portof js");
          setTopGain(data.data);
        })
        .catch((err) => {
          trimitemEroareaInNode(err, user ? user.uid : "fara user");
          console.log('err top gain daily');
        });
    } else if (frecventa === "2") {
      setNumeFrecventaTopGain(scrisulPaginii?.[15]?.scris);

      axios
        .get(`${window.adresa_cereri}/topGainWeeklyPortofoliu`, {
          params: {
            uid: user.uid,
          },
        })
        .then((data) => {
          if (!data?.data) throw new Error("err gain weekli portof js");
          setTopGain(data.data);
          //console.log(data.data);
        })
        .catch((err) => {
          trimitemEroareaInNode(err, user ? user.uid : "fara user");
          console.log('err top gain wek');

        });
    } else if (frecventa === "3") {
      setNumeFrecventaTopGain(scrisulPaginii?.[16]?.scris);
      axios
        .get(`${window.adresa_cereri}/topGainMonthlyPortofoliu`, {
          params: {
            uid: user.uid,
          },
        })
        .then((data) => {
          if (!data?.data) throw new Error("err gain monthly portof js");
          setTopGain(data.data);
          //console.log(data.data);
        })
        .catch((err) => {
          trimitemEroareaInNode(err, user ? user.uid : "fara user");
          console.log('err top gain mon');
        });
    }
  }

  function vedemFrecventaTopLost(frecventa) {
    if (frecventa === "1") {
      setNumeFrecventaTopLost(scrisulPaginii?.[14]?.scris);
      axios
        .get(`${window.adresa_cereri}/topLostDailyPortofoliu`, {
          params: {
            uid: user.uid,
          },
        })
        .then((data) => {
          if (!data?.data) throw new Error("err lost daily portof js");
          //console.log(data.data);
          setTopLost(data.data);
        })
        .catch((err) => {
          trimitemEroareaInNode(err, user ? user.uid : "fara user");
          console.log('err top lost daily');

        });
    } else if (frecventa === "2") {
      setNumeFrecventaTopLost(scrisulPaginii?.[15]?.scris);

      axios
        .get(`${window.adresa_cereri}/topLostWeeklyPortofoliu`, {
          params: {
            uid: user.uid,
          },
        })
        .then((data) => {
          if (!data?.data) throw new Error("err lost weekli portof js");
          //console.log(data.data);
          setTopLost(data.data);
        })
        .catch((err) => {
          trimitemEroareaInNode(err, user ? user.uid : "fara user");
          console.log('err top lost wek');
        });
    } else if (frecventa === "3") {
      setNumeFrecventaTopLost(scrisulPaginii?.[16]?.scris);
      axios
        .get(`${window.adresa_cereri}/topLostMonthlyPortofoliu`, {
          params: {
            uid: user.uid,
          },
        })
        .then((data) => {
          if (!data?.data) throw new Error("err lost monthly portof js");
          //console.log(data.data);
          setTopLost(data.data);
        })
        .catch((err) => {
          trimitemEroareaInNode(err, user ? user.uid : "fara user");
          console.log('err top lost mon');
        });
    }
  }
  function istoricTranzactii(user) {
    axios
      .get(`${window.adresa_cereri}/istoricTranzactii`, {
        params: {
          uid: user?.uid,
          limita: 10,
        },
      })
      .then((data) => {
        if (!data?.data) throw new Error("istoric tranzactii portof js");
        setValoareTranzactii(10);
        setTranzactii(data.data);
      })
      .catch((err) => {
        trimitemEroareaInNode(err, user ? user.uid : "fara user");
        console.log('err istoric');
      });
  }
  function activamAlertaSucces() {
    setAlertaSucces(true);
    setTimeout(() => {
      setAlertaSucces(false);
    }, 2500);
  }

  function activamAlertaSuccesSell() {
    setAlertaSuccesSell(true);
    setTimeout(() => {
      setAlertaSuccesSell(false);
    }, 2500);
  }

  function ultimeleTranzactii(event) {
    let limit = event.target.innerText;
    axios
      .get(`${window.adresa_cereri}/istoricTranzactii`, {
        params: {
          uid: user.uid,
          limita: limit,
        },
      })
      .then((data) => {
        if (!data?.data) throw new Error("err istoric tranzactii portof js");
        setValoareTranzactii(limit);
        setTranzactii(data.data);
      })
      .catch((err) => {
        trimitemEroareaInNode(err, user ? user.uid : "fara user");
        console.log('err istoric cu event');
      });
  }

  /////////////////////////////////////////////
  //////////////////// =>>> fac cod pentru a lua preturile real time cu useContext

  useEffect(() => {
    if (conexiuneCuPreturi.s === symbol) {
      setValoareSymbol(conexiuneCuPreturi.p);
    }

    if (conexiuneCuPreturi.s === symbolAlesModal) {
      setPretulSymboluluiModal(conexiuneCuPreturi.p);
    }
  }, [conexiuneCuPreturi]);

  function clickCuBlur(event){
     if(event.currentTarget.contains(event.relatedTarget))return;
     setLiteraInInput(false);
  }

  return (
    <div className="toataPagina">
      <div className="parteaDreapta">
        {user ? (
          <div className="flexInDoi  divPentruScroll ">
            <div className="parteaDreaptaUnu divStangaScroll  ">
              <div className="patratCalculatorPortofoliu">
                <div className="input-container" tabIndex="0" onBlur={clickCuBlur}>
                  <input
                    className="input_number"
                    onChange={vedemNumarInput}
                    type="number"
                    placeholder={scrisulPaginii?.[18]?.scris}
                  ></input>
                  <input
                    className="input_text"
                    type="text"
                    placeholder={scrisulPaginii?.[17]?.scris}
                    onChange={actualizamInput}
                  ></input>
                  {literaInInput ? (
                    <div className="inputPlinPortofoliu">
                      {rezultatCautare.map((obiect) => {
                        //console.log(obiect);
                        return (
                          <div key={obiect.id}>
                            <button
                              className="butonZero"
                              onClick={vedemSymbolAles}
                            >
                              <h4 className="totulPeZero rezultatCautareH">
                                {obiect.symbol}
                              </h4>
                            </button>
                            <hr className="delimitare" />
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div></div>
                  )}
                </div>
                <div className="body">
                  <div className="result-container">
                    <p className="p">
                      {symbol} - {valaoreSymbol}$
                    </p>
                    <p className="p">
                      {scrisulPaginii?.[0]?.scris}: {numarInput}
                    </p>
                    <p className="p">
                      {scrisulPaginii?.[1]?.scris}: {valaorePortofel} $
                    </p>
                  </div>
                </div>
                <div className="button-container">
                  <button onClick={calculeaza}>
                    {scrisulPaginii?.[2]?.scris}
                  </button>
                  <p>{plata} $</p>
                  <button onClick={cumpara}>Buy</button>
                  <div>
                    {alerta && (
                      <Alert severity="error">
                        {" "}
                        {scrisulPaginii?.[3]?.scris}{" "}
                      </Alert>
                    )}
                    {alertaSucces && (
                      <Alert severity="success" color="info">
                        {scrisulPaginii?.[4]?.scris}
                      </Alert>
                    )}
                  </div>
                </div>
              </div>
              <hr className="hr" />
              <div className="addMoney">
                <div style={{ display: "inline" }}>
                  {scrisulPaginii?.[5]?.scris}:{" "}
                  <Select value={valoareSelectata} onChange={schimbValoarea}>
                    <MenuItem value={100}>100$</MenuItem>
                    <MenuItem value={200}>200$</MenuItem>
                    <MenuItem value={500}>500$</MenuItem>
                    <MenuItem value={1000}>1000$</MenuItem>
                    <MenuItem value={5000}>5000$</MenuItem>
                  </Select>
                </div>
                <button
                  style={{ display: "inline" }}
                  className="buyButton"
                  onClick={addMoney}
                >
                  {scrisulPaginii?.[6]?.scris} <a>{valoareSelectata}</a>$
                </button>
              </div>
              
              {tranzactii.length ? 
                <div className="tranzactii">
                <div className="afPeCentru">
                  <button
                    className="butonFrecventa"
                    onClick={ultimeleTranzactii}
                  >
                    10
                  </button>
                  <button
                    className="butonFrecventa"
                    onClick={ultimeleTranzactii}
                  >
                    50
                  </button>
                  <button
                    className="butonFrecventa"
                    onClick={ultimeleTranzactii}
                  >
                    100
                  </button>
                  <p className="p">
                    {scrisulPaginii?.[7]?.scris} {valoareTranzactii}{" "}
                    {scrisulPaginii?.[8]?.scris}
                  </p>
                </div>
                {tranzactii.map((obiect) => {
                  let data = new Date(obiect.data).toLocaleString();
                  const ziua = data.slice(0, 10);
                  const ora = data.slice(12, 20);
               
                  return (
                    <p className="tranzactii paddingLeft" key={obiect.id}>
                      {ziua} / {ora} {obiect.cantitate.includes("-") ? "" : "+"}
                      {obiect.cantitate}
                      {obiect.symbol} ( {obiect.bani?.includes("-") ? "" : "+"}
                      {obiect.bani}$)
                    </p>
                  );
                })}
              </div> : <div> </div>
              }
            </div>
           
              {symbolCantitatePortofel.length ? 
              
                <div className="parteaDreaptaDoi divDreaptaScroll  " >
                  <div className="flex50 flex50unu ">
                  <h3>{scrisulPaginii?.[9]?.scris}</h3>

                  <div>
                    <div>
                      {alertaSuccesSell && (
                        <Alert severity="success" color="info">
                          {scrisulPaginii?.[4]?.scris}
                        </Alert>
                      )}
                    </div>

                    <table className="tabelPeCentru">
                      <tbody>
                        {symbolCantitatePortofel.map((obiect) => {
                          return (
                            <tr key={obiect.symbol}>
                              <td className="p">
                                {obiect.symbol} {obiect.cantitate}
                              </td>
                              <td>
                                <button
                                  className="buyButtonP "
                                  onClick={()=>vindemModal(obiect.symbol)}
                                >
                                  {scrisulPaginii?.[10]?.scris}{" "}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>

                    <div>
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
                            <Close />
                          </Button>
                          <p className="p">
                            {scrisulPaginii?.[11]?.scris}: {cantitateSymbolModal}{" "}
                            {symbolAlesModal}
                          </p>
                          <input
                            className="modal-input"
                            onChange={actualizamInputModal}
                            type="number"
                            placeholder="Enter the amount"
                          />
                          {inputModal ? (
                            <p className="p">
                              {" "}
                              {pretulSymboluluiModal * inputModal}$
                            </p>
                          ) : (
                            <p></p>
                          )}

                          <Button
                            sx={{
                              position: "absolute",
                              buttom: 0,
                              right: 200,
                            }}
                            onClick={sell}
                          >
                            {scrisulPaginii?.[10]?.scris}
                          </Button>
                        </Box>
                      </Modal>
                    </div>
                   </div>
                  </div>
                  <div className="flex50 douaDivuri">
                      <div className="div1">
                        <h4 className="h4topLostAndGain">
                          {scrisulPaginii?.[12]?.scris}
                        </h4>
                        <div className="treiButoaneFrecventa">
                          <button
                            className="butonFrecventa"
                            onClick={()=>vedemFrecventaTopGain('1')}
                          >
                            {scrisulPaginii?.[14]?.scris}
                            
                          </button>{" "}
                          <button
                            className="butonFrecventa"
                            onClick={()=>vedemFrecventaTopGain('2')}
                          >
                            {scrisulPaginii?.[15]?.scris}{" "}
                            
                          </button>{" "}
                          <button
                            className="butonFrecventa"
                            onClick={()=>vedemFrecventaTopGain('3')}
                          >
                            {scrisulPaginii?.[16]?.scris}
                          </button>
                        </div>
                        <h4 className="numeFrecventa">{numeFrecventaTopGain}</h4>

                        {topGain.map((obiect) => {
                        
                          return (
                            <p key={obiect.symbol} className="verdeTopGain">
                              {obiect.symbol} {obiect.procentaj.slice(0, 6)}%
                            </p>
                          );
                        })}
                      </div>

                  <div className="div2">
                    <h4 className="h4topLostAndGain">
                      {scrisulPaginii?.[13]?.scris}
                    </h4>
                    <div className="treiButoaneFrecventa">
                      <button
                        className="butonFrecventa"
                        onClick={()=>vedemFrecventaTopLost('1')}
                      >
                        {scrisulPaginii?.[14]?.scris}{" "}
                      </button>{" "}
                      <button
                        className="butonFrecventa"
                        onClick={()=>vedemFrecventaTopLost('2')}
                      >
                        {scrisulPaginii?.[15]?.scris}
                      </button>{" "}
                      <button
                        className="butonFrecventa"
                        onClick={()=>vedemFrecventaTopLost('3')}
                      >
                        {scrisulPaginii?.[16]?.scris}
                      </button>
                    </div>
                    <h4 className="numeFrecventa">{numeFrecventaTopLost}</h4>

                    {topLost.map((obiect) => {
                    
                      return (
                        <p key={obiect.symbol} className="rosuTopLost">
                          {obiect.symbol} {obiect.procentaj.slice(0, 6)}%
                        </p>
                      );
                    })}
                   </div>  
                  </div>
                </div> : 
                <div className="parteaDreaptaDoi divDreaptaScroll  "> 

                  <div className="tabelTranzFaraUid" >
                    <h4 className="p" > {scrisulPaginii?.[19]?.scris} </h4>
                  {/* aici adaug cod cu toate tranzactiile de la toti utilizatorii*/}
                    {tranzatiiFaraUid.map(obiect =>{
                      const ziua = obiect.data.slice(0, 10);
                      const ora = obiect.data.slice(11, 19);
                      return  <p className="tranzactii paddingLeft" key={obiect.id}>
                        {ziua} / {ora} {obiect.cantitate.includes("-") ? "" : "+"}
                        {obiect.cantitate}
                        {obiect.symbol} ( {obiect.bani?.includes("-") ? "" : "+"}
                        {obiect.bani}$)
                      </p>
                    })}
                  </div>
                </div>

              }
            
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};

export default Portofoliu;
