import styles from "./Waiting.module.sass";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SessionCard from "../../components/SessionCard/SessionCard";
import ProgressBar from "react-bootstrap/ProgressBar";

function Waiting({ waitPeople, setWaitPeople, ws, leftSeconds, sessionInfo, fromBuyTicket }) {
  let navigate = useNavigate();
  const [timer, setTimer] = useState(null);
  const [percentage, setPercentage] = useState(0);
  let interval;
  let originTime;

  function startTimer(duration, isInit) {
    let time = duration,
      minutes,
      seconds;

    let passSeconds = 0;
    if (isInit) {
      originTime = duration;
    } else {
      passSeconds = originTime - duration;
    }

    interval = setInterval(() => {
      minutes = parseInt(time / 60, 10);
      seconds = parseInt(time % 60, 10);

      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      setTimer(minutes + ":" + seconds);

      let currentPercent;

      if (isInit) {
        passSeconds++;
        currentPercent = Math.floor((passSeconds / duration) * 100);
        setPercentage(currentPercent);
      } else {
        passSeconds++;
        console.log("originTime", originTime);
        console.log("passSeconds", passSeconds);
        currentPercent = Math.floor((passSeconds / originTime) * 100);
        setPercentage(currentPercent);
      }

      console.log("currentPercent", currentPercent);

      if (--time < 0) {
        passSeconds = 0;
        time = duration;
      }
    }, 1000);
  }

  useEffect(() => {
    if (leftSeconds !== null) {
      clearInterval(interval);
      startTimer(leftSeconds, true);
    }
  }, [leftSeconds]);

  useEffect(() => {
    console.log("fromBuyTicket", fromBuyTicket);
    if (fromBuyTicket) {
      return navigate("/");
    }
  }, [fromBuyTicket]);

  useEffect(() => {
    if (!ws) {
      return navigate("/");
    }

    ws.on("ready to go", () => {
      navigate("/ticket/select");
    });
    ws.on("minus waiting people", (data) => {
      setWaitPeople((current) => current - 1);
      console.log("seconds", data.seconds);
      clearInterval(interval);
      startTimer(data.seconds, false);
    });

    return () => {
      ws.off("ready to go");
      ws.off("minus waiting people");
      clearInterval(interval);
      setTimer(null);
    };
  }, []);

  return (
    <>
      <div className={styles.waitContainer}>
        {sessionInfo && <SessionCard sessionInfo={sessionInfo} />}
        <div className={styles.container}>
          <h1>排隊中，請稍候......</h1>
          <ProgressBar animated now={percentage} />
          <p>前面還有：{waitPeople} 人</p>
          <p>
            <span>預估等待時間：</span>
            <span>{timer}</span>
          </p>
        </div>
      </div>
    </>
  );
}

export default Waiting;
