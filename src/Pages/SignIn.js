import React from "react";
import { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { ContextLimbaAplicatiei, ContextUser } from "../App";
import {
  luamLimbaDinLocSto,
  luamScrisul,
  vedemNumarulLimbii,
} from "../diverse";

const SignIn = () => {

  const {REACT_APP_FIREBASE_KEY} = process.env;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [limbaAplicatiei, setLimbaAplicatiei] = React.useContext(
    ContextLimbaAplicatiei
  );
  const [user, setUser] = React.useContext(ContextUser);
  const [scrisulPaginii, setScrisulPaginii] = useState([]);
  //////////////////////////////
  useEffect(() => {
    async function luamScris() {
      //luamUser();
      let limba = luamLimbaDinLocSto();
      const rezultat = await luamScrisul("signin_js", limba);
      setScrisulPaginii(rezultat);
    }
    luamScris();
  }, []);
  useEffect(() => {
    async function schimbamLimba() {
      let lb = vedemNumarulLimbii(limbaAplicatiei);
      let rezultat = await luamScrisul("signin_js", lb);
      setScrisulPaginii(rezultat);
    }
    schimbamLimba();
  }, [limbaAplicatiei]);

  const actalizamEmail = (event) => setEmail(event.target.value);

  const actualizamPassword = (event) => setPassword(event.target.value);

  ////////////////////////////////////////

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

  function neConectamCuContSiParola(cont, parola) {
    firebase
      .auth()
      .signInWithEmailAndPassword(cont, parola)
      .then((userCredential) => {
        setUser(userCredential.user);
      })
      .catch((error) => {
        alert('Eroare la autentificare');
        console.log("Eroare la autentificare:");
      });
  }
  //////////////////////////// verificam cine e conectat si deconectam
  const neDeconectam = async () => {
    console.log("ne-am deconectat");

    try {
      await firebase.auth().signOut();
      setUser(null);
    } catch (error) {
      console.error("A apărut o eroare la deconectare");
    }
  };

  ///////////
  return (
    <div className="totAuth ">
      <div className="dreaptaAuth  peCentru">
        <div  className="edit" >
          {user ? (
            <div>
              <p>
                {scrisulPaginii?.[0]?.scris} {user.email}
              </p>
              <button className="butonSymboluriFavorite" onClick={neDeconectam}>
                {scrisulPaginii?.[1]?.scris}
              </button>
            </div>
          ) : (
            <div>
              <div>
                <p>Email</p>
                <input
                  className="inputInUp"
                  onChange={actalizamEmail}
                  placeholder="Email"
                ></input>
                <p>{scrisulPaginii?.[2]?.scris}</p>
                <input
                  className="inputInUp"
		  type="password"
                  onChange={actualizamPassword}
                  placeholder={scrisulPaginii?.[2]?.scris}
                ></input>
                <button
                  className="inputInUp"
                  onClick={() => neConectamCuContSiParola(email, password)}
                >
                  {scrisulPaginii?.[3]?.scris}
                </button>
              </div>

              <div id="containerVerifier"> </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignIn;
