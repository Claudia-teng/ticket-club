import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Countdown from "../../components/Countdown/Countdown";
import SessionCard from "../../components/SessionCard/SessionCard";
import { useEffect, useState } from "react";
import styles from "./BuyTicket.module.sass";

function BuyTicket({ timer, setTimer, leftSeconds, setLeftSeconds, sessionInfo }) {
  useEffect(() => {
    setLeftSeconds(600);
  }, []);

  return (
    <>
      <div className={styles.buyTicket}>
        <SessionCard sessionInfo={sessionInfo} />
        <div className={styles.countdown}>
          <h1>COUNTDOWN</h1>
          <Countdown timer={timer} setTimer={setTimer} leftSeconds={leftSeconds} />
        </div>
        <Outlet />
      </div>
    </>
  );
}

export default BuyTicket;
