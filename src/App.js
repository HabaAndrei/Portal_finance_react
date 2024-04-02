import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Primul from "./Components/Primul";
import DouaComponente from "./DouaComponente.js";
import Notificare from "../src/Pages/Notificare.js";
import Home from "../src/Pages/Home.js";
import Favorite from "../src/Pages/Favorite.js";
import Symbol from "../src/Pages/Symbol.js";
import Portofoliu from "../src/Pages/Portofoliu.js";
import News from "../src/Pages/News.js";
import SignUp from "../src/Pages/SignUp.js";
import AI_Page from "../src/Pages/AI_Page.js";
import SignIn from "../src/Pages/SignIn.js";
import { useState, useEffect } from "react";
import { reconectare } from "./diverse.js";
import { getUser } from "./User";
import { ReactComponent as CloseX } from "./icons/closeX.svg";
import { ReactComponent as Hamburger } from "./icons/hamburger.svg";
import { stepButtonClasses } from "@mui/material";


const ContextConexiuneWSPreturi = React.createContext();
const ContextLimbaAplicatiei = React.createContext();
const ContextIdConexiuneWS = React.createContext();
const ContextIdWidth = React.createContext();
const ContextUser = React.createContext();


const App = () => {
  const [idConexWS, setIdConexWS] = useState('');
  const [conexiuneCuPreturi, setConexiuneCuPreturi] = useState({});
  const [limbaAplicatiei, setLimbaAplicatiei] = useState(
    JSON.parse(localStorage.getItem("limba"))?.limba
      ? JSON.parse(localStorage.getItem("limba"))?.limba
      : "en"
  );
  const [user, setUser] = useState(null);
  const [esteBurger, setEsteBurger] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);


  //////////////////////// => ws preturi

  function avemAccesLaPreturi(connection) {
    // console.log("se executa functia ");
    if (connection) {
      connection.onmessage = (e) => {
        const arrayDinMsg = JSON.parse(e.data);
        //console.log(arrayDinMsg);
        if (arrayDinMsg[0].type === "trade") {
          const t = arrayDinMsg[3].t;
          const p = arrayDinMsg[2].p;
          const s = arrayDinMsg[1].s;
          setConexiuneCuPreturi({ t, p, s });
        }
        if(arrayDinMsg[0].type === 'idulConexiunii'){
          setIdConexWS(arrayDinMsg[1].idulConexiunii);
        }
      };
    }
  }

  ///////////////////////////////
  useEffect(() => {
    avemAccesLaPreturi(window.diverseObiect.connection);
    getUser((user) => {
      setUser(user);
    });

    //// => cod pentru hamburger
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };

  }, []);
  
  //////////////////////
  window.diverseObiect.connection.onclose = () => {
    console.log("s-a inchis conexiune cu node din client ");
    reconectare(avemAccesLaPreturi);
  };

  window.diverseObiect.connection.onerror = (err) => {
    console.log( "avem eroare la ws client ");
  };

  ////////////////////////////////////////

  // => aici este codul pentru hamburger cu media query
  function schimbamHamburgerul(){
    setEsteBurger(!esteBurger);
  }
  useEffect(()=>{
    if(windowWidth > 1000)setEsteBurger(true);
  }, [windowWidth])
  return (
    <Router>
      <ContextLimbaAplicatiei.Provider
        value={[limbaAplicatiei, setLimbaAplicatiei]}
      >
        <ContextUser.Provider value={[user, setUser]}>
        <ContextIdWidth.Provider value={[windowWidth, setWindowWidth]}>  

          <div className="toataPagina">
            <button  className={esteBurger ? 'meniuDeschis' : 'meniuInchis'} onClick={schimbamHamburgerul} >
              {esteBurger ? <CloseX />:<Hamburger/>}
            </button>
            {
              esteBurger  &&(
                <div className="parteaStanga">
                  <Primul />
                </div>)
            }
            <div className="parteaDreapta">
              <ContextIdConexiuneWS.Provider value={idConexWS} >
              <ContextConexiuneWSPreturi.Provider value={conexiuneCuPreturi}>
                <Routes>
                  <Route
                    path="/"
                    element={
                      <>
                        <Notificare />
                        <Home className="doi" />
                      </>
                    }
                  />
                  <Route
                    path="/explore"
                    element={
                      <>
                        <Notificare />
                        <DouaComponente />
                      </>
                    }
                  />
                  <Route
                    path="/favorite"
                    element={
                      <>
                        <Notificare />
                        <Favorite />
                      </>
                    }
                  />
                  <Route
                    path="/symbol/:id"
                    element={
                      <>
                        <Notificare />
                        <Symbol />
                      </>
                    }
                  />
                  <Route
                    path="/portofoliu"
                    element={
                      <>
                        <Notificare />
                        <Portofoliu />
                      </>
                    }
                  />
                  <Route
                    path="/news"
                    element={
                      <>
                        <Notificare />
                        <News />
                      </>
                    }
                  />
                  <Route
                    path="/aiPage"
                    element={
                      <>
                        <Notificare />
                        <AI_Page />
                      </>
                    }
                  />
                  <Route
                    path="/signUp"
                    element={
                      <>
                        <Notificare />
                        <SignUp />
                      </>
                    }
                  />
                  <Route
                    path="/signIn"
                    element={
                      <>
                        <Notificare />
                        <SignIn />
                      </>
                    }
                  />
                 
                </Routes>
              </ContextConexiuneWSPreturi.Provider>
              </ContextIdConexiuneWS.Provider>
            </div>
          </div>
        </ContextIdWidth.Provider>  
        </ContextUser.Provider>
      </ContextLimbaAplicatiei.Provider>
    </Router>
  );
};

export { App, ContextConexiuneWSPreturi,ContextIdConexiuneWS, ContextLimbaAplicatiei, ContextUser, ContextIdWidth };
