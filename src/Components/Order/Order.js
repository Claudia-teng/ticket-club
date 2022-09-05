import styles from "./Order.module.sass";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Order({ seats, setSeats, orderConfirmInfo, ws, timer }) {
  let navigate = useNavigate();

  async function onSubmitOrder(event) {
    console.log("orderConfirmInfo", orderConfirmInfo);
    const seatIds = [];
    orderConfirmInfo.tickets.map((ticket) => seatIds.push(ticket.seatId));
    const info = {
      sessionId: 1,
      seatIds: seatIds,
    };
    console.log("info", info);
    try {
      const data = await axios.post("https://claudia-teng.com/api/order", info);
      console.log(data.data.ok);
      const soldSeats = [];
      for (let seat of orderConfirmInfo.tickets) {
        soldSeats.push({
          columnIndex: seat.column - 1,
          rowIndex: seat.row - 1,
          status_id: 3,
        });
      }
      ws.emit("book seat", soldSeats);
      navigate("/success");
    } catch (err) {
      console.log(err.response.data.error);
    }
  }

  useEffect(() => {
    if (timer === "00:00") {
      navigate("/");
      ws.emit("unlock seat", orderConfirmInfo);
    }
  }, [timer]);

  return (
    <>
      <p className={styles.text}>Total: {orderConfirmInfo.total}</p>
      {orderConfirmInfo.tickets.map((ticket) => {
        return (
          <>
            <p className={styles.text}>{ticket.title}</p>
            <p className={styles.text}>{ticket.time}</p>
            <p className={styles.text}>{ticket.venue}</p>
            <p className={styles.text}>{ticket.area}</p>
            <p className={styles.text}>{ticket.seatId}</p>
            <p className={styles.text}>{ticket.row}</p>
            <p className={styles.text}>{ticket.column}</p>
            <p className={styles.text}>{ticket.price}</p>
          </>
        );
      })}
      <button onClick={(event) => onSubmitOrder(event)}>確認訂單</button>
    </>
  );
}

export default Order;
