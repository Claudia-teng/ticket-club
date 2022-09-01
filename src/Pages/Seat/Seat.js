import axios from "axios";
import styles from "./Seat.module.sass";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Seat({ selectedAreaId, setOrderConfirmInfo, ws, setWs }) {
  let navigate = useNavigate();

  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  async function getSeats() {
    const info = {
      sessionId: 1,
      areaId: selectedAreaId,
    };
    const data = await axios.post("http://localhost:3000/seat", info);
    setSeats(data.data);
  }

  function onSelectSeat(event, rowIndex, columnIndex) {
    const seatInfo = {
      rowIndex,
      columnIndex,
    };
    if (seats[rowIndex][columnIndex].status_id === 1) {
      seats[rowIndex][columnIndex].status_id = 4;
      seatInfo.status_id = 4;
    } else {
      seats[rowIndex][columnIndex].status_id = 1;
      seatInfo.status_id = 1;
    }
    setSeats(seats);
    setSelectedSeats((current) => [...current, seats[rowIndex][columnIndex]]);
    ws.emit("seatChange", seatInfo);
  }

  async function onSubmitSeats(event) {
    // todo - validate selectedSeats (> 0 && <= 4)
    console.log("selectedSeats", selectedSeats);
    const info = {
      sessionId: 1,
      areaId: selectedAreaId,
      tickets: selectedSeats,
    };
    console.log("info", info);
    try {
      const data = await axios.post("http://localhost:3000/ticket/lock", info);
      setOrderConfirmInfo(data.data);
      navigate("/order");
    } catch (err) {
      console.log("err", err.response.data.error);
    }

    // if (data.data.total) {
    // } else {
    //   console.log("err", data.data.error);
    // }
  }

  useEffect(() => {
    getSeats();
  }, []);

  // useEffect(() => {
  //   ws.on("seatChange", (data) => {
  //     console.log("data", data);
  //     if (seats.length) {
  //       seats[data.rowIndex][data.columnIndex].status_id = data.status_id;
  //       setSeats(seats);
  //     }
  //   });
  // }, [seats]);

  useEffect(() => {
    ws.on("seatChange", (data) => {
      console.log("hi");
    });
  }, []);

  return (
    <>
      <div>Seat</div>
      {seats.map((row, rowIndex) => {
        return (
          <>
            <div className={styles.row}>
              {row.map((column, columnIndex) => {
                if (seats[rowIndex][columnIndex].status_id === 2) {
                  return (
                    <>
                      <p>
                        {seats[rowIndex][columnIndex].row} - {seats[rowIndex][columnIndex].column} - LOCK
                      </p>
                    </>
                  );
                } else if (seats[rowIndex][columnIndex].status_id === 3) {
                  return (
                    <>
                      <p>
                        {seats[rowIndex][columnIndex].row} - {seats[rowIndex][columnIndex].column} - SOLD
                      </p>
                    </>
                  );
                } else if (seats[rowIndex][columnIndex].status_id === 4) {
                  return (
                    <>
                      <Link onClick={(event) => onSelectSeat(event, rowIndex, columnIndex)} to="">
                        {seats[rowIndex][columnIndex].row} - {seats[rowIndex][columnIndex].column} - V
                      </Link>
                    </>
                  );
                } else {
                  return (
                    <>
                      <Link onClick={(event) => onSelectSeat(event, rowIndex, columnIndex)} to="">
                        {seats[rowIndex][columnIndex].row} - {seats[rowIndex][columnIndex].column} - O
                      </Link>
                    </>
                  );
                }
              })}
            </div>
          </>
        );
      })}
      <button onClick={(event) => onSubmitSeats(event)}>確認</button>
    </>
  );
}

export default Seat;
