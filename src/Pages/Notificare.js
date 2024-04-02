import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import Alert from "@mui/material/Alert";
import { Link } from "react-router-dom";

//////////////////////// => modal
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { styleDoiJS } from "../stylinguri";
import { ContextLimbaAplicatiei } from "../App";
import {ReactComponent as Notificare} from '../icons/notificare.svg'

//////////////////////

const NotificareStire = () => {
  ///////////////////////////////////////////=> modal

  const [notification, setNotification] = useState([]);
  const [vizualizareNotificare, setVizualizareNotificare] = useState(false);
  const [open, setOpen] = useState(false);
  const [limbaAplicatiei, setLimbaAplicatiei] = React.useContext(
    ContextLimbaAplicatiei
  );

  /////////////////////////////////////
  const handleOpen = () => {
    setOpen(true);
    setVizualizareNotificare(false);
  };
  const handleClose = () => {
    setOpen(false);
  };
  ///////////////////////////////////////
  let notifi = {};
  useEffect(() => {
    const url = "wss://portalfinancechart.site:8008";
    const connection = new WebSocket(url);

    connection.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (JSON.stringify(data[0].uuid).slice(1, -1) !== notifi?.uuid) {
        notifi = data[0];
        setNotification(data[0]);
        setVizualizareNotificare(true);
      }
      connection.send(JSON.stringify("Am primit date de la tine"));
    };
    return () => {
      connection.close();
    };
  }, []);

  ////////////////////////////////////
  useEffect(() => {
    setInterval(() => {
      setVizualizareNotificare(false);
    }, 10 * 1000);
  }, [notification]);
  /////////////////////

  return (
    <div>
      {vizualizareNotificare ? (
        <div className="notification">
          <Button onClick={handleOpen}>
            {" "}
            <Alert severity="info">{notification.title}</Alert>
          </Button>
        </div>
      ) : (
        <div></div>
      )}
      {open ? (
        <div>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={styleDoiJS}>
              <h2>{notification.title}</h2>
              <p className="p">
                {notification.description}{" "}
                <Link to={notification.url}>
                  <Notificare/>
                </Link>
              </p>
              <img
                src={notification.image_url}
                style={{ maxWidth: "5cm", maxHeight: "5cm" }}
              />
              <p>
                Published at: {notification.published_at.slice(0, 10)} -{" "}
                {notification.published_at.slice(11, 19)}
              </p>
            </Box>
          </Modal>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default NotificareStire;
