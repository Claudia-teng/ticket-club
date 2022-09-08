import axios from "axios";
import styles from "./Seat.module.sass";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Seat({ sessionId, seats, setSeats, selectedAreaId, setOrderConfirmInfo, ws, setWs, timer }) {
  let navigate = useNavigate();

  const [selectedSeats, setSelectedSeats] = useState([]);

  async function getSeats() {
    const info = {
      sessionId: sessionId,
      areaId: selectedAreaId,
    };
    let token = localStorage.getItem("jwt");
    const data = await axios.post(`${process.env.REACT_APP_DOMAIN}/seat`, info, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setSeats(data.data);
  }

  function onSelectSeat(event, rowIndex, columnIndex) {
    // check only seats limit
    const seatInfo = {
      rowIndex,
      columnIndex,
    };
    const _seats = JSON.parse(JSON.stringify(seats));
    if (_seats[rowIndex][columnIndex].status_id === 1) {
      _seats[rowIndex][columnIndex].status_id = 4;
      seatInfo.status_id = 4;
      setSelectedSeats((current) => [...current, Object.assign(_seats[rowIndex][columnIndex], seatInfo)]);
    } else {
      _seats[rowIndex][columnIndex].status_id = 1;
      seatInfo.status_id = 1;
      setSelectedSeats((current) => {
        return current.filter((item) => item.rowIndex !== rowIndex || item.columnIndex !== columnIndex);
      });
      // console.log("selectedSeats", selectedSeats);
    }
    setSeats(_seats);
    ws.emit("select seat", seatInfo);
  }

  async function onSubmitSeats(event) {
    // todo - validate selectedSeats (> 0 && <= 4)
    // console.log("selectedSeats", selectedSeats);
    const info = {
      sessionId: 1,
      areaId: selectedAreaId,
      tickets: selectedSeats,
    };
    console.log("info", info);
    try {
      let token = localStorage.getItem("jwt");
      const data = await axios.post(`${process.env.REACT_APP_DOMAIN}/seat/lock`, info, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrderConfirmInfo(data.data);
      navigate("/ticket/order");
      let lockedSeats = JSON.parse(JSON.stringify(selectedSeats));
      lockedSeats.map((seat) => (seat.status_id = 2));
      // console.log("lockedSeats", lockedSeats);
      ws.emit("lock seat", lockedSeats);
    } catch (err) {
      console.log("err", err.response.data.error);
      // todo - modal show error msg & navigate to /ticket/area
    }
  }

  useEffect(() => {
    // handle refresh or navigate to other page
    if (!ws) {
      navigate("/");
    }
    getSeats();
  }, []);

  useEffect(() => {
    if (ws && seats.length) {
      ws.on("select seat", (data) => {
        console.log("select seat data", data);
        const _seats = JSON.parse(JSON.stringify(seats));
        _seats[data.rowIndex][data.columnIndex].status_id = data.status_id;
        console.log("_seats", _seats);
        for (const seat of selectedSeats) {
          if (seat.columnIndex === data.columnIndex && seat.rowIndex === data.rowIndex) return;
        }
        setSeats(_seats);
      });

      ws.on("lock seat", (data) => {
        console.log("lock seat data", data);
        const _seats = JSON.parse(JSON.stringify(seats));
        for (let seat of data) {
          _seats[seat.rowIndex][seat.columnIndex].status_id = seat.status_id;
        }
        setSeats(_seats);
      });

      ws.on("book seat", (data) => {
        console.log("book seat data", data);
        const _seats = JSON.parse(JSON.stringify(seats));
        for (let seat of data) {
          _seats[seat.rowIndex][seat.columnIndex].status_id = seat.status_id;
        }
        setSeats(_seats);
      });

      ws.on("unselect seat", (data) => {
        console.log("unselect seat", data);
        const _seats = JSON.parse(JSON.stringify(seats));
        for (let seat of data) {
          _seats[seat.rowIndex][seat.columnIndex].status_id = 1;
        }
        setSeats(_seats);
      });

      ws.on("unlock seat", (data) => {
        console.log("unlock seat", data);
        const _seats = JSON.parse(JSON.stringify(seats));
        for (let seat of data.tickets) {
          console.log("seat", seat);
          _seats[seat.row - 1][seat.column - 1].status_id = 1;
        }
        setSeats(_seats);
      });

      return () => {
        ws.off("select seat");
        ws.off("lock seat");
        ws.off("book seat");
        ws.off("unselect seat");
        ws.off("unlock seat");
      };
    }
  }, [seats]);

  useEffect(() => {
    if (timer === "00:00") {
      navigate("/");
      ws.emit("unselect seat", selectedSeats);
    }
  }, [timer]);

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
      <button onClick={(event) => onSubmitSeats(event)} disabled={!selectedSeats.length}>
        確認
      </button>
    </>
  );
}

export default Seat;
