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
    const data = await axios.get(`${process.env.REACT_APP_DOMAIN}/event/${id}`);
    setEventDetail(data.data);
  }

  function onBuyTicket(event, id) {
    let token = "Bearer ";
    setWs(
      io(`${process.env.REACT_APP_SOCKET}`, {
        auth: {
          token:
            token +
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiaWF0IjoxNjYyNjkwMTUxLCJleHAiOjE2NjMyOTQ5NTF9.b-PkIhjh5XBLq6BCvzeC9nZBV_atU4IP9bO3D5wf91k",
        },
      })
    );
    setSessionId(id);
  }

  useEffect(() => {
    getEventDetail();

    if (ws) {
      ws.disconnect();
      setWs(null);
      setSessionId(null);
    }
  }, []);

  useEffect(() => {
    if (ws) {
      console.log("success connect!");

      ws.on("check limit", (data) => {
        console.log("data", data);
        if (!data) {
          // to do - login hint
          console.log("Login error.");
          ws.disconnect();
          navigate("/login");
          return;
        }
        setWaitPeople(data.waitPeople);
        if (data.pass) {
          navigate("/ticket/area");
        } else {
          console.log("data", data);
          setWaitPeople(data.waitPeople);
          console.log("seconds", data.seconds);
          setLeftSeconds(data.seconds);
          navigate("/wait");
        }
      });

      return () => {
        ws.off("check limit");
      };
    }
  }, [ws]);

  useEffect(() => {
    if (sessionId) {
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
