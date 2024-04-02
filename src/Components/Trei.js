import React from "react";
import { useEffect, useState } from "react";
//import { Chart, Doughnut, Pie } from 'chart.js';
import { Pie, Doughnut } from "react-chartjs-2";
import "firebase/compat/auth";
import axios from "axios";
import { ContextLimbaAplicatiei, ContextUser } from "../App";
import {
  trimitemEroareaInNode,
  luamScrisul,
  luamLimbaDinLocSto,
  vedemNumarulLimbii, existaSymboluri
} from "../diverse";

const Trei = (props) => {
  const [user, setUser] = React.useContext(ContextUser);

  const [symbol5069, setSymbol5069] = useState("");
  const [count5069, setCount5069] = useState("");

  const [symbol7089, setSymbol7089] = useState("");
  const [count7089, setCount7089] = useState("");

  const [symbol9000, setSymbol9000] = useState("");
  const [count9000, setCount9000] = useState("");

  const [symbol0009, setSymbol0009] = useState("");
  const [count0009, setCount0009] = useState("");

  const [symbol1023, setSymbol1023] = useState("");
  const [count1023, setCount1023] = useState("");

  const [symbolMil, setSymbolMil] = useState();
  const [countMil, setCountMil] = useState("");

  const [symbolMld, setSymbolMld] = useState();
  const [countMld, setCountMld] = useState("");

  const [symbolTril, setSymbolTril] = useState();
  const [countTril, setCountTril] = useState("");

  const [symbol9249, setSymbol9249] = useState("");
  const [count9249, setCount9249] = useState("");

  const [limbaAplicatiei, setLimbaAplicatiei] = React.useContext(
    ContextLimbaAplicatiei
  );

  const [scrisulPaginii, setScrisulPaginii] = useState([]);

  ////////////////////
  useEffect(() => {
    async function luamScris() {
      let limba = luamLimbaDinLocSto();

      const rezultat = await luamScrisul("trei_js", limba);
      setScrisulPaginii(rezultat);
    }
    luamScris();
  }, []);

  useEffect(() => {
    async function schimbamLimba() {
      let lb = vedemNumarulLimbii(limbaAplicatiei);
      let rezultat = await luamScrisul("trei_js", lb);
      setScrisulPaginii(rezultat);
    }
    schimbamLimba();
  }, [limbaAplicatiei]);

  useEffect(() => {
    if (user) {
      setTimeout(() => {
        adaugamValoriChartDinTrei(user.uid);
      });
    }
  }, [props.forceUpdate]);

  function adaugamValoriChartDinTrei(uid) {
    axios
      .get(`${window.adresa_cereri}/datePtChart`, {
        params: {
          uid: uid,
        },
      })
      .then((data) => {
        let date = data.data.rows;
        
        let interval5069 = date.find(ob => ob.interval === 'interval5069')
        let interval9249 = date.find(ob => ob.interval === 'interval9248')
        let interval7089 = date.find(ob => ob.interval === 'interval7089')
        let interval9000 = date.find(ob => ob.interval === 'interval9000')
        let mld = date.find(ob => ob.interval === 'miliarde')
        let tril = date.find(ob => ob.interval === 'trilioane')
        let interval0009 = date.find(ob => ob.interval === 'interval0009')
        let interval1023 = date.find(ob => ob.interval === 'interval1023')
        let mil = date.find(ob => ob.interval === 'milioane')
        //console.log(interval0009, interval1023, interval5069, interval7089, interval9000, interval9249, mil, tril, mld);
        if (!(date || interval0009 || interval1023 || interval5069 || interval7089 || interval9000 || interval9249 || mil || mld || tril )){
          throw new Error("eroare la date pt chart tre js")}

        setSymbol9249(interval9249.coalesce);
        setCount9249(interval9249.count);

        setSymbol5069(interval5069.coalesce);
        setCount5069(interval5069.count);

        setSymbol7089(interval7089.coalesce);
        setCount7089(interval7089.count);

        setSymbol9000(interval9000.coalesce);
        setCount9000(interval9000.count);

        setSymbol0009(interval0009.coalesce);
        setCount0009(interval0009.count);

        setSymbol1023(interval1023.coalesce);
        setCount1023(interval1023.count);

        setSymbolMil(mil.coalesce);
        setCountMil(mil.count);

        setSymbolMld(mld.coalesce);
        setCountMld(mld.count);

        setSymbolTril(tril.coalesce);
        setCountTril(tril.count);
      })
      .catch((err) => {
        trimitemEroareaInNode(err, user ? user.uid : "fara user");
        console.log('eroare date pentru chart');
      });
  }

  function adaugamValoriChartDinTreiFaraUser() {
    axios
      .get(`${window.adresa_cereri}/datePtChartFaraUser`)
      .then((data) => {

        let date = data.data.rows;
        //console.log(date);
        if (!date ||  !date?.[0] ||  !date?.[1] ||  !date?.[2] ||  !date?.[3] ||  !date?.[4] ||  !date?.[5] ||  !date?.[6] ||  !date?.[7] ||  !date?.[8]) {
          throw new Error("eroare la datePtChartFaraUser trei js");
        }
        setSymbol9249(date[6].count);
        setCount9249(date[6].count);

        setSymbol5069(date[5].count);
        setCount5069(date[5].count);

        setSymbol7089(date[4].count);
        setCount7089(date[4].count);

        setSymbol9000(date[3].count);
        setCount9000(date[3].count);

        setSymbol0009(date[8].count);
        setCount0009(date[8].count);

        setSymbol1023(date[0].count);
        setCount1023(date[0].count);

        setSymbolMil(date[7].count);
        setCountMil(date[7].count);

        setSymbolMld(date[2].count);
        setCountMld(date[2].count);

        setSymbolTril(date[1].coalesce);
        setCountTril(date[1].count);

        
      })
      .catch((err) => {
        trimitemEroareaInNode(err, user ? user.uid : "fara user");
        console.log('eroare date pt chart fu');
      });
  }

  useEffect(() => {
    try{
      if (user) {
        adaugamValoriChartDinTrei(user.uid);
      } else {
        adaugamValoriChartDinTreiFaraUser();
      }
    }catch(err){
      console.log('eroare la val chart')
    }
  }, [user]);

  const chartUser1 = {
    labels: [
      symbol9249,
      symbol5069,
      symbol7089,
      symbol9000,
      symbol0009,
      symbol1023,
    ],
    datasets: [
      {
        label: "My First Dataset",
        data: [
          count9249,
          count5069,
          count7089,
          count9000,
          count0009,
          count1023,
        ],
        backgroundColor: [
          "green",
          "#394867",
          "rgb(65, 187, 211)",
          "#c8c8c8",
          "blue",
          "yellow",
        ],
      },
    ],
  };

  const notes = [
    "1892-1949",
    "1950 - 1969",
    "1970 - 1989",
    "1990 - 1999",
    "2000 - 2009",
    " > year 2010",
  ];

  const chartOptions = {
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const dataIndex = context.dataIndex;
            return `${notes[dataIndex]}`;
          },
        },
      },
    },
  };
  /////////////////////////////////////
  const chartUser2 = {
    labels: [symbolMil, symbolMld, symbolTril],
    datasets: [
      {
        label: "My First Dataset",
        data: [countMil, countMld, countTril],
        backgroundColor: ["#394867", "rgb(65, 187, 211)", "#c8c8c8"],
      },
    ],
  };
  const notes2 = ["<mld", "<trld", ">trld"];



  const chartOptions2 = {
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const dataIndex = context.dataIndex;
            return `${notes2[dataIndex]}`;
          },
        },
      },
    },
  };

  return (
    <div>
      {user ? (
        <div>
          <div className="chart1din2">
            <h4 className="h4Chart">{scrisulPaginii?.[0]?.scris}</h4>
            {existaSymboluri(chartUser1.labels) ? 
            <Pie data={chartUser1} options={chartOptions} />
            :
            <div className="patrat3Err" >
              <p className="p3" >{scrisulPaginii?.[4]?.scris}</p>
            </div>
            }
          </div>

          <div className="chart2din2">
            <h4 className="h4Chart">{scrisulPaginii?.[1]?.scris}</h4>
            {existaSymboluri(chartUser2.labels) ?
            <Doughnut data={chartUser2} options={chartOptions2} />
            :
            <div className="patrat3Err" >
              <p className="p3">{scrisulPaginii?.[4]?.scris}</p>
            </div>
            }
          </div>
        </div>
      ) : (
        <div>
          <div className="chart1din2">
            <h4 className="h4Chart">{scrisulPaginii?.[2]?.scris}</h4>
            <Doughnut data={chartUser1} options={chartOptions} />
          </div>

          <div className="chart2din2">
            <h4 className="h4Chart">{scrisulPaginii?.[3]?.scris}</h4>
            <Pie data={chartUser2} options={chartOptions2} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Trei;
