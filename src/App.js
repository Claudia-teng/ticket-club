import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./Components/ScrollToTop/ScrollToTop";
import Index from "./Pages/Index/Index";
import Area from "./Pages/Area/Area";
import Seat from "./Pages/Seat/Seat";
import Order from "./Pages/Order/Order";
import Countdown from "./Components/Countdown/Countdown";
import "./App.css";
import { useState } from "react";

function App() {
  const [selectedAreaId, setSelectedAreaId] = useState(1);
  const [orderConfirmInfo, setOrderConfirmInfo] = useState({});
  const [ws, setWs] = useState(null);

  return (
    <>
      <BrowserRouter>
        {/* <Navbar /> */}
        <Countdown />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />}></Route>
          <Route path="/area" element={<Area setSelectedAreaId={setSelectedAreaId} ws={ws} setWs={setWs} />}></Route>
          <Route
            path="/seat"
            element={
              <Seat selectedAreaId={selectedAreaId} setOrderConfirmInfo={setOrderConfirmInfo} ws={ws} setWs={setWs} />
            }
          ></Route>
          <Route path="/order" element={<Order orderConfirmInfo={orderConfirmInfo} />}></Route>
        </Routes>
        {/* <Footer /> */}
      </BrowserRouter>
    </>
  );
}

export default App;
