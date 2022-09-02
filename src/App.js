import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import ScrollToTop from "./Components/ScrollToTop/ScrollToTop";
import Index from "./Pages/Index/Index";
import BuyTicket from "./Pages/BuyTicket/BuyTicket";
import Area from "./Components/Area/Area";
import Seat from "./Components/Seat/Seat";
import Order from "./Components/Order/Order";
import Waiting from "./Pages/Waiting/Waiting";
import Navbar from "./Components/Navbar/Navbar";
import Footer from "./Components/Footer/Footer";
import "./App.css";

function App() {
  const [selectedAreaId, setSelectedAreaId] = useState(1);
  const [orderConfirmInfo, setOrderConfirmInfo] = useState({});
  const [seats, setSeats] = useState([]);
  const [ws, setWs] = useState(null);
  const [timer, setTimer] = useState(null);

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />}></Route>
          <Route path="/ticket" element={<BuyTicket timer={timer} setTimer={setTimer} />}>
            <Route
              path="area"
              element={<Area setSelectedAreaId={setSelectedAreaId} ws={ws} setWs={setWs} timer={timer} />}
            ></Route>
            <Route
              path="seat"
              element={
                <Seat
                  seats={seats}
                  setSeats={setSeats}
                  selectedAreaId={selectedAreaId}
                  setOrderConfirmInfo={setOrderConfirmInfo}
                  ws={ws}
                  timer={timer}
                />
              }
            ></Route>
            <Route
              path="order"
              element={
                <Order seats={seats} setSeats={setSeats} orderConfirmInfo={orderConfirmInfo} ws={ws} timer={timer} />
              }
            ></Route>
          </Route>
          <Route path="/wait" element={<Waiting />}></Route>
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
