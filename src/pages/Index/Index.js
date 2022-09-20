import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import styles from "./Index.module.sass";
import { useNavigate } from "react-router-dom";
import IndexImg from "../../assets/index.png";

function Index({ ws, setWs, setSessionId, orderConfirmInfo }) {
  let navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [events, setEvents] = useState([]);

  function onInputChange(event) {
    setSearchText(event.target.value);
  }

  async function onSearchInput(event) {
    try {
      const data = await axios.get(`${process.env.REACT_APP_DOMAIN}/event?search=${searchText}`);
      setEvents(data.data);
    } catch (err) {
      console.log("err", err);
    }
  }

  function onClickEvent(e, id) {
    navigate(`/event/${id}`);
  }

  async function getEvents() {
    try {
      const data = await axios.get(`${process.env.REACT_APP_DOMAIN}/event`);
      setEvents(data.data);
    } catch (err) {
      console.log("err", err);
    }
  }

  useEffect(() => {
    getEvents();

    if (ws) {
      ws.disconnect();
      setWs(null);
      setSessionId(null);
    }
  }, []);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.imgContainer}>
          <img alt="index" src={IndexImg} />
          <div className={styles.layer}></div>
        </div>
        <div className={styles.sloganContainer}>
          <div className={styles.divider}></div>
          <div className={styles.slogan}>
            <div>
              <h2>AMAZING ARTISTS</h2>
              <p>music for your soul</p>
            </div>
          </div>
          <div className={styles.divider}></div>
        </div>
        <div className={styles.cardContainer}>
          <div>
            {events &&
              events.map((event) => {
                return (
                  <>
                    <Link to={`event/${event.id}`}>
                      <div className={styles.card}>
                        <img alt="event" src={event.picture} />
                        <p>{event.singer}</p>
                      </div>
                    </Link>
                  </>
                );
              })}
          </div>
        </div>
      </div>
      {/* <div className={styles.input}>
        <input value={searchText} onChange={(event) => onInputChange(event)} />
        <button onClick={(event) => onSearchInput(event)}>搜尋</button>
      </div> */}
    </>
  );
}

export default Index;
