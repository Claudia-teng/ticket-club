import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Countdown from "../../Components/Countdown/Countdown";
import { useEffect, useState } from "react";

function BuyTicket({ timer, setTimer, leftSeconds, setLeftSeconds }) {
  useEffect(() => {
    setLeftSeconds(600);
  }, []);

  return (
    <>
      <p>Countdown</p>
      <Countdown timer={timer} setTimer={setTimer} leftSeconds={leftSeconds} />
      <Outlet />
    </>
  );
}

export default BuyTicket;
