import axios from "axios";

//const url = "ws://localhost:8003";
window.diverseObiect = {
  connection: new WebSocket("wss://portalfinancechart.site:8003"),
};
window.diverseObiect.connection.onopen = () => {
  console.log("suntem conectati ");
};
window.diverseObiect.connection.onclose = () => {
  console.log("s-a inchis conexiunea cu node server wss client");
};
////////////////////////////  http://localhost:5000
window.adresa_cereri = "https://api.portalfinancechart.site"; 
////////////////////////////
/////// => aici este codul pentru reconectare la reteaua ws clienti

function getRandomNumber(min, max) {
  let random = Math.random() * (max - min) + min;
  return random;
}
let milisecunde = 1000;
function reconectare(func) {
  let connection = window.diverseObiect.connection;
  setTimeout(() => {
    console.log(connection.readyState, "daca e trei se executa");
    if (connection.readyState === 3) {
      if (milisecunde > 10 * 60 * 1000) {
        milisecunde = 10 * 60 * 1000;
      } else {
        milisecunde *= 2;
      }

      // creez conexiunea noua =>>

      window.diverseObiect.connection = new WebSocket("wss://portalfinancechart.site:8003");

      // => recursivitate
      reconectare(func);
      console.log(
        milisecunde + getRandomNumber(milisecunde, milisecunde + 1000),
        "acestea sunt milisecundele"
      );
    } else {
      milisecunde = 1000;
      func(window.diverseObiect.connection);
      return;
    }
  }, milisecunde + getRandomNumber(milisecunde, milisecunde + 1000));
}
//////////// => functie care trimite arraySubsribe
function trimitemArraySubscribe(arr, id) {
  let connection = window.diverseObiect.connection;
  //console.log(arr);
  if (connection.readyState === 1){
    connection.send(JSON.stringify({ type: "arraySubscribe", array: arr, id: id}));
  }
}
///////////////////////////////////////////

function facemArrayFaraDulicate(array) {
  let arrarray = [];
  for (let i = 0; i < array.length; i++) {
    let obPrimul = array[i];
    let dublura = false;
    for (let j = i + 1; j < array.length; j++) {
      let obDoi = array[j];
      if (obPrimul.time === obDoi.time) {
        dublura = true;
        break;
      }
    }
    if (!dublura) {
      arrarray.push(obPrimul);
    }
  }
  return arrarray;
}

//////////////////////////////
function milionSauMiliard(numar) {
  let numarRotunjit = Math.round(numar);
  let numarRotunjitString = numarRotunjit.toString();

  let numarBun = "";

  if (numarRotunjitString.length >= 7 && numarRotunjitString.length <= 9) {
    numarBun = Math.floor(numarRotunjit / 1_000_000) + "M";
  } else if (
    numarRotunjitString.length >= 10 &&
    numarRotunjitString.length <= 12
  ) {
    numarBun = Math.floor(numarRotunjit / 1_000_000_000) + "B";
  } else if (numarRotunjitString.length >= 13) {
    numarBun = Math.floor(numarRotunjit / 1_000_000_000_000) + "T";
  }
  return numarBun;
}

/////////////////////////////////////////////
//// => trimitemEroareaInNode

async function trimitemEroareaInNode(err, uid) {
  try {
    await axios.get(`${window.adresa_cereri}/trimitemEroareaInServer`, {
      params: {
        uid: uid,
        err: err,
      },
    });
  } catch (err) {
    console.log("diverse err server");
  }
}

/////////////////// => luam scrisul in limba dorita
function luamScrisul(pagina, limba) {
   if(!limba)limba = 'en';
  //http://localhost:5000
	
  return axios
    .get(`${window.adresa_cereri}/scrisulPentruLimbaDorita`, {
      params: {
        pagina: pagina,
        limba: limba,
      },
    })
    .then((data) => {
      return data.data;
    });
}

////////// => iau limba daca exista din locale storage
function luamLimbaDinLocSto() {
  if (localStorage.limba) {
    let limba = JSON.parse(localStorage.limba).limba;
    //console.log(limba);
    if (limba) {
      return limba;
    }
  }
  return "en";
}

function vedemNumarulLimbii(numar) {
  let ob = { 1: "en", 2: "ro", 3: "es" };
  return ob[numar];
}

function punemLimbaInLocSto(numar) {
  let lb = vedemNumarulLimbii(numar);
  // console.log(lb);
  if (!lb) return;
  localStorage.setItem("limba", JSON.stringify({ limba: lb }));
}

function existaSymboluri(array){
  for(let i of array){
    if(isNaN(Number(i)))return true
  }
  return false
}


function milisecGreenwich() {
  var date = new Date(); 
  var utc = date.getTime() + (date.getTimezoneOffset() * 60000); 
  var currentTimeMillisGMT = utc + (3600000 * 0); 
  return currentTimeMillisGMT;
}

function damData(milisecDinUk){
  let milisUK = milisecGreenwich();
  let milisecAici = new Date().getTime();
  let diferenta = milisecAici - milisUK;
  const date = new Date(Number(milisecDinUk) + diferenta); 
  let year = date.getFullYear();
  let month = date.getMonth() + 1; 
  let day = date.getDate();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();  
  let formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;  
  return formattedDate;
}

function damLunaSiZiua(milisecUk_unu, milisecUK_doi){
  let dataUnu = damData(Number(milisecUk_unu));
  let dataDoi = damData(Number(milisecUK_doi));
  let ziuaUnu = dataUnu.slice(8, 10);
  let ziuaDoi = dataDoi.slice(8, 10);
  if(Number(ziuaUnu) < Number(ziuaDoi)){
    return damData(milisecUK_doi).slice(0 , 10);
  }
}


export {
  existaSymboluri,
  reconectare,
  facemArrayFaraDulicate,
  trimitemArraySubscribe,
  milionSauMiliard,
  trimitemEroareaInNode,
  luamScrisul,
  luamLimbaDinLocSto,
  vedemNumarulLimbii,
  punemLimbaInLocSto,
  damData,
  milisecGreenwich, 
  damLunaSiZiua
};
