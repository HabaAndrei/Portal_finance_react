import React from "react";
import "@mui/material/styles";
import { useState, useEffect, useContext, createContext, memo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import Button from "@mui/joy/Button";
import Avatar from "@mui/material/Avatar";
import { VisuallyHiddenInput } from "../stylinguri";
import { ContextLimbaAplicatiei, ContextUser } from "../App";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import NativeSelect from "@mui/material/NativeSelect";
import {
  trimitemEroareaInNode,
  luamScrisul,
  luamLimbaDinLocSto,
  vedemNumarulLimbii,
  punemLimbaInLocSto,
} from "../diverse";
import { ReactComponent as Planeta } from "../icons/planeta.svg";

//let nr = 1;
const Primul = () => {
  const [user, setUser] = React.useContext(ContextUser);

  const [rezultatCautare, setRezultatCautare] = useState([]);
  const [litereInInput, setLitereInInput] = useState("");
  const [numeUtilizator, setNumeUtilizator] = useState("");
  const [prenumeUtilizator, setPrenumeUtilizator] = useState("");
  const [telefonUtilizator, setTelefonUtilizator] = useState("");
  const [veziDetalii, setVeziDetalii] = useState(null);
  const [oraCreareUtilizator, setOraCreareUtilizator] = useState("");

  const [isEroareServer, setIsEroareServer] = useState(false);

  const [limbaAplicatiei, setLimbaAplicatiei] = useContext(
    ContextLimbaAplicatiei
  );
  const [scrisulPaginii, setScrisulPaginii] = useState([]);
  /////////////////////////////////

    
  function getDataAboutUser(){
    if (!user) return;
    axios
      .get(`${window.adresa_cereri}/luamDateleUtilizatorului`, {
        params: {
          uid: user.uid,
        },
      })
      .then((data) => {
        let { nume, prenume, telefon, oracreare } = data?.data?.[0];
        if (!data?.data?.[0] || !nume || !prenume || !telefon || !oracreare)
          throw new Error("eroare la luamDateleUtilizatorului primul js ");
        setNumeUtilizator(nume);
        setPrenumeUtilizator(prenume);
        setTelefonUtilizator(telefon);
        setOraCreareUtilizator(oracreare.slice(0, 10));
      })
      .catch((err) => {
        trimitemEroareaInNode(err, user ? user.uid : "fara user");
        setIsEroareServer(2);
      });
    
  }
  useEffect(() => {
    async function luamScris() {
      try {
        let limba = luamLimbaDinLocSto();
        const rezultat = await luamScrisul("primul_js", limba);
        setScrisulPaginii(rezultat);
      } catch (err) {
        throw new Error('nu s-a putut lua scrisul')
      }
    }
    luamScris();
   
  }, []);

  useEffect(()=>{
    getDataAboutUser();
  }, [user])
  //////////////////////////////////

  const actualizamInput = (event) => {
    const valoareInput = event.target.value;
    setLitereInInput(valoareInput);
    axios
      .get(`${window.adresa_cereri}/cautamDupaInput`, {
        params: {
          input: valoareInput,
        },
      })
      .then((data) => {
        if (!data?.data?.rows) throw new Error("cautam dupa input primul js ");
        setRezultatCautare(data.data.rows);
      })
      .catch((err) => {
        trimitemEroareaInNode(err, user ? user.uid : "fara user");
        setIsEroareServer(1);
        throw new Error('eroare la cautare input');
      });
  };

  
  function onMouseEnter() {
    setVeziDetalii("esteHover");
  }
  function onMouseLeave() {
    setVeziDetalii(null);
  }
  function dispareDiv() {
    setLitereInInput("");
  }

  /////////////////////// => upload photos
  function selectamFila(e) {
    // verific interiorul fisierului
    const array = [".png", ".png", ".jpg", ".img", ".jpeg"];
    function testam(string) {
      for (let i of array) {
        if (string.endsWith(i)) {
          return true;
        }
      }
      return false;
    }
    if (!testam(`${e.target.files[0].name}`)) {
      return console.log("te rog sa pui doar poze");
    }

    let fd = new FormData();
    fd.append("image", e.target.files[0]);
    axios
      .post(
        `${window.adresa_cereri}/uploadFile`,
        fd,
        {
          params: {
            uid: user.uid,
          },
        },
        {
          headers: {
            "Content-Type": "multipart/from-data",
          },
        }
      )
      .catch((err) => {
        trimitemEroareaInNode(err, user ? user.uid : "fara user");
        isEroareServer(true);
        throw new Error('eroare la adaugarea poze');
      });
  }

  ////////////////////////// => limba aplicatiei
  const handleChange = (event) => setLimbaAplicatiei(event.target.value);

  useEffect(() => {
    let lb = vedemNumarulLimbii(limbaAplicatiei);

    (async () => {
      try {
        const rezultat = await luamScrisul("primul_js", lb);
        setScrisulPaginii(rezultat);
      } catch (err) {
        setIsEroareServer(3);
        console.log('eroare la selectarea limbii')
      }
    })();
    punemLimbaInLocSto(limbaAplicatiei);
  }, [limbaAplicatiei]);
  //////////////////////////////////////
  ////////////// => facem un cod de eroare care rezista la reramdarea paginii
  useEffect(() => {
    if (isEroareServer) {
      setTimeout(() => {
        setIsEroareServer(false);
      }, 2500);
    }
  }, [isEroareServer]);

  let obLB = { en: 1, ro: 2, es: 3 };
  // cod onBlur pentru input
  function clickCuBlur(event){
     if(event.currentTarget.contains(event.relatedTarget))return;
     setLitereInInput(false);
  } 
  return (
    <div className="primul">
      <div className="dateUtilizator">
        <div>
          <div className="errEcran" >
            {isEroareServer && (
              <Alert severity="warning">ERR code {isEroareServer}</Alert>
            )}
          </div>
          {user ? (
            <div>
              <p className="pDinWelcome">{scrisulPaginii?.[0]?.scris},</p>
              <div>
                <Button component="label" color="none">
                  <VisuallyHiddenInput onChange={selectamFila} type="file" />

                  <Avatar  sx={{ width: 70, height: 70 }}
                    src={`${window.adresa_cereri}/${user.uid}.jpg`}
                  ></Avatar>
                </Button>
              </div>
              <h4
                className="numeUtilizator"
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
              >
                {numeUtilizator} {prenumeUtilizator}
              </h4>
              {veziDetalii ? (
                <div>
                  <p className="detaliiUtilizator">
                    {scrisulPaginii?.[1]?.scris}
                    {oraCreareUtilizator}
                  </p>
                </div>
              ) : (
                <div></div>
              )}
            </div>
          ) : (
            <h3 className="pDinWelcome">{scrisulPaginii?.[13]?.scris}</h3>
          )}
        </div>
      </div>

      <section className="aliniamPeCentru">
        <div onBlur={clickCuBlur} tabIndex="0" >
          <input
            className="inputSymbol"
            placeholder={scrisulPaginii?.[2]?.scris}
            onChange={actualizamInput}
          ></input>
          <div>
            <div>
              {litereInInput ? (
                <div className="inputPlin">
                  {rezultatCautare.map((obiect) => {
                    return (
                      <div key={obiect.id}>
                        <button onClick={dispareDiv} className="butonZero">
                          <h4 className="totulPeZero rezultatCautareH">
                            <Link to={`/symbol/${obiect.symbol}`}>
                              {obiect.symbol}
                            </Link>
                          </h4>
                          <p className="totulPeZero rezultatCautareP">
                            {obiect?.name}
                          </p>
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
          </div>
        </div>

        <div>
          <Link className="fara" to="/">
            <button className="butonSymboluriFavorite">
                {scrisulPaginii?.[3]?.scris}
            </button>
          </Link>
        </div>

        <div>
          <Link className="fara" to="/explore">
            <button className="butonSymboluriFavorite">
                {scrisulPaginii?.[4]?.scris}
            </button>
          </Link>
        </div>

        <div>
          <Link className="fara" to="/favorite">
            <button className={user ? "butonSymboluriFavorite" : "invizibil"}>
                {scrisulPaginii?.[5]?.scris}
            </button>
          </Link>
        </div>

        <div>
          <Link className="fara" to="/portofoliu">
            <button className={user ? "butonSymboluriFavorite" : "invizibil"}>
                {scrisulPaginii?.[6]?.scris}
            </button>
          </Link>
        </div>

        <div>
          <Link className="fara" to="/news">
            <button className={"butonSymboluriFavorite"}>
                {scrisulPaginii?.[7]?.scris}
            </button>
          </Link>
        </div>
        <div>
          <Link className="fara" to="/aiPage">
            <button className={!user ? "invizibil" : "butonSymboluriFavorite"}>
                AI page
            </button>
          </Link>
        </div>
        <div>
          <Link className="fara" to="/signIn">
            <button className="butonSymboluriFavorite">
                {user ? scrisulPaginii?.[8]?.scris : scrisulPaginii?.[9]?.scris}
            </button>
          </Link>
        </div>

        <div>
          <Link className="fara" to="/signUp">
            <button className={user ? "invizibil" : "butonSymboluriFavorite"}>
                {scrisulPaginii?.[10]?.scris}
            </button>
          </Link>
        </div>
      </section>

      <Box className="selectScris" sx={{ minWidth: 120 }}>
        <FormControl fullWidth>
          <InputLabel variant="standard" htmlFor="uncontrolled-native">
            {scrisulPaginii?.[11]?.scris}
            <Planeta />
          </InputLabel>
          <NativeSelect
            defaultValue={obLB[limbaAplicatiei]}
            inputProps={{
              id: "uncontrolled-native",
            }}
            onChange={handleChange}
          >
            <option value={1}>En</option>
            <option value={2}>Ro</option>
            <option value={3}>Es</option>
          </NativeSelect>
        </FormControl>
      </Box>
    </div>
  );
};

export default Primul;
