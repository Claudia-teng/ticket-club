import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";
import styles from "./EventDetail.module.sass";
import placeIcon from "../../assets/place.png";
import ErrorModal from "../../components/Modal/Modal";
import Modal from "react-bootstrap/Modal";

function EventDetail({
  sessionId,
  setSessionId,
  ws,
  setWs,
  setWaitPeople,
  setLeftSeconds,
  setSessionInfo,
  setQueuePeople,
}) {
  let navigate = useNavigate();
  let { id } = useParams();
  const [detail, setEventDetail] = useState(null);
  const [modal, setModal] = useState(false);
  const [warningModal, setWarningModal] = useState(false);
  const [msg, setMsg] = useState("");
  const [warningMsg, setWarningMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);

  async function getEventDetail() {
    try {
      const data = await axios.get(`https://claudia-teng.com/event/${id}`);
      setEventDetail(data.data);
    } catch (err) {
      navigate("/");
    }
  }

  async function onBuyTicket(event, session) {
    // disable button
    setLoading(true);
    let _detail = JSON.parse(JSON.stringify(detail));
    for (let item of _detail.sessions) {
      if (item.session_id === session.session_id) {
        item.loading = true;
      }
    }
    setEventDetail(_detail);

    const info = {
      sessionId: session.session_id,
    };
    let token = localStorage.getItem("jwt");
    try {
      await axios.post(`https://claudia-teng.com/session/validation`, info, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWs(
        io(`https://claudia-teng.com`, {
          auth: {
            token: `Bearer ${token}`,
          },
        })
      );
      setSessionId(session.session_id);
      session.title = detail.title;
      setSessionInfo(session);
    } catch (err) {
      // console.log("err", err);
      setLoading(false);
      let _detail = JSON.parse(JSON.stringify(detail));
      _detail.sessions.map((item) => (item.loading = false));
      setEventDetail(_detail);

      if (err.response.data.warning) {
        setSelectedSession(session);
        setWarningModal(true);
        setWarningMsg(err.response.data.error);
      } else {
        setModal(true);
        setMsg(err.response.data.error);
      }
    }
  }

  function connectSocket() {
    // console.log("selectedSession", selectedSession);
    let token = localStorage.getItem("jwt");
    setWs(
      io(`https://claudia-teng.com`, {
        auth: {
          token: `Bearer ${token}`,
        },
      })
    );
    setSessionId(selectedSession.session_id);
    selectedSession.title = detail.title;
    setSessionInfo(selectedSession);
  }

  function resetButton() {
    let _detail = JSON.parse(JSON.stringify(detail));
    _detail?.sessions?.map((session) => Object.assign(session, { loading: false }));
    setEventDetail(_detail);
  }

  function handleClose() {
    setWarningModal(false);
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
      // console.log("success connect!");

      ws.on("connect_error", (err) => {
        resetButton();
        setModal(true);
        setMsg("????????????????????????????????????");
        ws.disconnect();
        setLoading(false);
        return;
      });

      ws.on("check limit", (data) => {
        // console.log("data", data);
        if (data.error) {
          resetButton();
          setModal(true);
          setMsg(data.error);
          ws.disconnect();
          return;
        }
        setWaitPeople(data.waitPeople);
        setQueuePeople(data.waitPeople);
        if (data.pass) {
          navigate("/ticket/select");
        } else {
          // console.log("data", data);
          setWaitPeople(data.waitPeople);
          // console.log("seconds", data.seconds);
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
                <h2>All Concerts</h2>
              </div>
            </div>
            <div className={styles.divider}></div>
          </div>

          <div className={styles.onSaleContainer}>
            <div>
              <div>
                <h1>??????????????????</h1>
                <p>
                  {new Date(detail.onSale).getFullYear().toString()}.
                  {(new Date(detail.onSale).getMonth() + 1).toString()}.{new Date(detail.onSale).getDate().toString()}
                </p>
              </div>
              <div>
                <h1>??????????????????</h1>
                <p>
                  {new Date(detail.onSale).getHours().toString()}:
                  {(new Date(detail.onSale).getMinutes() < 10 ? "0" : "") + new Date(detail.onSale).getMinutes()}
                </p>
              </div>
            </div>
          </div>

          <div className={styles.sessionContainer}>
            {detail.sessions.map((session) => {
              return (
                <>
                  <div className={styles.sessionCard}>
                    <div>
                      <p>{new Date(session.time).getDate()}</p>
                      <p>
                        {new Date(session.time).getMonth() + 1} ??? {new Date(session.time).getFullYear()}
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
                          session.loading ||
                          loading
                            ? styles.disabled
                            : ""
                        }
                        onClick={(event) => onBuyTicket(event, session)}
                        disabled={
                          new Date(detail.onSale).getTime() > new Date().getTime() ||
                          new Date(session.time).getTime() <= new Date().getTime() ||
                          loading ||
                          session.loading
                        }
                      >
                        {new Date(detail.onSale).getTime() > new Date().getTime() && "????????????"}
                        {new Date(session.time).getTime() <= new Date().getTime() && "????????????"}
                        {new Date(detail.onSale).getTime() <= new Date().getTime() &&
                          new Date(session.time).getTime() > new Date().getTime() &&
                          !session.loading &&
                          "????????????"}
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
      <ErrorModal modal={modal} setModal={setModal} msg={msg} />
      <Modal show={warningModal} onHide={handleClose} className={styles.model}>
        <Modal.Body>{warningMsg}</Modal.Body>
        <Modal.Footer>
          <button onClick={() => setWarningModal(false)}>??????</button>
          <button onClick={() => connectSocket()}>????????????</button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default EventDetail;
