import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./AreaPicture.module.sass";
import Area from "../Area/Area";
import Seat from "../Seat/Seat";

function AreaPicture({
  sessionId,
  setSelectedAreaInfo,
  ws,
  setWs,
  timer,
  seats,
  setSeats,
  selectedAreaInfo,
  setOrderConfirmInfo,
  orderConfirmInfo,
}) {
  const [img, setImg] = useState(null);
  const [step, setStep] = useState(1);
  const [selectedSeats, setSelectedSeats] = useState([]);

  useEffect(() => {
    if (orderConfirmInfo) {
      ws.emit("unlock seat", orderConfirmInfo);
    }
  }, []);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.picture}>
          <img alt="seat_map" src={img} />
        </div>
        {step === 1 && (
          <Area
            selectedSeats={selectedSeats}
            setSelectedSeats={setSelectedSeats}
            sessionId={sessionId}
            setSelectedAreaInfo={setSelectedAreaInfo}
            selectedAreaInfo={selectedAreaInfo}
            ws={ws}
            setWs={setWs}
            timer={timer}
            setImg={setImg}
            setStep={setStep}
          />
        )}
        {step === 2 && (
          <Seat
            selectedSeats={selectedSeats}
            setSelectedSeats={setSelectedSeats}
            sessionId={sessionId}
            seats={seats}
            setSeats={setSeats}
            selectedAreaInfo={selectedAreaInfo}
            setOrderConfirmInfo={setOrderConfirmInfo}
            ws={ws}
            setWs={setWs}
            timer={timer}
            setStep={setStep}
          />
        )}
      </div>
    </>
  );
}

export default AreaPicture;
