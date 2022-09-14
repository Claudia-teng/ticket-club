import styles from "./Order.module.sass";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Table from "react-bootstrap/Table";

function Order({ sessionId, orderConfirmInfo, ws, timer }) {
  let navigate = useNavigate();

  async function onSubmitOrder(event) {
    console.log("orderConfirmInfo", orderConfirmInfo);
    const seatIds = [];
    orderConfirmInfo.tickets.map((ticket) => seatIds.push(ticket.seatId));
    const info = {
      sessionId: sessionId,
      seatIds: seatIds,
    };
    // console.log("info", info);
    try {
      let token = localStorage.getItem("jwt");
      const data = await axios.post(`${process.env.REACT_APP_DOMAIN}/order`, info, {
        headers: { Authorization: `Bearer ${token}` },
      });
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

  // const unlockSeats = (e) => {
  //   ws.emit("unlock seat", orderConfirmInfo);
  //   navigate("/");
  // };

  useEffect(() => {
    // todo - handle refresh then unlock
    // window.addEventListener("beforeunload", unlockSeats);
    // return () => {
    //   ws.emit("unlock seat", orderConfirmInfo);
    //   window.removeEventListener("beforeunload", unlockSeats);
    // };
  }, []);

  useEffect(() => {
    if (timer === "00:00") {
      navigate("/");
      ws.emit("unlock seat", orderConfirmInfo);
    }
  }, [timer]);

  return (
    <>
      <p className={styles.text}>Total: {orderConfirmInfo.total}</p>
      {orderConfirmInfo?.tickets?.map((ticket) => {
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
      <div className={styles.table}>
        <Table>
          <thead>
            <tr>
              <th>#</th>
              <th>區域</th>
              <th>座位</th>
              <th>價錢</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Mark</td>
              <td>Otto</td>
              <td>@mdo</td>
            </tr>
            <tr>
              <td>2</td>
              <td>Jacob</td>
              <td>Thornton</td>
              <td>@fat</td>
            </tr>
            <tr>
              <td>3</td>
              <td colSpan={2}>Larry the Bird</td>
              <td>@twitter</td>
            </tr>
          </tbody>
        </Table>
      </div>
    </>
  );
}

export default Order;
