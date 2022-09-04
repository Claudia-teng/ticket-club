import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Countdown({ timer, setTimer, leftSeconds }) {
  let interval;

  function startTimer(duration) {
    clearInterval(interval);
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
      startTimer(leftSeconds);
    }
  }, [leftSeconds]);

  return (
    <>
      <div>{timer}</div>
    </>
  );
}

export default Countdown;
