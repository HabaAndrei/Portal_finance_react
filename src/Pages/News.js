import React from "react";

import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import Pagination from "@mui/material/Pagination";
import {
  trimitemEroareaInNode,
  luamScrisul,
  luamLimbaDinLocSto,
  vedemNumarulLimbii,
} from "../diverse";
import { ContextLimbaAplicatiei } from "../App";
import { ReactComponent as Stire } from "../icons/stire.svg";

const News = () => {
  const [news, setNews] = useState([]);
  const [numarulPaginiiApasat, setNumarulPaginiiApasat] = useState(1);
  const [vedemAscDesc, setVedemAscDesc] = useState("desc");
  const [numarPagini, setNumarPagini] = useState(10);

  const [scrisulPaginii, setScrisulPaginii] = useState([]);

  const [limbaAplicatiei, setLimbaAplicatiei] = useContext(
    ContextLimbaAplicatiei
  );
  /////////////////////////////////////////////////////

  function getNews(valoare, limit, offset){
    axios
    .get(`${window.adresa_cereri}/luamNews`, {
      params: {
        valoare: valoare,
        limit: limit,
        offset: offset,
      },
    })
    .then((data) => {
      if (!data?.data?.[0]) throw new Error("eroare luam news js");
      setNews(data.data);
      setNumarPagini(
        Math.ceil(data.data[0].numar__randuri / 10)
      );
    });
  } 

  useEffect(() => {
    async function luamCeleNecesare() {
      let limba = luamLimbaDinLocSto();
      let rezultat = await luamScrisul("news_js", limba);
      setScrisulPaginii(rezultat);
      getNews('desc', 10, 0);
    }
    luamCeleNecesare();
  }, []);

  useEffect(() => {
    async function schimbamLimba() {
      let lb = vedemNumarulLimbii(limbaAplicatiei);
      let rezultat = await luamScrisul("news_js", lb);
      //console.log(rezultat);
      setScrisulPaginii(rezultat);
    }
    schimbamLimba();
  }, [limbaAplicatiei]);
  function stiriPreferinta(val) {
    if (val === "1") {
      setVedemAscDesc("desc");
      getNews('desc', 10, numarulPaginiiApasat * 10 - 10 )

    } else if (val === "2") {
      setVedemAscDesc("asc");
      getNews('asc', 10, numarulPaginiiApasat * 10 - 10)
    }
  }

  const handleChange = (event, value) => {
    setNumarulPaginiiApasat(value);
    getNews(vedemAscDesc, 10, value * 10 - 10);
  };

  return (
    <div>
      <div className="toataPagina">
        <div className="parteaDreapta">
          <div>
            <button
              onClick={()=>stiriPreferinta('1')}
              type="button"
              className="btn btn-primary btn-sm"
            >
              {scrisulPaginii?.[0]?.scris} 
            </button>
            <button
              onClick={()=>stiriPreferinta('2')}
              type="button"
              className="btn btn-secondary btn-sm"
            >
              {scrisulPaginii?.[1]?.scris}
            </button>
          </div>
          {news.map((stire) => {
            return (
              <div className="chenarStire" key={stire.news_id}>
                <p className="titluStire">{stire.title_}</p>
                <p className="descriereStire">
                  {stire.description_}
                  <a href={`https://${stire.source_}`}>
                    <Stire />
                  </a>
                </p>
                <img className="imagineStire" src={stire.image_url} />
                <p className="dataStire">
                  {scrisulPaginii?.[2]?.scris}:
                  {stire.published__at.slice(11, 19)} -{" "}
                  {stire.published__at.slice(0, 10)}
                </p>
              </div>
            );
          })}
          <Pagination
            onChange={handleChange}
            count={numarPagini}
            color="primary"
          />
        </div>
      </div>
    </div>
  );
};

export default News;
