import axios from "axios";
import styles from "./Seat.module.sass";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Seat({ selectedAreaId }) {
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

  function onSelectSeat(event, rowIndex, columnINdex) {
    if (seats[rowIndex][columnINdex].status_id === 1) {
      seats[rowIndex][columnINdex].status_id = 4;
    } else {
      seats[rowIndex][columnINdex].status_id = 1;
    }
    setSeats(seats);
    setSelectedSeats((current) => [...current, seats[rowIndex][columnINdex]]);
    console.log("seats", seats);
  }

  async function onSubmitSeats(event) {
    console.log("selectedSeats", selectedSeats);
    const info = {
      sessionId: 1,
      areaId: selectedAreaId,
      tickets: selectedSeats,
    };
    console.log("info", info);
    try {
      const data = await axios.post("http://localhost:3000/ticket/lock", info);
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

  return (
    <>
      <div>Seat</div>
      {seats.map((row, rowIndex) => {
        return (
          <>
            <div className={styles.row}>
              {row.map((column, columnIndex) => {
                if (seats[rowIndex][columnIndex].status_id !== 1) {
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
