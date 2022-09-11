import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Countdown from "../../Components/Countdown/Countdown";
import { useEffect, useState } from "react";
import styles from "./BuyTicket.module.sass";

function BuyTicket({ timer, setTimer, leftSeconds, setLeftSeconds }) {
  useEffect(() => {
    setLeftSeconds(600);
  }, []);

  return (
    <>
      <div className={styles.countdown}>
        <span>Countdown: </span>
        <Countdown timer={timer} setTimer={setTimer} leftSeconds={leftSeconds} />
      </div>
      <Outlet />
    </>
  );
}

export default BuyTicket;
