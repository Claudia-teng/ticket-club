import styles from "./Waiting.module.sass";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Countdown from "../../Components/Countdown/Countdown";

function Waiting({ waitPeople, setWaitPeople, ws, leftSeconds }) {
  let navigate = useNavigate();
  const [timer, setTimer] = useState(null);
  let interval;

  function startTimer(duration) {
    var time = duration,
      minutes,
      seconds;

    interval = setInterval(function () {
      minutes = parseInt(time / 60, 10);
      seconds = parseInt(time % 60, 10);

      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      setTimer(minutes + ":" + seconds);

      if (--time < 0) {
        time = duration;
      }
    }, 1000);
  }

  useEffect(() => {
    if (leftSeconds !== null) {
      clearInterval(interval);
      startTimer(leftSeconds);
    }
  }, [leftSeconds]);

  useEffect(() => {
    if (!ws) {
      return navigate("/");
    }

    ws.on("ready to go", () => {
      navigate("/ticket/area");
    });
    ws.on("minus waiting people", (data) => {
      setWaitPeople((current) => current - 1);
      console.log("seconds", data.seconds);
      clearInterval(interval);
      startTimer(data.seconds);
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
        <p>前面還有：{waitPeople}人</p>
        <p>
          <span>最多可能要等:</span>
          <span>{timer}</span>
        </p>
      </div>
    </>
  );
}

export default Waiting;
