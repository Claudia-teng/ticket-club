import styles from "./Waiting.module.sass";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Countdown from "../../Components/Countdown/Countdown";

function Waiting({ waitPeople, setWaitPeople, ws, leftSeconds, setLeftSeconds }) {
  let navigate = useNavigate();
  const [timer, setTimer] = useState(null);

  function startTimer(duration) {
    var time = duration,
      minutes,
      seconds;

    setInterval(function () {
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
      startTimer(leftSeconds);
    }
  }, [leftSeconds]);

  useEffect(() => {
    ws.on("ready to go", () => {
      navigate("/ticket/area");
    });

    ws.on("minus waiting people", (data) => {
      setWaitPeople((current) => current - 1);
      // todo - check time
      const expires = +data.milliseconds + 60 * 1000;
      const seconds = Math.floor((expires - +data.milliseconds) / 1000);
      setLeftSeconds(seconds);
    });
  }, []);

  return (
    <>
      <p>前面還有：{waitPeople}人</p>
      <span>最多可能要等</span>
      <div>{timer}</div>
    </>
  );
}

export default Waiting;
