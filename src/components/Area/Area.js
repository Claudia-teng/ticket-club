import axios from "axios";
import styles from "./Area.module.sass";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Area({
  sessionId,
  selectedAreaInfo,
  setSelectedAreaInfo,
  ws,
  setWs,
  timer,
  setImg,
  setStep,
  selectedSeats,
  setSelectedSeats,
}) {
  let navigate = useNavigate();
  const [areas, setAreas] = useState([]);
  const colors = ["#FFF500", "#FF7A00", "#F93131"];

  async function getArea() {
    let token = localStorage.getItem("jwt");
    try {
      const data = await axios.get(`${process.env.REACT_APP_DOMAIN}/area/${sessionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = data.data;
      setImg(result.seatPicture);
      delete result["seatPicture"];
      const areaData = data.data;
      setAreas(areaData);
    } catch (err) {
      localStorage.removeItem("jwt");
      navigate("/login");
    }
  }

  function onSelectArea(e, price, area) {
    const info = {
      area,
      price,
    };
    setSelectedAreaInfo(info);

    const data = {
      sessionId,
      areaId: area.id,
    };
    ws.emit("join room", data);
    setStep(2);
  }

  useEffect(() => {
    if (!ws) return;
    if (selectedSeats.length) {
      // console.log("selectedSeats", selectedSeats);
      const seatInfo = {
        sessionId,
        areaId: selectedAreaInfo.area.id,
      };
      seatInfo.tickets = [];
      for (const seat of selectedSeats) {
        const info = {
          row: seat.rowIndex + 1,
          column: seat.columnIndex + 1,
          rowIndex: seat.rowIndex,
          columnIndex: seat.columnIndex,
        };
        seatInfo.tickets.push(info);
      }
      ws.emit("unselect seat", seatInfo);
      setSelectedSeats([]);
    }
    getArea();
  }, []);

  useEffect(() => {
    if (timer === "00:00") {
      ws.disconnect();
      setWs(null);
      navigate("/");
    }
  }, [timer]);

  return (
    <>
      <div className={styles.selectContainer}>
        <p>請選擇區域</p>
        {Object.keys(areas).map((price, index) => {
          return (
            <>
              <div className={styles.priceContainer}>
                <div className={styles.price}>
                  <div className={styles.box} style={{ backgroundColor: colors[index] }}></div>
                  <p>{price}區</p>
                </div>
                {areas[price].map((data) => {
                  if (!data.seats) {
                    return (
                      <div className={styles.areaCard}>
                        <div className={styles.box} style={{ backgroundColor: colors[index] }}></div>
                        <div>
                          <p>{data.area}</p>
                          <p>剩餘 {data.seats} 位</p>
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div className={styles.areaCard} onClick={(event) => onSelectArea(event, price, data)}>
                        <div className={styles.box} style={{ backgroundColor: colors[index] }}></div>
                        <div>
                          <p>{data.area}</p>
                          <p>剩餘 {data.seats} 位</p>
                        </div>
                      </div>
                    );
                  }
                })}
              </div>
            </>
          );
        })}
      </div>
    </>
  );
}

export default Area;
