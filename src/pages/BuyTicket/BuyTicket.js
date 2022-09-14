import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Countdown from "../../components/Countdown/Countdown";
import SessionCard from "../../components/SessionCard/SessionCard";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./BuyTicket.module.sass";

function BuyTicket({ ws, timer, setTimer, leftSeconds, setLeftSeconds, sessionInfo }) {
  let navigate = useNavigate();

  useEffect(() => {
    // handle refresh
    if (!ws) {
      return navigate("/");
    }

    setLeftSeconds(600);
  }, []);

  return (
    <>
      <div className={styles.buyTicket}>
        {sessionInfo && <SessionCard sessionInfo={sessionInfo} />}
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
