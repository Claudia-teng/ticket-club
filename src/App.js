import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import Index from "./pages/Index/Index";
import Login from "./pages/Login/Login";
import Profile from "./pages/Profile/Profile";
import Signup from "./pages/Signup/Signup";
import BuyTicket from "./pages/BuyTicket/BuyTicket";
import EventDetail from "./pages/EventDetail/EventDetail";
import AreaPicture from "./components/AreaPicture/AreaPicture";
import Order from "./components/Order/Order";
import Waiting from "./pages/Waiting/Waiting";
import Success from "./pages/Success/Success";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [selectedAreaInfo, setSelectedAreaInfo] = useState(null);
  const [orderConfirmInfo, setOrderConfirmInfo] = useState(null);
  const [seats, setSeats] = useState([]);
  const [ws, setWs] = useState(null);
  const [timer, setTimer] = useState(null);
  const [queuePeople, setQueuePeople] = useState(null);
  const [waitPeople, setWaitPeople] = useState(null);
  const [leftSeconds, setLeftSeconds] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [isLogin, setIsLogin] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [sessionInfo, setSessionInfo] = useState(null);

  return (
    <>
      <BrowserRouter>
        <Navbar isLogin={isLogin} setIsLogin={setIsLogin} />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index ws={ws} setWs={setWs} setSessionId={setSessionId} />}></Route>
          <Route path="/login" element={<Login setUserInfo={setUserInfo} setIsLogin={setIsLogin} />}></Route>
          <Route path="/signup" element={<Signup setUserInfo={setUserInfo} setIsLogin={setIsLogin} />}></Route>
          <Route
            path="/profile"
            element={<Profile ws={ws} setWs={setWs} userInfo={userInfo} setIsLogin={setIsLogin} />}
          ></Route>
          <Route
            path="/event/:id"
            element={
              <EventDetail
                sessionId={sessionId}
                setSessionId={setSessionId}
                ws={ws}
                setWs={setWs}
                setWaitPeople={setWaitPeople}
                setQueuePeople={setQueuePeople}
                setLeftSeconds={setLeftSeconds}
                setSessionInfo={setSessionInfo}
              />
            }
          ></Route>
          <Route
            path="/ticket"
            element={
              <BuyTicket
                ws={ws}
                timer={timer}
                setTimer={setTimer}
                leftSeconds={leftSeconds}
                setLeftSeconds={setLeftSeconds}
                sessionInfo={sessionInfo}
              />
            }
          >
            <Route
              path="select"
              element={
                <AreaPicture
                  type="area"
                  sessionId={sessionId}
                  setSelectedAreaInfo={setSelectedAreaInfo}
                  ws={ws}
                  setWs={setWs}
                  timer={timer}
                  seats={seats}
                  setSeats={setSeats}
                  selectedAreaInfo={selectedAreaInfo}
                  setOrderConfirmInfo={setOrderConfirmInfo}
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
          <Route
            path="/success"
            element={<Success ws={ws} setWs={setWs} orderConfirmInfo={orderConfirmInfo} />}
          ></Route>
          <Route
            path="/wait"
            element={
              <Waiting
                waitPeople={waitPeople}
                setWaitPeople={setWaitPeople}
                ws={ws}
                sessionInfo={sessionInfo}
                queuePeople={queuePeople}
                leftSeconds={leftSeconds}
                setLeftSeconds={setLeftSeconds}
              />
            }
          ></Route>
          <Route path="*" element={<Index ws={ws} setWs={setWs} setSessionId={setSessionId} />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
