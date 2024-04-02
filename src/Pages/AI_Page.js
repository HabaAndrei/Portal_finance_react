

import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import {ContextUser} from "../App";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { styleDoiJS } from "../stylinguri";
import { v4 as uuidv4 } from 'uuid';
import { milisecGreenwich, damData, damLunaSiZiua} from '../diverse';
import { ReactComponent as Gunoi } from "../icons/gunoi.svg";
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Select from "@mui/material/Select";


const AI_Page = () => {
  const [scrisInput, setScrisInput] = useState('');
  const [user, setUser] = React.useContext(ContextUser);
  const [modalConvDeschis, setModalConvDeschis] = useState(false);
  const [idConversatie, setIdConversatie] = useState(''); 
  const [arCuObDeMesaje, setArCuObDeMesaje] = useState([]);
  const [arCuConversatii, setArCuConversatii] = useState([]);
  const [numeConversatie, setNumeConversatie] = useState('');
  const [isModalDelete, setIsModalDelete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalAddTokeni, setIsModalAddTokeni] = useState(false);
  const [isModalIstoric, setIsModalIstoric] = useState(false);
  const [baniInPortofel, setBaniInPortofel] = useState(0);
  const [valCumparTokeni, setValCumparTokeni] = useState('');
  const [numarTokeni, setNumarTokeni] = useState(0);
  const [arCuIstoricTokeni, setArCuIstoricToekni] = useState([]);
  function stergemParamDinUrl(){
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.delete('conv');
    window.history.pushState(null, '', `${window.location.pathname}?${urlParams}`);
  };

  function luamIdDinUrl (){
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('conv');
  };

  useEffect(()=>{
    const idDinUrl = luamIdDinUrl();
    if(idDinUrl &&  !idConversatie){
      apasamPeConversatiaDorita(idDinUrl);
    }
  }, [])


  function generamIdConversatie(){
    return  uuidv4().slice(0, 10);
  }

  function stocamMesajeInDB(arCuMesaje, idConversatie){
    axios.post(`${window.adresa_cereri}/stocamMesajeInDB`, {
      mesaje: arCuMesaje,
      id_conversatie: idConversatie, 
      data: milisecGreenwich()
    }).then((data)=>{
      // console.log(data.data)
    })
  }

  
  function stocamConversatiaInDB(user_uid, id_conversatie){
    axios.post(`${window.adresa_cereri}/stocamConversatiaInDB`, {
      user_uid: user_uid,
      id_conversatie: id_conversatie,
      data: milisecGreenwich()
    }).then((data)=>{
      // console.log(data.data)
    })
  }


  function scademTokeniSiAdaugamLaIstoric( uid, tokeni, data, id_conversatie, nume_conversatie){
    axios.post(`${window.adresa_cereri}/scademTokeniSiAdaugamLaIstoric`, {
      uid, tokeni, data, id_conversatie, nume_conversatie
    }).then((data)=>{
      // console.log(data.data);
    })
  }

  function trimitCerere_ai(intrebare){
    let amDaugatData = false;
    if(numarTokeni == 0)return alert("You don't have enough tokens, I recommend you to buy more")
    setIsLoading(true);
    let context = arCuObDeMesaje?.slice(arCuObDeMesaje.length - 5, arCuObDeMesaje.length);
    if(!context){
      context = [{
        mesaj: ' ',
        tip_mesaj: ' '
      }]
    }
    let int = {
      mesaj: intrebare,
      tip_mesaj: 'intrebare',
      data: milisecGreenwich()
    };    
    let rasp = {
      mesaj: '',
      tip_mesaj: 'raspuns',
      data: milisecGreenwich()
    }
    setArCuObDeMesaje((obiect)=>{
      let ziuaAnterioara = damData(arCuObDeMesaje[arCuObDeMesaje.length - 1]?.data)?.slice(8, 10)
      let ziuaDeAzi = damData(milisecGreenwich())?.slice(8, 10);
      if(ziuaAnterioara === ziuaDeAzi){
        return [... obiect, int, rasp];
      }else{
        amDaugatData = true;
        let dataBuna = damData(milisecGreenwich()).slice(0, 10)
        return [... obiect, {
          mesaj: dataBuna,
          tip_mesaj: 'schimbamZiua',
          data: dataBuna
        } ,int, rasp];
      }
    })
    fetch(`https://ai.portalfinancechart.site/cerereAI`, {method:'POST', body: JSON.stringify({ intrebare: intrebare, context: context}), headers:{
      "Content-Type": "application/json", "responseType": "stream"
    }}).then((response)=>{
      
      setScrisInput('');
      let reader = response.body.getReader();
      const decoder = new TextDecoder();
      let raspunsPartial = '';

      function readStream(){
        reader.read().then(({done, value})=>{
          if(done){
            // ===>>>>>>> cod pentru scadere de tokeni
            setNumarTokeni(numarTokeni -1);
            scademTokeniSiAdaugamLaIstoric(user.uid, -1 , milisecGreenwich(),  idConversatie, numeConversatie)
            // <<<===  
            setIsLoading(false);
            if(!idConversatie){
              const id = generamIdConversatie();
              setIdConversatie(id);
              setNumeConversatie(scrisInput?.slice(0, 10));
              stocamConversatiaInDB(user.uid, id);
              stocamMesajeInDB([int, rasp], id);
              const urlParams = new URLSearchParams(window.location.search);
              urlParams.set('conv', id);
              window.history.pushState(null, '', `${window.location.pathname}?${urlParams}`);
            }else{
              stocamMesajeInDB([int, rasp], idConversatie);
            }
          }else{
            let cuv =  decoder.decode(value, {stream: true});
            raspunsPartial+= cuv;
            readStream();
            setArCuObDeMesaje((prev)=>{
              // daca nu exista lungime adaug 2 pentru ca vrea sa mearga la raspuns
              // 0 = data ; 1 = intrebare ; 2 = raspuns => totul este asincron asa ca gandesc ianinte
              if(!arCuObDeMesaje.length){
                if(prev[arCuObDeMesaje.length + 2].tip_mesaj === 'raspuns'){
                  prev[arCuObDeMesaje.length + 2].mesaj += cuv;
                }
                return [...prev];
              }else{
              // daca am adaugat si ob cu data de azi trebuie sa maresc pozitia 
              // 0 = data ; 1 = intrebare ; 2 = raspuns => totul este asincron asa ca gandesc ianinte
                if(amDaugatData){
                  if(prev[arCuObDeMesaje.length + 2].tip_mesaj === 'raspuns'){
                    prev[arCuObDeMesaje.length + 2].mesaj += cuv;
                  }
                  return [...prev];
                }else{
                  if(prev[arCuObDeMesaje.length + 1].tip_mesaj === 'raspuns'){
                    prev[arCuObDeMesaje.length + 1].mesaj += cuv;
                  }
                  return [...prev];
                }
              }
            })
          }
        })
      }
      readStream();
    })
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      setScrisInput(scrisInput + '\n');
    }
  };

  function deschidemModalConversatii(){
    setModalConvDeschis(true);
    axios.get(`${window.adresa_cereri}/iauToateConversatiileDupaUid`, {
      params:{
        uid: user.uid
      }
    }).then((data)=>{
      setArCuConversatii(data.data);
    })
  }
  function inchidemModalConversatii(){
    setModalConvDeschis(false);
  }

  
  function apasamPeConversatiaDorita(idConversatie, numConv){
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('conv', idConversatie);
    window.history.pushState(null, '', `${window.location.pathname}?${urlParams}`);

    setModalConvDeschis(false);
    setIdConversatie(idConversatie);
    setNumeConversatie(numConv?.slice(0, 10));
    axios.get(`${window.adresa_cereri}/apasamPeConversatiaDorita`, {params:{
      idConv: idConversatie,

    }}).then((data)=>{

      if(data.data.length){
        let dataToata = damData(data.data[0].data).slice(0, 10);
        setArCuObDeMesaje([{mesaj: dataToata,
          tip_mesaj: 'schimbamZiua',
          data: dataToata
        }])
      }
      let arNou = [];
      for(let i = 1 ; i <=data.data.length; i++){
        let ob = data.data[i - 1];
        let data_unu = data.data[i - 1].data;
        let data_doi = data.data[i]?.data;
        arNou.push(ob);
        if(damLunaSiZiua(data_unu, data_doi)){
          let rez = damLunaSiZiua(data_unu, data_doi);
          arNou.push({mesaj: rez,
            tip_mesaj: 'schimbamZiua',
            data: rez
          })
        }
      }
      setNumeConversatie(data.data[0].mesaj);
      setArCuObDeMesaje((obDeja)=>  {return [...obDeja, ...arNou]});
    })
  }

  function facemNewChat(){
    stergemParamDinUrl();
    setIdConversatie('');
    setNumeConversatie('');
    setArCuObDeMesaje([]);
    setModalConvDeschis(false);
  }


  function stergemConversatia(){
    axios.get(`${window.adresa_cereri}/stergemConversatia`, {
      params:{
        id_conversatie: idConversatie
      }
    }).then((data)=>{
      stergemParamDinUrl();
      setNumeConversatie('');
      setIdConversatie('');
      setArCuObDeMesaje([]);
      setIsModalDelete(false);
    })
  }

  function deruleazaInJos (){
    const element = document.getElementById('scrollJos');
    element.scrollTop = element.scrollHeight;
  
  };
  useEffect(()=>{
    deruleazaInJos();
  }, [arCuObDeMesaje])

  function luamBaniiDinDB(){
    axios.get(`${window.adresa_cereri}/luamBaniiDinDB`, {params:{uid : user.uid}}).then((data)=>{
      setBaniInPortofel(data.data[0].sum);
    })
  }

  function luamTokeniDupaUser(){
    axios.post(`${window.adresa_cereri}/luamTokeniDupaUser`, {uid: user.uid}).then((data)=>{
      setNumarTokeni(Number(data.data[0].sum));
    })
  }

  useEffect(()=>{
    if(user){luamBaniiDinDB(); luamTokeniDupaUser()};

  }, [user]);

  function adaugamTokeniScademBani(numar){
    const obiectCuOferte = {1: {bani: -100, tokeni: 1000},
        2: {bani: -200, tokeni: 300}, 3: {bani: -500, tokeni: 1000}};
    let alegere = obiectCuOferte[numar];
    if(Math.abs(alegere.bani) < baniInPortofel){
      axios.post(`${window.adresa_cereri}/adaugamTokeniScademBani`, {alegere, uid: user.uid}).then((data)=>{
        setNumarTokeni(Number(data.data[0].sum));
        setIsModalAddTokeni(false);
      })
    }else{
      return alert("You don't have enough money")
    }
  }

  function aratamIstoricTokeni(){
    axios.post(`${window.adresa_cereri}/aratamIstoricTokeni`, {uid: user.uid}).then((data)=>{
      setArCuIstoricToekni(data.data);
    })
  }

  


  return (
    <div className='divFullAi'>
      <div className='modalConversatii'>
        <ul className="flex flex-wrap items-center justify-center text-gray-900 dark:text-white">
          <li>
            <Button
              className='text-sm px-5 py-2.5 me-2 mb-2'
              id="demo-customized-button"
              aria-controls={isMenuOpen ? 'demo-customized-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={isMenuOpen ? 'true' : undefined}
              variant="contained"
              disableElevation
              onClick={()=>setIsMenuOpen(!isMenuOpen)}
              endIcon={<KeyboardArrowDownIcon />}
            >
              Menu
            </Button>
            {isMenuOpen ? <section
              id="demo-customized-menu"
              className='pozitieAbsoluta'
            >
              <MenuItem onClick={()=>{setIsModalIstoric(true); setIsMenuOpen(false); aratamIstoricTokeni()}} disableRipple>
              Token Spending History 
              </MenuItem>
              <MenuItem onClick={()=>{ setIsModalAddTokeni(true); setIsMenuOpen(false); luamBaniiDinDB()}} disableRipple>
                Add token
              </MenuItem>
              <MenuItem disableRipple>
                {numarTokeni} tokens
              </MenuItem>
            </section> : <div></div>}
          </li>
          <li  >
            <button  className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700" onClick={deschidemModalConversatii} >
              Chat rooms
            </button>
          </li>
          <li>
            {numeConversatie ? 
            <p className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700" >Chat name: {numeConversatie}</p> : <p></p>}
          </li>
          <li>
            {idConversatie ? <button className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700" onClick={()=>{setIsModalDelete(true)}}> <Gunoi/> </button> : <p></p> }
          </li>
        </ul>           
      </div>

      <Modal
        open={isModalAddTokeni}
        onClose={()=>setIsModalAddTokeni(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={styleDoiJS}>
          <p>You have {baniInPortofel}$ and {numarTokeni} tokens</p>
          <div style={{ display: "inline" }}>
            {'Options'}:{" "}
            <Select value={valCumparTokeni} onChange={(event)=>{setValCumparTokeni(event.target.value)}} >
              <MenuItem  value={1}>{`100$ => 100 tok`}</MenuItem>
              <MenuItem value={2}>{`200$ => 300 tok`}</MenuItem>
              <MenuItem value={3}>{`500$ => 1000 tok`}</MenuItem>
            </Select>
            {' '}<button onClick={()=>{adaugamTokeniScademBani(valCumparTokeni)}} type="button" className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-2 py-2 text-center me-2 mb-2 ">Buy</button>
          </div>
        </Box>
      </Modal>    

      <Modal
        open={isModalIstoric}
        onClose={()=>setIsModalIstoric(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={styleDoiJS}  className='modalDinamic' >
          {arCuIstoricTokeni.map((obiect, index)=>{
            return <p className='elemP_tranz' key={index}>Conversation: {obiect.nume_conversatie} | {obiect.tokeni} tokeni | {damData(obiect.data).slice(0, 10)}{' '}{damData(obiect.data).slice(11, 16)}</p>
          })}
        </Box>
      </Modal>  


      
      <Modal
        open={modalConvDeschis}
        onClose={inchidemModalConversatii}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={styleDoiJS}  className='modalDinamic'>
        <button onClick={facemNewChat} className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700" >New chat</button>

          {arCuConversatii.length ? 
            <ul  className="max-w-md space-y-1 text-gray-500 list-none list-inside dark:text-gray-400">
              {arCuConversatii.map((obiectCuConv)=>{
                return <li  className="pb-3 sm:pb-4" key={obiectCuConv.id_conversatie}>
                <button  onClick={()=>apasamPeConversatiaDorita(obiectCuConv.id_conversatie, obiectCuConv.mesaj?.slice(0, 10))} >
                {obiectCuConv.mesaj} - Created at {damData(obiectCuConv.data).slice(0, 10)} | {damData(obiectCuConv.data).slice(11, 16)}
              </button> </li>
            }) }
            </ul>
              :
            <p> Unfortunately, you don't have any conversations </p>
          }
        </Box>
      </Modal>
             
      <Modal
        open={isModalDelete}
        onClose={()=>{setIsModalDelete(false)}}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={styleDoiJS}>
          <div className="p-4 md:p-5 text-center">
            <svg className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
            </svg>
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Are you sure you want to delete this chat?</h3>
            <button onClick={stergemConversatia} data-modal-hide="popup-modal" type="button" className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center me-2">
                Yes, I'm sure
            </button>
            <button onClick={()=>{setIsModalDelete(false)}} data-modal-hide="popup-modal" type="button" className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">No, cancel</button>
          </div>
        </Box>
      </Modal>
     

      <div className='divConv' id='scrollJos' >
        <div className='divConversatie'>
          {arCuObDeMesaje.length ?
            arCuObDeMesaje.map((obiect, index)=>{
              if(obiect.tip_mesaj === 'intrebare'){
                return <div key={index} className="flex items-start gap-2.5   marginDreaptaCovAi ">
                  <div className=" divIntrebareAi  flex flex-col w-full max-w-[600px] leading-1.5 p-4 border-gray-200  rounded-e-xl rounded-es-xl dark:bg-gray-700">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">You</span>
                      <span className="text-sm font-normal text-gray-500 dark:text-gray-400">{damData(obiect.data).slice(11, 16)}</span>
                    </div>
                    <p className="text-sm font-normal py-2.5 text-gray-900 dark:text-white">{obiect.mesaj}</p>
                  </div>
                </div>
              }else if(obiect.tip_mesaj === 'raspuns'){
                const isLasetIndex = index === arCuObDeMesaje.length - 1;
                return <div key={index} className="flex items-start gap-2.5 marginStangaCovAi ">
                  <div className="  flex flex-col w-full max-w-[600px] leading-1.5 p-4 border-gray-200  rounded-e-xl rounded-es-xl dark:bg-gray-700">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">AI</span>
                      <span className="text-sm font-normal text-gray-500 dark:text-gray-400">{damData(obiect.data).slice(11, 16)}</span>
                    </div>
                    <p className="text-sm font-normal py-2.5 text-gray-900 dark:text-white">{obiect.mesaj}</p>
                    {isLasetIndex &&  isLoading && <div className="spinner-grow" role="status"><span className="visually-hidden">Loading...</span></div> }
                  </div>
                </div>
              }else if(obiect.tip_mesaj === 'schimbamZiua'){
                return <div className='divDataCentru   text-sm font-normal text-gray-500 dark:text-gray-400' key={index} > {obiect.data} </div>
              }
            }) : 
            <div></div>
          }
        </div>
      </div>

      <div className='divChatFooter centered-container ' >
        <div className='divChat'>

        {isLoading ? 
          <div className=" overlay  flex  justify-center w-56 h-56  rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
            <div role="status">
                <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/></svg>
                <span className="sr-only">Loading...</span>
            </div>
          </div> : <div></div>
        }


          <textarea
            id="chat-input"
            value={scrisInput}
            onChange={(event) => setScrisInput(event.target.value)}
            onKeyDown={handleKeyPress} 
            className='dynamic-input'
            placeholder="Search ..."
            required
          />
          <button
            onClick={()=>trimitCerere_ai(scrisInput)}
            type="button"
            className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 shadow-lg shadow-purple-500/50 dark:shadow-lg dark:shadow-purple-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          >
          Send
          </button>
        </div>
      </div>
    </div>
  )
}
export default AI_Page
