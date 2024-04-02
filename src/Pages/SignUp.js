import React from "react";

import { useState, useEffect } from "react";
import axios from "axios";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import Alert from "@mui/material/Alert";
import { ContextLimbaAplicatiei, ContextUser } from "../App";
import {
  luamLimbaDinLocSto,
  luamScrisul,
  vedemNumarulLimbii,
} from "../diverse";
import {useNavigate} from "react-router-dom";

const SignUp = () => {

  const {REACT_APP_FIREBASE_KEY} = process.env;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [telefon, setTelefon] = useState("");
  const [nume, setNume] = useState("");
  const [prenume, setPrenume] = useState("");
  const [alerta, setAlerta] = useState(false);
  const navigate = useNavigate();

  const [limbaAplicatiei, setLimbaAplicatiei] = React.useContext(
    ContextLimbaAplicatiei
  );
  const [user, setUser] = React.useContext(ContextUser);

  const [scrisulPaginii, setScrisulPaginii] = useState([]);
  //////////////////////////////

  useEffect(() => {
    async function luamScris() {
      let limba = luamLimbaDinLocSto();

      const rezultat = await luamScrisul("signup_js", limba);
      setScrisulPaginii(rezultat);
    }
    luamScris();
  }, []);

  useEffect(() => {
    async function schimbamLimba() {
      let lb = vedemNumarulLimbii(limbaAplicatiei);
      let rezultat = await luamScrisul("signup_js", lb);
      
      setScrisulPaginii(rezultat);
    }
    schimbamLimba();
  }, [limbaAplicatiei]);
  
  const firebaseConfig = {
    apiKey: REACT_APP_FIREBASE_KEY,
    authDomain: "dashboard-finance-c4000.firebaseapp.com",
    projectId: "dashboard-finance-c4000",
    storageBucket: "dashboard-finance-c4000.appspot.com",
    messagingSenderId: "295444875451",
    appId: "1:295444875451:web:aed3fb5bac5c4a66fb419e",
    measurementId: "G-L5TP03GSET",
  };
  firebase.initializeApp(firebaseConfig);

  const auth = getAuth();
  
  
  const apasamPeSignUp = () => {
    if (!(nume && prenume && email && password && telefon)) {
      return alert("Please complete all the requirements");
    }
    
    createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      const user = userCredential.user;
      setUser(user);
      await axios
          .post(`${window.adresa_cereri}/DateUser`, {
            oraCreare: user.metadata.creationTime,
            codulUid: user.uid,
            email: email,
            parola: password,
            nume: nume,
            prenume: prenume,
            telefon: telefon,
          })
          .then((data) => {
            setAlerta(true);
            setNume("");
            setPrenume("");
            setTelefon("");
            setPassword("");
            setEmail("");
          });
      })
      .catch((error) => {
        console.log("nu s a creat user");
        if (error)alert(error.message);
      });
  };
  /////////////////////////////////////////
    
      useEffect(()=>{
    	if(alerta){
           navigate("/");
    	}
      }, [alerta])					

  return (
    <div className="totAuth ">
      <div className="dreaptaAuth peCentru">
        {user ? (
          <div  >
            <p className="p">{scrisulPaginii?.[0]?.scris}</p>
          </div>
        ) : (
          <div  className="edit" >
            <h4>{scrisulPaginii?.[1]?.scris}</h4>

            <p>{scrisulPaginii?.[3]?.scris}</p>
            <input
              className="inputInUp"
              placeholder={scrisulPaginii?.[3]?.scris}
              onChange={(event) => setNume(event.target.value)}
            ></input>

            <p>{scrisulPaginii?.[4]?.scris}</p>
            <input
              className="inputInUp"
              placeholder={scrisulPaginii?.[4]?.scris}
              onChange={(event) => setPrenume(event.target.value)}
            ></input>

            <p>{scrisulPaginii?.[5]?.scris}</p>
            <input
              className="inputInUp"
              placeholder={scrisulPaginii?.[5]?.scris}
              onChange={(event) => setTelefon(event.target.value)}
            ></input>

            <p>Email</p>
            <input
              className="inputInUp"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email"
            ></input>

            <p>{scrisulPaginii?.[2]?.scris}</p>
            <input
              className="inputInUp"
	      type="password"
              onChange={(event) => setPassword(event.target.value)}
              placeholder={scrisulPaginii?.[2]?.scris}
            ></input>

            <button className="inputInUp" onClick={apasamPeSignUp}>
              {scrisulPaginii?.[1]?.scris}
            </button>

            {alerta && (
              <Alert severity="success" color="info">
                Success
              </Alert>
            )}

            <div id="containerVerifier"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUp;
