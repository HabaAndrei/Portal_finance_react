import React from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import Alert from "@mui/material/Alert";
import Home2 from "./Home2";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import LineChart from "./LineChart";
import { getUser } from "../User";
import { ContextLimbaAplicatiei, ContextUser, ContextIdWidth } from "../App";
import {
  trimitemEroareaInNode,
  luamScrisul,
  luamLimbaDinLocSto,
  vedemNumarulLimbii,
} from "../diverse";

const Home = () => {
  const [user, setUser] = React.useContext(ContextUser);
  const [isEroareServer, setIsEroareServer] = useState('');
  //const [user, setUser] = useState(null);
  const [arrayCuPreturi, setArrayCuPreturi] = useState([]);
  const [arata, setArata] = useState(null);
  const [symboluriGrafic, setSymboluriGrafic] = useState([]);
  const [arrayCuPreturiFU, setArrayCuPreturiFU] = useState([]);
  const [numeFrecventaFU, setNumeFrecventaFU] = useState("Top 50");
  const [limbaAplicatiei, setLimbaAplicatiei] = React.useContext(
    ContextLimbaAplicatiei
    );
  const [scrisulPaginii, setScrisulPaginii] = useState([]);
  const [windowWidth, setWindowWidth] = React.useContext(ContextIdWidth)

  ///////////////////////
  useEffect(() => {
    async function luamScris() {
      let limba = luamLimbaDinLocSto();
      const rezultat = await luamScrisul("home_js", limba);
      setScrisulPaginii(rezultat);
    }
    luamScris();

  }, []);

  useEffect(() => {
    async function schimbamLimba() {
      let lb = vedemNumarulLimbii(limbaAplicatiei);
      let rezultat = await luamScrisul("home_js", lb);
      setScrisulPaginii(rezultat);
    }
    schimbamLimba();
  }, [limbaAplicatiei]);

  useEffect(() => {
    if (user) {
      axios
        .get(`${window.adresa_cereri}/luamAvg`, {
          params: {
            uid: user.uid,
          },
        })
        .then((data) => {
          if (!data?.data) throw new Error("eroare luamAvg home js");
          let arrayNou = data.data.map((obiect) => ({
            ...obiect,
            zi: obiect.zi.slice(0, 10),
            avg: Number(obiect.avg.slice(0, 6)),
          }));
          let arrayNouFinal = arrayNou.map((obiect) => ({
            time: obiect.zi,
            price: obiect.avg,
          }));
          setArrayCuPreturi(arrayNouFinal);
        })
        .catch((err) => {
          trimitemEroareaInNode(err, user ? user.uid : "fara user");
          console.log('err avg');
          setIsEroareServer(1);
        });
    }
    axios
      .get(`${window.adresa_cereri}/luamAvgFaraUser`, {
        params: {
          numar: 50,
        },
      })
      .then((data) => {
        if (!data?.data) throw new Error("eroare luamAvg home  fu js");
        const arraySimplu = data.data;
        let arrayNou = arraySimplu.map((obiect) => ({
          time: obiect.zi.slice(0, 10),
          price: Number(obiect.avg.slice(0, 6)),
        }));
        setArrayCuPreturiFU(arrayNou);
        let stringSymboluri = data.data[0].coalesce;
        const symboluri = stringSymboluri
          .split(",")
          .map((symbol) => symbol.replace(",", ""));
        setSymboluriGrafic(symboluri);
      })
      .catch((err) => {
        trimitemEroareaInNode(err, user ? user.uid : "fara user");
        console.log('err avg fu');
        setIsEroareServer(2);
      });
  }, [user]);

  //////////////////////////// cod fara user

  //////////////////////////////////////////////////////
  function topValori(event) {
    const valoare = event.target.innerText;

    if (valoare === "Top 50") {
      setNumeFrecventaFU("Top 50");
      axios
        .get(`${window.adresa_cereri}/luamAvgFaraUser`, {
          params: {
            numar: 50,
          },
        })
        .then((data) => {
		console.log(data);
          if (!data?.data) throw new Error("eroare luamAvg home  fu 50 js");
          const arraySimplu = data.data;
          let arrayNou = arraySimplu.map((obiect) => ({
            time: obiect.zi.slice(0, 10),
            price: Number(obiect.avg.slice(0, 6)),
          }));
          setArrayCuPreturiFU(arrayNou);
          let stringSymboluri = data.data[0].coalesce;
          const symboluri = stringSymboluri
            .split(",")
            .map((symbol) => symbol.replace(",", ""));
          setSymboluriGrafic(symboluri);
        })
        .catch((err) => {
          trimitemEroareaInNode(err, user ? user.uid : "fara user");
          console.log('err, avg fu ---');
          setIsEroareServer(3);

        });
    } else if (valoare === "Top 100") {
      setNumeFrecventaFU("Top 100");
      axios
        .get(`${window.adresa_cereri}/luamAvgFaraUser`, {
          params: {
            numar: 100,
          },
        })
        .then((data) => {
          if (!data?.data) throw new Error("eroare luamAvg home 100 fu js");
          const arraySimplu = data.data;
          let arrayNou = arraySimplu.map((obiect) => ({
            time: obiect.zi.slice(0, 10),
            price: Number(obiect.avg.slice(0, 6)),
          }));
          setArrayCuPreturiFU(arrayNou);
          let stringSymboluri = data.data[0].coalesce;
          const symboluri = stringSymboluri
            .split(",")
            .map((symbol) => symbol.replace(",", ""));
          setSymboluriGrafic(symboluri);
        })
        .catch((err) => {
          trimitemEroareaInNode(err, user ? user.uid : "fara user");
          console.log('err, avg fu --0-');
          setIsEroareServer(4);


        });
    } else if (valoare === "Top 150") {
      setNumeFrecventaFU("Top 150");
      axios
        .get(`${window.adresa_cereri}/luamAvgFaraUser`, {
          params: {
            numar: 150,
          },
        })
        .then((data) => {
          if (!data?.data) throw new Error("eroare luamAvg home 150 fu js");
          const arraySimplu = data.data;
          let arrayNou = arraySimplu.map((obiect) => ({
            time: obiect.zi.slice(0, 10),
            price: Number(obiect.avg.slice(0, 6)),
          }));
          setArrayCuPreturiFU(arrayNou);
          let stringSymboluri = data.data[0].coalesce;
          const symboluri = stringSymboluri
            .split(",")
            .map((symbol) => symbol.replace(",", ""));
          setSymboluriGrafic(symboluri);
        })
        .catch((err) => {
          trimitemEroareaInNode(err, user ? user.uid : "fara user");
          console.log('err, avg fu 4---');
          setIsEroareServer(5);
        });
    }
  }

  function veziSymboluri() {
    if (arata) {
      setArata(null);
    } else {
      setArata("arata");
    }
  }

  
  return (
    <div className="divTot divPentruScroll">

      <div className="errEcran" >
        {isEroareServer && (
          <Alert severity="warning">ERR {isEroareServer}</Alert>
        )}
      </div>
      <div className="divStanga divStangaScroll">
        {user && arrayCuPreturi.length? (
          <div>
            <h4 className="averageH4">{scrisulPaginii?.[0]?.scris}</h4>
            <LineChart  data={arrayCuPreturi} width={windowWidth <= 1000 ? windowWidth : 800} height={windowWidth <= 1000 ? windowWidth / 3.5 : 400}  />{" "}
          </div>
        ) : (
          <div>
            <div className="treiButoaneFrecventa  incercTest">
              <button onClick={topValori} className="butonFrecventa">
                Top 50
              </button>
              <button onClick={topValori} className="butonFrecventa">
                Top 100
              </button>
              <button onClick={topValori} className="butonFrecventa">
                Top 150
              </button>
            </div>

            <h4 className="averageH4">{numeFrecventaFU}</h4>

            <div>
              <LineChart  data={arrayCuPreturiFU} width={windowWidth <= 1000 ? windowWidth : 800} height={windowWidth <= 1000 ? windowWidth / 3.5 : 400} />
            </div>

            <div>
              <button className="butonVeziDetalii" onClick={veziSymboluri}>
                {arata ? "Hide details" : "See details"}
              </button>
              <div className={arata ? "container" : "invizibil"}>
                {symboluriGrafic.map((symbol) => {
                  const sy = symbol.trim();
                  return (
                    <p className="elemP" key={symbol}>
                      {" "}
                      <Link className="fara" to={`/symbol/${sy}`}>
                        {symbol}
                      </Link>{" "}
                    </p>
                  );
                })}
              </div>
            </div>

           {user  ? 
            <div></div> :
            <div className="asezamPeCentru">
              <h4 className="h4">
                <Link to="/signIn">{scrisulPaginii?.[1]?.scris}</Link>
              </h4>
              <p className="p">{scrisulPaginii?.[3]?.scris}</p>
              <h4 className="h4">
                <Link to="/signUp">{scrisulPaginii?.[2]?.scris}</Link>
              </h4>
            </div>
           }
          </div>
        )}
      </div>

      <div className="divDreapta  divDreaptaScroll ">
        <Home2 />
      </div>
    </div>
  );
};

export default Home;

