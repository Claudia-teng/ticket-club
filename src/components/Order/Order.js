import styles from "./Order.module.sass";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import OrderConfirm from "../OrderConfirm/OrderConfirm";

function Order({ sessionId, orderConfirmInfo, ws, timer }) {
  const token = localStorage.getItem("jwt");
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

  async function unlockSeats() {
    await axios.post(`${process.env.REACT_APP_DOMAIN}/seat/unlock`, orderConfirmInfo, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  useEffect(() => {
    window.addEventListener("beforeunload", unlockSeats);
    return () => {
      window.removeEventListener("beforeunload", unlockSeats);
    };
  }, []);

  useEffect(() => {
    if (timer === "00:00") {
      navigate("/");
    }
  }, [timer]);

  return (
    <>
      <div className={styles.orderContainer}>
        <div className={styles.payment}>
          <h1>付款方式</h1>
          <p>ibon 取票付款</p>
          <p>
            訂單完成 20 分鐘至 1 小時間至全台 7-11 門市內的 ibon
            機台自行列印付款單據，至臨櫃付款後並取票，逾時付款訂單自動取消， 亦不予保留。
          </p>
        </div>
        <OrderConfirm orderConfirmInfo={orderConfirmInfo} />
        <div className={styles.button}>
          <button onClick={(event) => onSubmitOrder(event)}>確認訂單</button>
        </div>
      </div>
    </>
  );
}

export default Order;
