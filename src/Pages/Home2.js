import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import "firebase/compat/auth";
import Alert from "@mui/material/Alert";
import firebase from "firebase/compat/app";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { getUser } from "../User";
import { ContextLimbaAplicatiei, ContextUser } from "../App";
import {
  trimitemEroareaInNode,
  luamScrisul,
  luamLimbaDinLocSto,
  vedemNumarulLimbii,
} from "../diverse";

const Home2 = () => {
  //const [user, setUser] = useState(null);
  const [user, setUser] = React.useContext(ContextUser);
  const [isEroareServer, setIsEroareServer] = useState('');
  const [symbolMinMax, setSymbolMinMax] = useState([]);
  const [symbolMinMaxFU, setSymbolMinMaxFU] = useState([]);
  const [topGain, setTopGain] = useState([]);
  const [topLost, setTopLost] = useState([]);

  const [numeFrecventaTopGain, setNumeFrecventaTopGain] = useState("");
  const [numeFrecventaTopLost, setNumeFrecventaTopLost] = useState("");

  const [topGainFU, setTopGainFU] = useState([]);

  const [topLostFU, setTopLostFU] = useState([]);

  const [DailyFUTopGainTot, setDailyFUTopGainTot] = useState([]);
  const [DailyFUTopLostTot, setDailyFUTopLostTot] = useState([]);

  const [frecventaFUTopLost, setFrecventaFUTopLost] = useState("");
  const [frecventaFUTopGain, setFrecventaFUTopGain] = useState("");
  const [limbaAplicatiei, setLimbaAplicatiei] = React.useContext(
    ContextLimbaAplicatiei
  );
  const [scrisulPaginii, setScrisulPaginii] = useState([]);
  //////////////////////////////
  useEffect(() => {
    async function luamScris() {
      let limba = luamLimbaDinLocSto();
      const rezultat = await luamScrisul("home2_js", limba);
      setScrisulPaginii(rezultat);
    }
    luamScris();
    if(!user){
      luamDateFU_Generale()
    };
    if(user && !symbolMinMax.length) {
      luamDateFU_Generale();
    }
  }, []);

  useEffect(() => {
    async function schimbamLimba() {
      let lb = vedemNumarulLimbii(limbaAplicatiei);
      let rezultat = await luamScrisul("home2_js", lb);
      setScrisulPaginii(rezultat);
    }
    schimbamLimba();
  }, [limbaAplicatiei]);

  useEffect(() => {
    if (user) {
      axios
        .get(`${window.adresa_cereri}/luamFavoritePentruTrei`, {
          params: {
            uid: user.uid,
          },
        })
        .then((data) => {
          if (!data?.data) {
            throw new Error("eroare la luamFavoritePentruTrei home2 js");
          }
          setSymbolMinMax(data.data);
        })
        .catch((err) => {
          trimitemEroareaInNode(err, user ? user.uid : "fara user");
          console.log('err fav trei');
          setIsEroareServer(1);
        });

      //////////////////////////////

      axios
        .get(`${window.adresa_cereri}/topGainTopLostPeUltimaZi`, {
          params: {
            uid: user.uid,
          },
        })
        .then((data) => {
          if (!data?.data?.[0] || !data?.data?.[1]) {
            throw new Error("eroare la topGainTopLostPeUltimaZi home2 js");
          }
          setTopGain(data.data[0]);
          setTopLost(data.data[1]);
        })
        .catch((err) => {
          trimitemEroareaInNode(err, user ? user.uid : "fara user");
          console.log('top gan / lost zi');
          setIsEroareServer(2)
        });

      setNumeFrecventaTopGain(scrisulPaginii?.[0]?.scris);
      setNumeFrecventaTopLost(scrisulPaginii?.[0]?.scris);
    }

    if(!user){
      luamDateFU_Generale();
    }
  }, [user]);

  function luamDateFU_Generale(){
    setFrecventaFUTopGain(scrisulPaginii?.[0]?.scris);
    setFrecventaFUTopLost(scrisulPaginii?.[0]?.scris);

    axios
      .get(`${window.adresa_cereri}/frecventaDailyFUTopGain`)
      .then((data) => {
        if (!data?.data)
          throw new Error("eroare frecventa daily fu gain home 2 js");
        setDailyFUTopGainTot(data.data);
        setTopGainFU(data.data?.slice(0, 50));
      })
      .catch((err) => {
        trimitemEroareaInNode(err, user ? user.uid : "fara user");
        console.log('err top lost fu');
        setIsEroareServer(3)
      });
    axios
      .get(`${window.adresa_cereri}/frecventaDailyFUTopLost`)
      .then((data) => {
        if (!data?.data)
          throw new Error("eroare frecventa daily fu lost home 2 js");
        setDailyFUTopLostTot(data.data);
        setTopLostFU(data.data?.slice(0, 50));
      })
      .catch((err) => {
        console.log('err lost daily fu  ')
        setIsEroareServer(4)
        trimitemEroareaInNode(err, user ? user.uid : "fara user");
      });

    axios
      .get(`${window.adresa_cereri}/luamFavoritePentruTreiFaraUser`)
      .then((data) => {
        if (!data?.data) throw new Error("eroare favorite fu home 2 js");
        setSymbolMinMaxFU(data.data)
      })
      .catch((err) => {
        trimitemEroareaInNode(err, user ? user.uid : "fara user");
        console.log(' err 3/3');
        setIsEroareServer(5)
      });
  }

  function vedemFrecventaTopGain(valoareButon) {
    const uid = user.uid;
    if (valoareButon === "1") {
      setNumeFrecventaTopGain(scrisulPaginii?.[0]?.scris);
      axios
        .get(`${window.adresa_cereri}/topGainDaily`, {
          params: {
            uid: uid,
          },
        })
        .then((data) => {
          if (!data?.data) throw new Error("eroare top gain daily home 2 js");
          setTopGain(data.data);
        })
        .catch((err) => {
          setIsEroareServer(6)
          trimitemEroareaInNode(err, user ? user.uid : "fara user");
          console.log('err top gain daily');
        });
    } else if (valoareButon === "2") {
      setNumeFrecventaTopGain(scrisulPaginii?.[1]?.scris);
      axios
        .get(`${window.adresa_cereri}/topGainWeekli`, {
          params: {
            uid: uid,
          },
        })
        .then((data) => {
          if (!data?.data)
            throw new Error("eroare frecventa weekli  gain home 2 js");
          setTopGain(data.data);
        })
        .catch((err) => {
          setIsEroareServer(7)
          trimitemEroareaInNode(err, user ? user.uid : "fara user");
        });
    } else if (valoareButon === "3") {
      setNumeFrecventaTopGain(scrisulPaginii?.[2]?.scris);
      //console.log(valoareButon);
      axios
        .get(`${window.adresa_cereri}/topGainMonthly`, {
          params: {
            uid: uid,
          },
        })
        .then((data) => {
          if (!data?.data)
            throw new Error("eroare frecventa monthly gain home 2 js");
          setTopGain(data.data);
        })
        .catch((err) => {
          setIsEroareServer(8)
          trimitemEroareaInNode(err, user ? user.uid : "fara user");
        });
    }
  }

  function vedemFrecventaTopLost(valoareButon) {
    const uid = user.uid;
    if (valoareButon === "1") {
      setNumeFrecventaTopLost(scrisulPaginii?.[0]?.scris);
      axios
        .get(`${window.adresa_cereri}/topLostDaily`, {
          params: {
            uid: uid,
          },
        })
        .then((data) => {
          if (!data?.data)
            throw new Error("eroare frecventa lost daily home 2 js");
          setTopLost(data.data);
        })
        .catch((err) => {
          setIsEroareServer(9)
          trimitemEroareaInNode(err, user ? user.uid : "fara user");
        });
    } else if (valoareButon === "2") {
      setNumeFrecventaTopLost(scrisulPaginii?.[1]?.scris);

      axios
        .get(`${window.adresa_cereri}/topLostWeekli`, {
          params: {
            uid: uid,
          },
        })
        .then((data) => {
          if (!data?.data)
            throw new Error("eroare frecventa lost weekli home 2 js");
          setTopLost(data.data);
        })
        .catch((err) => {
          setIsEroareServer(10)
          trimitemEroareaInNode(err, user ? user.uid : "fara user");
          console.log('err lost weekli');
        });
    } else if (valoareButon === "3") {
      setNumeFrecventaTopLost(scrisulPaginii?.[2]?.scris);

      axios
        .get(`${window.adresa_cereri}/topLostMonthly`, {
          params: {
            uid: uid,
          },
        })
        .then((data) => {
          if (!data?.data)
            throw new Error("eroare frecventa lost monthly home 2 js");
          setTopLost(data.data);
        })
        .catch((err) => {
          setIsEroareServer(11)
          trimitemEroareaInNode(err, user ? user.uid : "fara user");
          console.log('err monthly');
        });
    }
  }
  //////////// impaginare interval =>
  const handleChange = (ev , numarulPaginii) => {
    const numarRandPostgres = (numarulPaginii - 1) * 50;
    axios
      .get(`${window.adresa_cereri}/impaginareDiv3/3FaraUser`, {
        params: {
          from: numarRandPostgres,
        },
      })
      .then((data) => {
        if (!data?.data) throw new Error("eroare impaginare div3/3 home 2 js");
        setSymbolMinMaxFU(data.data);
      })
      .catch((err) => {
        setIsEroareServer(12)
        trimitemEroareaInNode(err, user ? user.uid : "fara user");
        console.log('err min max');
      });
  };

  function topGainFaraUser(frecventa) {
    if (frecventa === "1") {
      setFrecventaFUTopGain(scrisulPaginii?.[0]?.scris);
      axios
        .get(`${window.adresa_cereri}/frecventaDailyFUTopGain`)
        .then((data) => {
          if (!data?.data) throw new Error("eroare daily gain fu home 2 js");
          setDailyFUTopGainTot(data.data);
          setTopGainFU(data.data?.slice(0, 50));
        })
        .catch((err) => {
          setIsEroareServer(13)
          trimitemEroareaInNode(err, user ? user.uid : "fara user");
          console.log('err daily fu');
        });
    } else if (frecventa === "2") {
      setFrecventaFUTopGain(scrisulPaginii?.[1]?.scris);

      axios
        .get(`${window.adresa_cereri}/frecventaWeekliFUTopGain`)
        .then((data) => {
          if (!data?.data) throw new Error("eroare gain fu weekli  home 2 js");
          setDailyFUTopGainTot(data.data);
          setTopGainFU(data.data?.slice(0, 50));
        })
        .catch((err) => {
          setIsEroareServer(14)
          trimitemEroareaInNode(err, user ? user.uid : "fara user");
          console.log('err week fu');
        });
    } else if (frecventa === "3") {
      setFrecventaFUTopGain(scrisulPaginii?.[2]?.scris);

      axios
        .get(`${window.adresa_cereri}/frecventaMonthlyFUTopGain`)
        .then((data) => {
          if (!data?.data) throw new Error("eroare gain fu monthly home 2 js");
          setDailyFUTopGainTot(data.data);
          setTopGainFU(data.data?.slice(0, 50));
        })
        .catch((err) => {
          setIsEroareServer(15)
          trimitemEroareaInNode(err, user ? user.uid : "fara user");
          console.log('monthh err');
        });
    }
  }

  function impaginareTopGainFU(ev, numarPagina) {
    setTopGainFU(
      DailyFUTopGainTot?.slice(numarPagina * 50, numarPagina * 50 + 50)
    );
  }

  function topLostFaraUser(frecventa) {

    if (frecventa === "1") {
      setFrecventaFUTopLost(scrisulPaginii?.[0]?.scris);
      axios
        .get(`${window.adresa_cereri}/frecventaDailyFUTopLost`)
        .then((data) => {
          if (!data?.data) throw new Error("eroare lost fu daily home 2 js");
          setDailyFUTopLostTot(data.data);
          setTopLostFU(data.data?.slice(0, 50));
        })
        .catch((err) => {
          setIsEroareServer(16)
          trimitemEroareaInNode(err, user ? user.uid : "fara user");
          console.log('err lost fu');
        });
    } else if (frecventa === "2") {
      setFrecventaFUTopLost(scrisulPaginii?.[1]?.scris);

      axios
        .get(`${window.adresa_cereri}/frecventaWeekliFUTopLost`)
        .then((data) => {
          if (!data?.data) throw new Error("eroare lost fu weekli home 2 js");
          setDailyFUTopLostTot(data.data);
          setTopLostFU(data.data?.slice(0, 50));
        })
        .catch((err) => {
          setIsEroareServer(17)
          trimitemEroareaInNode(err, user ? user.uid : "fara user");
          console.log('err lost weekli');
        });
    } else if (frecventa === "3") {
      setFrecventaFUTopLost(scrisulPaginii?.[2]?.scris);

      axios
        .get(`${window.adresa_cereri}/frecventaMonthlyFUTopLost`)
        .then((data) => {
          if (!data?.data) throw new Error("eroare lost fu monthly home 2 js");
          setDailyFUTopLostTot(data.data);
          setTopLostFU(data.data?.slice(0, 50));
        })
        .catch((err) => {
          setIsEroareServer(18)
          trimitemEroareaInNode(err, user ? user.uid : "fara user");
          console.log('err month lost');
        });
    }
  }

  function impaginareTopLostFU(ev, numarPagina) {
    setTopLostFU(
      DailyFUTopLostTot?.slice(numarPagina * 50, numarPagina * 50 + 50)
    );
  }

  return (
    <div>
      <div className="treiDivuri">

        <div className="errEcran" >
          {isEroareServer && (
            <Alert severity="warning">ERR {isEroareServer}</Alert>
          )}
        </div>
        <div className="divUnuDinTrei">
          {user && symbolMinMax.length ? (
            <div>
              <h4 className="h4topLostAndGain">{scrisulPaginii?.[3]?.scris}</h4>
              <div className="treiButoaneFrecventa">
                <button
                  className="butonFrecventa"
                  onClick={()=>vedemFrecventaTopGain('1')}
                >
                  {scrisulPaginii?.[0]?.scris} 
                </button>{" "}
                <button
                  className="butonFrecventa"
                  onClick={()=>vedemFrecventaTopGain('2')}
                >
                  {scrisulPaginii?.[1]?.scris}
                </button>{" "}
                <button
                  className="butonFrecventa"
                  onClick={()=>vedemFrecventaTopGain('3')}
                >
                  {scrisulPaginii?.[2]?.scris}
                </button>
              </div>
              <h4 className="numeFrecventa">{numeFrecventaTopGain}</h4>

              {topGain.map((obiect) => {
                return (
                  <p
                    key={obiect.symbol}
                    className={
                      obiect.procentaj.includes("-")
                        ? "invizibil"
                        : "verdeTopGain"
                    }
                  >
                    {obiect.symbol} {obiect.procentaj.includes("-") ? "" : "+"}
                    {obiect.procentaj?.slice(0, 5)}%{" "}
                  </p>
                );
              })}
            </div>
          ) : (
            <div>
              <h4 className="h4topLostAndGain">{scrisulPaginii?.[3]?.scris}</h4>
              <div className="treiButoaneFrecventa">
                <button onClick={()=>topGainFaraUser('1')} className="butonFrecventa">
                  {scrisulPaginii?.[0]?.scris} 
                </button>
                <button onClick={()=>topGainFaraUser('2')} className="butonFrecventa">
                  {scrisulPaginii?.[1]?.scris} 
                </button>
                <button onClick={()=>topGainFaraUser('3')} className="butonFrecventa">
                  {scrisulPaginii?.[2]?.scris}
                </button>
              </div>
              <h4 className="numeFrecventa">{frecventaFUTopGain}</h4>

              {topGainFU.map((obiect) => {
                return (
                  <p key={obiect.symbol} className="verdeTopGain">
                    {obiect.symbol} {obiect.procentaj?.slice(0, 5)}%
                  </p>
                );
              })}

              <Stack spacing={4}>
                <Pagination
                  count={Math.floor(DailyFUTopGainTot.length / 50)}
                  onChange={impaginareTopGainFU}
                />
              </Stack>
            </div>
          )}
        </div>

        <div className="divDoiDinTrei">
          {user && symbolMinMax.length ? (
            <div>
              <h4 className="h4topLostAndGain">{scrisulPaginii?.[4]?.scris}</h4>
              <div className="treiButoaneFrecventa">
                <button
                  className="butonFrecventa"
                  onClick={()=>vedemFrecventaTopLost('1')}
                >
                  {scrisulPaginii?.[0]?.scris} 
                </button>{" "}
                <button
                  className="butonFrecventa"
                  onClick={()=>vedemFrecventaTopLost('2')}
                >
                  {scrisulPaginii?.[1]?.scris} 
                </button>{" "}
                <button
                  className="butonFrecventa"
                  onClick={()=>vedemFrecventaTopLost('3')}
                >
                  {scrisulPaginii?.[2]?.scris}
                </button>
              </div>
              <h4 className="numeFrecventa">{numeFrecventaTopLost}</h4>
              {topLost.map((obiect) => {

                return (
                  <p
                    key={obiect.symbol}
                    className={
                      obiect.procentaj.includes("-")
                        ? "rosuTopLost"
                        : "invizibil"
                    }
                  >
                    {obiect.symbol} {obiect.procentaj.includes("-") ? "" : "+"}
                    {obiect.procentaj?.slice(0, 5)}%
                  </p>
                );
              })}
            </div>
          ) : (
            <div>
              <h4 className="h4topLostAndGain">{scrisulPaginii?.[4]?.scris}</h4>
              <div className="treiButoaneFrecventa">
                <button onClick={()=>topLostFaraUser('1')} className="butonFrecventa">
                  {scrisulPaginii?.[0]?.scris}
                </button>
                <button onClick={()=>topLostFaraUser('2')} className="butonFrecventa">
                  {scrisulPaginii?.[1]?.scris}
                </button>
                <button onClick={()=>topLostFaraUser('3')} className="butonFrecventa">
                  {scrisulPaginii?.[2]?.scris}
                </button>
              </div>
              <h4 className="numeFrecventa">{frecventaFUTopLost}</h4>

              {topLostFU.map((obiect) => {
                return (
                  <p key={obiect.symbol} className="rosu">
                    {obiect.symbol} {obiect.procentaj?.slice(0, 6)}%
                  </p>
                );
              })}

              <Stack spacing={4}>
                <Pagination
                  count={Math.floor(DailyFUTopLostTot.length / 50)}
                  onChange={impaginareTopLostFU}
                />
              </Stack>
            </div>
          )}
        </div>

        <div className="divTreiDinTrei">
          {user && symbolMinMax.length ? (
            <div>
              <h4 className="h4topLostAndGain">{scrisulPaginii?.[5]?.scris}</h4>

              {symbolMinMax.map((obiect) => {
                return (
                  <p
                    key={obiect.symbol}
                    className={
                      obiect.procentaj.includes("-") ? "rosu" : "verde"
                    }
                  >
                    {obiect.symbol} {obiect.procentaj?.slice(0, 5)}%{" "}
                    {scrisulPaginii?.[6]?.scris}:{obiect.mindate?.slice(0, 10)}
                    {scrisulPaginii?.[7]?.scris}:{obiect.maxdate?.slice(0, 10)}
                  </p>
                );
              })}
            </div>
          ) : (
            <div>
              <div>
                <h4 className="h4topLostAndGain">{scrisulPaginii?.[5]?.scris}</h4>
                {symbolMinMaxFU.map((obiect) => {
                  
                  return (
                    <p
                      key={obiect.symbol}
                      className={
                        obiect.procentaj.includes("-") ? "rosu" : "verde"
                      }
                    >
                      {obiect.symbol} {obiect.procentaj?.slice(0, 5)}%{" "}
                      {scrisulPaginii?.[6]?.scris}:
                      {obiect.dataminima?.slice(0, 10)}{" "}
                      {scrisulPaginii?.[7]?.scris}:
                      {obiect.datamaxima?.slice(0, 10)}
                    </p>
                  );
                })}
                <Stack spacing={4}>
                  <Pagination count={146} onChange={handleChange} />
                </Stack>
              </div> 
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home2;

/*
1 daily 
2 weekly
3 monthly 
4 top gain 
5 top lost
6 interval
7 from 
8 to


insert into scris_limbi (pagina, text, en, ro, es) values ( 'home_js', 'text4_or',
														   'or', 
														   'sau', 
														   'o' )
														   
select * from scris_limbi 
*/
