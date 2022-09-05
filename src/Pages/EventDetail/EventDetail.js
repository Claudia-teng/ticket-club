import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";
import styles from "./EventDetail.module.sass";

function EventDetail({ sessionId, setSessionId, ws, setWs, setWaitPeople, setLeftSeconds }) {
  let navigate = useNavigate();
  let { id } = useParams();
  const [detail, setEventDetail] = useState(null);

  async function getEventDetail() {
    const data = await axios.get(`https://claudia-teng.com/api/event/${id}`);
    setEventDetail(data.data);
  }

  function onBuyTicket(event, id) {
    setWs(
      io("https://claudia-teng.com", {
        auth: {
          token: 1,
        },
      })
    );
    setSessionId(id);
  }

  useEffect(() => {
    getEventDetail();

    if (ws) {
      ws.disconnect();
    }
  }, []);

  useEffect(() => {
    if (ws) {
      console.log("success connect!");
      ws.on("check limit", (data) => {
        // console.log("data", data);
        setWaitPeople(data.waitPeople);
        if (data.pass) {
          navigate("/ticket/area");
        } else {
          console.log("data", data);
          setWaitPeople(data.waitPeople);
          // const expires = +data.milliseconds + 600 * 1000;
          // const seconds = Math.floor((expires - new Date().getTime()) / 1000) + 10;
          console.log("seconds", data.seconds);
          setLeftSeconds(data.seconds);
          navigate("/wait");
        }
      });
    }
  }, [ws]);

  useEffect(() => {
    console.log("check limit")
    if (sessionId) {
      console.log("sessionId", sessionId)
      ws.emit("check limit", sessionId);
    }
  }, [sessionId]);

  return (
    <>
      <div>EventDetail</div>
      {detail && (
        <div className={styles.container}>
          {/* <img alt="event-detail" src={detail.picture}/> */}

          <p>{detail.title}</p>
          <p>{detail.description}</p>
          {detail.sessions.map((session) => {
            return (
              <>
                <div className={styles.session}>
                  <p>{session.time}</p>
                  <p>{session.city}</p>
                  <p>{session.venue}</p>
                  <button onClick={(event) => onBuyTicket(event, session.session_id)}>購買票券</button>
                </div>
              </>
            );
          })}
        </div>
      )}
    </>
  );
}

export default EventDetail;
