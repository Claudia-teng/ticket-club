import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";
import styles from "./EventDetail.module.sass";
import placeIcon from "../../assets/place.png";

function EventDetail({ sessionId, setSessionId, ws, setWs, setWaitPeople, setLeftSeconds, setSessionInfo }) {
  let navigate = useNavigate();
  let { id } = useParams();
  const [detail, setEventDetail] = useState(null);

  async function getEventDetail() {
    const data = await axios.get(`${process.env.REACT_APP_DOMAIN}/event/${id}`);
    setEventDetail(data.data);
  }

  function onBuyTicket(event, session) {
    setWs(
      io(`${process.env.REACT_APP_SOCKET}`, {
        auth: {
          token: localStorage.getItem("jwt"),
        },
      })
    );
    setSessionId(session.session_id);
    session.title = detail.title;
    setSessionInfo(session);
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
        if (data === "Not login") {
          // to do - login hint
          console.log("Login error.");
          ws.disconnect();
          navigate("/login");
          return;
        }
        if (data === "Duplicate") {
          // to do - login hint
          console.log("You are already in event page or in queue.");
          ws.disconnect();
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
    if (ws && sessionId) {
      ws.emit("check limit", sessionId);
      // let _detail = JSON.parse(JSON.stringify(detail));
      // _detail.sessions.map((session) => {
      //   if (session.session_id === sessionId) {
      //     return (session.loading = true);
      //   } else {
      //     return (session.loading = false);
      //   }
      // });
      // setEventDetail(_detail);
    }
  }, [ws, sessionId]);

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
                <h2>On Sale</h2>
              </div>
            </div>
            <div className={styles.divider}></div>
          </div>

          <p className={styles.onSale}>
            {new Date(detail.onSale).getFullYear().toString()} 年 {(new Date(detail.onSale).getMonth() + 1).toString()}
            月 {new Date(detail.onSale).getDate().toString()} 日 {new Date(detail.onSale).getHours().toString()}:
            {(new Date(detail.onSale).getMinutes() < 10 ? "0" : "") + new Date(detail.onSale).getMinutes()}
          </p>

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
                      <button
                        className={
                          new Date(detail.onSale).getTime() > new Date().getTime() ||
                          new Date(session.time).getTime() <= new Date().getTime() ||
                          session.loading
                            ? styles.disabled
                            : ""
                        }
                        onClick={(event) => onBuyTicket(event, session)}
                        disabled={
                          new Date(detail.onSale).getTime() > new Date().getTime() ||
                          new Date(session.time).getTime() <= new Date().getTime() ||
                          session.loading
                        }
                      >
                        {new Date(detail.onSale).getTime() > new Date().getTime() && "尚未開賣"}
                        {new Date(session.time).getTime() <= new Date().getTime() && "活動結束"}
                        {new Date(detail.onSale).getTime() <= new Date().getTime() &&
                          new Date(session.time).getTime() > new Date().getTime() &&
                          !session.loading &&
                          "購買票券"}
                        {session.loading && <div className={styles.loader}></div>}
                      </button>
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
