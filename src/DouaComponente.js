import React from "react";
import Primul from "./Components/Primul";
import Doi from "./Components/Doi";
import Trei from "./Components/Trei";
import { useState, useEffect } from "react";
import axios from "axios";

const DouaComponente = (props) => {
  const [arrayCuDate, setArrayCuDate] = useState([]);
  const [forceUpdate, setForceUpdate] = useState(false);

  useEffect(() => {
    axios.get(`${window.adresa_cereri}/luamDate`).then((data) => {
      setArrayCuDate(data.data);
    });
  }, []);

  return (
    <div className="ecranulMare  divPentruScroll  ">
      <div className="doi  divStangaScroll ">
        <Doi
          arrayCuDate={arrayCuDate}
          forceUpdate={forceUpdate}
          setForceUpdate={setForceUpdate}
        />
      </div>

      <div className="trei  divDreaptaScroll ">
        <Trei
          arrayCuDate={arrayCuDate}
          forceUpdate={forceUpdate}
          setForceUpdate={setForceUpdate}
        />
      </div>
    </div>
  );
};

export default DouaComponente;
