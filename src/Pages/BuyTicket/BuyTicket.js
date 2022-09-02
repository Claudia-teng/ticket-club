import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Countdown from "../../Components/Countdown/Countdown";
import { useEffect, useState } from "react";

function BuyTicket({ timer, setTimer }) {
  return (
    <>
      <Countdown timer={timer} setTimer={setTimer} />
      <Outlet />
    </>
  );
}

export default BuyTicket;
