import axios from "axios";
import styles from "./Seat.module.sass";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SeatIcon from "../SeatIcon/SeatIcon";
import arrowIcon from "../../assets/arrow.png";
import ErrorModal from "../../components/Modal/Modal";

function Seat({ sessionId, seats, setSeats, selectedAreaInfo, orderConfirmInfo, setOrderConfirmInfo, ws, timer, setStep }) {
  let navigate = useNavigate();
  const [modal, setModal] = useState(false);
  const [msg, setMsg] = useState("");

  const [selectedSeats, setSelectedSeats] = useState([]);
  const colors = {
    1: "#ffffff",
    2: "#F93131",
    3: "#292929",
    4: "#FFF500",
  };

  async function getSeats() {
    const info = {
      sessionId: sessionId,
      areaId: selectedAreaInfo.area.id,
    };
    let token = localStorage.getItem("jwt");
    const data = await axios.post(`${process.env.REACT_APP_DOMAIN}/seat`, info, {
      headers: { Authorization: `Bearer ${token}` },
    });
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
    if (selectedSeats > 4) {
      setModal(true);
      setMsg("一次最多只能購買四張！");
      return;
    }
    // console.log("selectedSeats", selectedSeats);
    const info = {
      sessionId,
      areaId: selectedAreaInfo.area.id,
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
      setModal(true);
      setMsg(err.response.data.error);
    }
  }

  function navigateToArea(event) {
    setStep(1);
  }

  useEffect(() => {
    // todo - handle refresh then unselect
    // window.addEventListener("beforeunload", unlockSeats);
    // return () => {
    //   ws.emit("unlock seat", orderConfirmInfo);
    //   window.removeEventListener("beforeunload", unlockSeats);
    // };

    if (!ws) return;
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
      <div className={styles.seatContainer}>
        <p>
          {selectedAreaInfo.price}區 - {selectedAreaInfo.area.area}
        </p>
        <p>請選擇座位</p>
        <div className={styles.legend}>
          <div>
            <SeatIcon color={colors[1]} />
            <p>空位</p>
          </div>
          <div>
            <SeatIcon color={colors[2]} />
            <p>已鎖定</p>
          </div>
          <div>
            <SeatIcon color={colors[3]} />
            <p>已售出</p>
          </div>
          <div>
            <SeatIcon color={colors[4]} />
            <p>目前選位</p>
          </div>
        </div>
        <div className={styles.seatMap}>
          {seats.map((row, rowIndex) => {
            return (
              <>
                <div className={styles.row}>
                  {row.map((column, columnIndex) => {
                    if (seats[rowIndex][columnIndex].status_id === 2) {
                      return (
                        <>
                          <SeatIcon color={colors[2]} />
                        </>
                      );
                    } else if (seats[rowIndex][columnIndex].status_id === 3) {
                      return (
                        <>
                          <SeatIcon color={colors[3]} />
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
                            <SeatIcon color={colors[4]} />
                          </Link>
                        </>
                      );
                    } else if (seats[rowIndex][columnIndex].status_id === 5) {
                      return (
                        <>
                          <SeatIcon color={colors[1]} />
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
                            <SeatIcon color={colors[1]} />
                          </Link>
                        </>
                      );
                    }
                  })}
                </div>
              </>
            );
          })}
        </div>
        <div className={styles.arrow} onClick={(event) => navigateToArea(event)}>
          <img alt="arrow" src={arrowIcon} />
          <p>選擇其他區座位</p>
        </div>
        <button
          className={!selectedSeats.length ? styles.disabled : ""}
          onClick={(event) => onSubmitSeats(event)}
          disabled={!selectedSeats.length}
        >
          確認座位
        </button>
        <ErrorModal modal={modal} setModal={setModal} msg={msg} />
      </div>
    </>
  );
}

export default Seat;
