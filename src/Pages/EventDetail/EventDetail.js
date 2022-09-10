import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";
import styles from "./EventDetail.module.sass";
import placeIcon from "../../assets/place.png";

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
      {detail && (
        <div className={styles.container}>
          <img alt="event-detail" src={detail.detailPicture} />
          <div className={styles.singerContainer}>
            <div className={styles.divider}></div>
            <div className={styles.singer}>
              <div>
                <h2>{detail.singer}</h2>
              </div>
            </div>
            <div className={styles.divider}></div>
          </div>
          <div className={styles.descriptionContainer}>
            <div dangerouslySetInnerHTML={{ __html: detail.description }}></div>
            <iframe src={detail.videoLink}></iframe>
          </div>

          <div className={styles.concertContainer}>
            <div className={styles.divider}></div>
            <div className={styles.text}>
              <div>
                <h2>All Concerts</h2>
              </div>
            </div>
            <div className={styles.divider}></div>
          </div>

          <div className={styles.sessionContainer}>
            {detail.sessions.map((session) => {
              return (
                <>
                  <div className={styles.sessionCard}>
                    <div>
                      <p>{new Date(session.time).getDate()}</p>
                      <p>
                        {new Date(session.time).getMonth() + 1} 月 {new Date(session.time).getFullYear()}
                      </p>
                      <p>{`${new Date(session.time).getHours()}:${
                        (new Date(session.time).getMinutes() < 10 ? "0" : "") + new Date(session.time).getMinutes()
                      }`}</p>
                    </div>
                    <div>
                      <div>
                        <img alt="place" src={placeIcon} />
                        <span>{session.city}</span> - <span>{session.venue}</span>
                      </div>
                      <p>{detail.title}</p>
                    </div>
                    <div>
                      <button onClick={(event) => onBuyTicket(event, session.session_id)}>購買票券</button>
                    </div>
                  </div>
                </>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}

export default EventDetail;
