import { useEffect } from "react";
import styles from "./Countdown.module.sass";

function Countdown({ timer, setTimer, leftSeconds }) {
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

    return () => {
      clearInterval(interval);
      setTimer(null);
    };
  }, [leftSeconds]);

  return (
    <>
      <h2 className={styles.timer}>{timer}</h2>
    </>
  );
}

export default Countdown;
