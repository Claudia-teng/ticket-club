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
      const data = await axios.post("http://localhost:3000/order", info);
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
      navigate("/index");
    } catch (err) {
      console.log(err.response.data.error);
    }
  }

  useEffect(() => {
    if (timer === "00:00") {
      navigate("/index");
      ws.emit("unlock seat", orderConfirmInfo);
    }
  }, [timer]);

  return (
    <>
      <p>Total: {orderConfirmInfo.total}</p>
      {orderConfirmInfo.tickets.map((ticket) => {
        return (
          <>
            <p>{ticket.title}</p>
            <p>{ticket.time}</p>
            <p>{ticket.venue}</p>
            <p>{ticket.area}</p>
            <p>{ticket.seatId}</p>
            <p>{ticket.row}</p>
            <p>{ticket.column}</p>
            <p>{ticket.price}</p>
          </>
        );
      })}
      <button onClick={(event) => onSubmitOrder(event)}>確認訂單</button>
    </>
  );
}

export default Order;
