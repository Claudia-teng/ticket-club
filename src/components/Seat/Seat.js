import axios from "axios";
import styles from "./Seat.module.sass";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SeatIcon from "../SeatIcon/SeatIcon";
import arrowIcon from "../../assets/arrow.png";
import ErrorModal from "../../components/Modal/Modal";

function Seat({
  sessionId,
  seats,
  setSeats,
  selectedSeats,
  setSelectedSeats,
  selectedAreaInfo,
  setOrderConfirmInfo,
  ws,
  timer,
  setStep,
}) {
  let navigate = useNavigate();
  const [modal, setModal] = useState(false);
  const [msg, setMsg] = useState("");
  const colors = {
    1: "#ffffff",
    2: "#F93131",
    3: "#292929",
    4: "#FFF500",
    5: "#3453F2",
  };

  async function getSeats() {
    const info = {
      sessionId: sessionId,
      areaId: selectedAreaInfo.area.id,
    };
    let token = localStorage.getItem("jwt");
    try {
      const data = await axios.post(`${process.env.REACT_APP_DOMAIN}/seat`, info, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSeats(data.data);
    } catch (err) {
      localStorage.removeItem("jwt");
      navigate("/login");
    }
  }

  function onSelectSeat(event, rowIndex, columnIndex) {
    const _seats = JSON.parse(JSON.stringify(seats));
    _seats[rowIndex][columnIndex].disabled = true;
    setSeats(_seats);
    const seatInfo = {
      sessionId,
      areaId: selectedAreaInfo.area.id,
      row: rowIndex + 1,
      column: columnIndex + 1,
      rowIndex,
      columnIndex,
    };
    ws.emit("select seat", seatInfo);
  }

  function onUnselectSeat(event, rowIndex, columnIndex) {
    const seatInfo = {
      sessionId,
      areaId: selectedAreaInfo.area.id,
    };
    seatInfo.tickets = [
      {
        row: rowIndex + 1,
        column: columnIndex + 1,
        rowIndex,
        columnIndex,
      },
    ];
    console.log("seatInfo", seatInfo);
    setSelectedSeats((current) => {
      return current.filter((item) => item.rowIndex !== rowIndex || item.columnIndex !== columnIndex);
    });
    const _seats = JSON.parse(JSON.stringify(seats));
    _seats[rowIndex][columnIndex].status_id = 1;
    _seats[rowIndex][columnIndex].disabled = false;
    setSeats(_seats);
    ws.emit("unselect seat", seatInfo);
  }

  async function onSubmitSeats(event) {
    console.log("selectedSeats", selectedSeats);
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
    if (!ws) return;
    getSeats();
  }, []);

  useEffect(() => {
    if (ws && seats.length) {
      ws.on("self select seat", (data) => {
        console.log("self select seat", data);
        const _seats = JSON.parse(JSON.stringify(seats));
        if (!data.error) {
          const seatInfo = {
            rowIndex: data.rowIndex,
            columnIndex: data.columnIndex,
          };
          _seats[data.rowIndex][data.columnIndex].status_id = 4;
          setSelectedSeats((current) => [...current, Object.assign(_seats[data.rowIndex][data.columnIndex], seatInfo)]);
          setSeats(_seats);
        } else {
          setModal(true);
          setMsg(data.error);
          _seats[data.rowIndex][data.columnIndex].disabled = false;
          setSeats(_seats);
        }
      });

      ws.on("other select seat", (data) => {
        console.log("other select seat", data);
        const _seats = JSON.parse(JSON.stringify(seats));
        _seats[data.rowIndex][data.columnIndex].status_id = 5;
        setSeats(_seats);
      });

      ws.on("lock seat", (data) => {
        console.log("lock seat data", data);
        const _seats = JSON.parse(JSON.stringify(seats));
        for (let seat of data) {
          _seats[seat.rowIndex][seat.columnIndex].status_id = 2;
        }
        setSeats(_seats);
      });

      ws.on("sold seat", (data) => {
        console.log("sold seat data", data);
        const _seats = JSON.parse(JSON.stringify(seats));
        for (let seat of data) {
          _seats[seat.rowIndex][seat.columnIndex].status_id = 3;
        }
        setSeats(_seats);
      });

      ws.on("unselect seat", (data) => {
        console.log("unselect seat", data);
        if (!data.error) {
          const _seats = JSON.parse(JSON.stringify(seats));
          for (let seat of data.tickets) {
            _seats[seat.row - 1][seat.column - 1].status_id = 1;
          }
          setSeats(_seats);
        } else {
          setModal(true);
          setMsg(data.error);
        }
      });

      ws.on("unlock seat", (data) => {
        // todo - check self unlock(4) or other unlock (5)
        console.log("unlock seat", data);
        if (data.error) return;
        const _seats = JSON.parse(JSON.stringify(seats));
        for (let seat of data.tickets) {
          console.log("seat", seat);
          _seats[seat.row - 1][seat.column - 1].status_id = 1;
        }
        setSeats(_seats);
      });

      return () => {
        ws.off("self select seat");
        ws.off("other select seat");
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
            <SeatIcon color={colors[4]} />
            <p>目前選位</p>
          </div>
          <div>
            <SeatIcon color={colors[5]} />
            <p>已被選位</p>
          </div>
          <div>
            <SeatIcon color={colors[2]} />
            <p>已鎖定</p>
          </div>
          <div>
            <SeatIcon color={colors[3]} />
            <p>已售出</p>
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
                          <span>
                            <SeatIcon color={colors[2]} />
                          </span>
                        </>
                      );
                    } else if (seats[rowIndex][columnIndex].status_id === 3) {
                      return (
                        <>
                          <span>
                            <SeatIcon color={colors[3]} />
                          </span>
                        </>
                      );
                    } else if (seats[rowIndex][columnIndex].status_id === 4) {
                      return (
                        <>
                          <span onClick={(event) => onUnselectSeat(event, rowIndex, columnIndex)}>
                            <SeatIcon color={colors[4]} />
                          </span>
                        </>
                      );
                    } else if (seats[rowIndex][columnIndex].status_id === 5) {
                      return (
                        <>
                          <span>
                            <SeatIcon color={colors[5]} />
                          </span>
                        </>
                      );
                    } else {
                      if (seats[rowIndex][columnIndex].disabled) {
                        return (
                          <>
                            <span>
                              <SeatIcon color={colors[1]} />
                            </span>
                          </>
                        );
                      } else {
                        return (
                          <>
                            <span onClick={(event) => onSelectSeat(event, rowIndex, columnIndex, 1)}>
                              <SeatIcon color={colors[1]} />
                            </span>
                          </>
                        );
                      }
                    }
                  })}
                </div>
              </>
            );
          })}
        </div>
        <div className={styles.arrow} onClick={(event) => navigateToArea(event)}>
          <img alt="arrow" src={arrowIcon} />
          <p>重新選擇區域</p>
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
