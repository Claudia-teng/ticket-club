import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./AreaPicture.module.sass";
import Area from "../Area/Area";
import Seat from "../Seat/Seat";

function AreaPicture({
  type,
  sessionId,
  setSelectedAreaInfo,
  ws,
  setWs,
  timer,
  seats,
  setSeats,
  selectedAreaInfo,
  setOrderConfirmInfo,
}) {
  const [img, setImg] = useState(null);
  return (
    <>
      <div className={styles.container}>
        <div className={styles.picture}>
          <img alt="seat_map" src={img} />
        </div>
        {type === "area" && (
          <Area
            sessionId={sessionId}
            setSelectedAreaInfo={setSelectedAreaInfo}
            ws={ws}
            setWs={setWs}
            timer={timer}
            setImg={setImg}
          />
        )}
        {type === "seat" && (
          <Seat
            sessionId={sessionId}
            seats={seats}
            setSeats={setSeats}
            selectedAreaInfo={selectedAreaInfo}
            setOrderConfirmInfo={setOrderConfirmInfo}
            ws={ws}
            setWs={setWs}
            timer={timer}
          />
        )}
      </div>
    </>
  );
}

export default AreaPicture;
