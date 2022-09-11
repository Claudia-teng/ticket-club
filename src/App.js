import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import ScrollToTop from "./Components/ScrollToTop/ScrollToTop";
import Index from "./Pages/Index/Index";
import Login from "./Pages/Login/Login";
import Profile from "./Pages/Profile/Profile";
import Signup from "./Pages/Signup/Signup";
import BuyTicket from "./Pages/BuyTicket/BuyTicket";
import EventDetail from "./Pages/EventDetail/EventDetail";
import Area from "./Components/Area/Area";
import Seat from "./Components/Seat/Seat";
import Order from "./Components/Order/Order";
import Waiting from "./Pages/Waiting/Waiting";
import Success from "./Pages/Success/Success";
import Navbar from "./Components/Navbar/Navbar";
import Footer from "./Components/Footer/Footer";
import "./App.css";

function App() {
  const [selectedAreaId, setSelectedAreaId] = useState(1);
  const [orderConfirmInfo, setOrderConfirmInfo] = useState({});
  const [seats, setSeats] = useState([]);
  const [ws, setWs] = useState(null);
  const [timer, setTimer] = useState(null);
  const [waitPeople, setWaitPeople] = useState(null);
  const [leftSeconds, setLeftSeconds] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index ws={ws} setWs={setWs} setSessionId={setSessionId} />}></Route>
          <Route path="/login" element={<Login setUserInfo={setUserInfo} />}></Route>
          <Route path="/signup" element={<Signup setUserInfo={setUserInfo} />}></Route>
          <Route path="/profile" element={<Profile ws={ws} setWs={setWs} userInfo={userInfo} />}></Route>
          <Route
            path="/event/:id"
            element={
              <EventDetail
                sessionId={sessionId}
                setSessionId={setSessionId}
                ws={ws}
                setWs={setWs}
                setWaitPeople={setWaitPeople}
                setLeftSeconds={setLeftSeconds}
              />
            }
          ></Route>
          <Route
            path="/ticket"
            element={
              <BuyTicket timer={timer} setTimer={setTimer} leftSeconds={leftSeconds} setLeftSeconds={setLeftSeconds} />
            }
          >
            <Route
              path="area"
              element={
                <Area sessionId={sessionId} setSelectedAreaId={setSelectedAreaId} ws={ws} setWs={setWs} timer={timer} />
              }
            ></Route>
            <Route
              path="seat"
              element={
                <Seat
                  sessionId={sessionId}
                  seats={seats}
                  setSeats={setSeats}
                  selectedAreaId={selectedAreaId}
                  setOrderConfirmInfo={setOrderConfirmInfo}
                  ws={ws}
                  setWs={setWs}
                  timer={timer}
                />
              }
            ></Route>
            <Route
              path="order"
              element={
                <Order
                  sessionId={sessionId}
                  seats={seats}
                  setSeats={setSeats}
                  orderConfirmInfo={orderConfirmInfo}
                  ws={ws}
                  timer={timer}
                />
              }
            ></Route>
          </Route>
          <Route path="/success" element={<Success ws={ws} setWs={setWs} />}></Route>
          <Route
            path="/wait"
            element={
              <Waiting
                waitPeople={waitPeople}
                setWaitPeople={setWaitPeople}
                ws={ws}
                leftSeconds={leftSeconds}
                setLeftSeconds={setLeftSeconds}
              />
            }
          ></Route>
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
