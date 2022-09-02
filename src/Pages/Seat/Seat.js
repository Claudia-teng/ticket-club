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
    const _seats = JSON.parse(JSON.stringify(seats));
    if (_seats[rowIndex][columnIndex].status_id === 1) {
      _seats[rowIndex][columnIndex].status_id = 4;
      seatInfo.status_id = 4;
    } else {
      _seats[rowIndex][columnIndex].status_id = 1;
      seatInfo.status_id = 1;
    }
    setSeats(_seats);
    setSelectedSeats((current) => [...current, _seats[rowIndex][columnIndex]]);
    ws.emit("select seat", seatInfo);
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
      const data = await axios.post("http://localhost:3000/seat/lock", info);
      setOrderConfirmInfo(data.data);
      navigate("/order");
    } catch (err) {
      console.log("err", err.response.data.error);
    }
  }

  useEffect(() => {
    getSeats();
  }, []);

  useEffect(() => {
    if (seats.length) {
      ws.on("select seat", (data) => {
        const _seats = JSON.parse(JSON.stringify(seats));
        _seats[data.rowIndex][data.columnIndex].status_id = data.status_id;
        setSeats(_seats);
      });
    }
  }, [seats]);

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
                      <p key={`${rowIndex}-${columnIndex}`}>
                        {seats[rowIndex][columnIndex].row} - {seats[rowIndex][columnIndex].column} - LOCK
                      </p>
                    </>
                  );
                } else if (seats[rowIndex][columnIndex].status_id === 3) {
                  return (
                    <>
                      <p key={`${rowIndex}-${columnIndex}`}>
                        {seats[rowIndex][columnIndex].row} - {seats[rowIndex][columnIndex].column} - SOLD
                      </p>
                    </>
                  );
                } else if (seats[rowIndex][columnIndex].status_id === 4) {
                  return (
                    <>
                      <Link
                        onClick={(event) => onSelectSeat(event, rowIndex, columnIndex)}
                        to=""
                        key={`${rowIndex}-${columnIndex}`}
                      >
                        {seats[rowIndex][columnIndex].row} - {seats[rowIndex][columnIndex].column} - V
                      </Link>
                    </>
                  );
                } else if (seats[rowIndex][columnIndex].status_id === 5) {
                  return (
                    <>
                      <p>
                        {seats[rowIndex][columnIndex].row} - {seats[rowIndex][columnIndex].column} - V
                      </p>
                    </>
                  );
                } else {
                  return (
                    <>
                      <Link
                        onClick={(event) => onSelectSeat(event, rowIndex, columnIndex)}
                        to=""
                        key={`${rowIndex}-${columnIndex}`}
                      >
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
