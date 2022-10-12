import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import styles from "./Index.module.sass";
import IndexImg from "../../assets/index.png";

function Index({ ws, setWs, setSessionId, orderConfirmInfo }) {
  const [events, setEvents] = useState([]);

  async function getEvents() {
    const data = await axios.get(`https://claudia-teng.com/event`);
    setEvents(data.data);
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
    </>
  );
}

export default Index;
