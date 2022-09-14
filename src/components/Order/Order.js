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
      <div className={styles.orderContainer}>
        <div className={styles.payment}>
          <h1>付款方式</h1>
          <p>ibon 取票付款</p>
          <p>
            訂單完成 20 分鐘至 1 小時間至全台 7-11 門市內的 ibon
            機台自行列印付款單據，至臨櫃付款後並取票，逾時付款訂單自動取消， 亦不予保留。
          </p>
        </div>
        <div className={styles.event}>
          <h1>活動</h1>
          <div>
            <p>{orderConfirmInfo?.tickets[0].title}</p>
          </div>
        </div>
        <div className={styles.dateVenue}>
          <div>
            <div>
              <h1>日期</h1>
              <div>
                <p>{orderConfirmInfo?.tickets[0].time}</p>
              </div>
            </div>
            <div>
              <h1>場地</h1>
              <div>
                <p>{orderConfirmInfo?.tickets[0].venue}</p>
              </div>
            </div>
          </div>
        </div>
        <div>
          <h1>訂單細節</h1>
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
                {orderConfirmInfo?.tickets?.map((ticket, index) => {
                  return (
                    <>
                      <tr>
                        <td>{index + 1}</td>
                        <td>{ticket.area}</td>
                        <td>
                          {ticket.row} 排 {ticket.column} 號
                        </td>
                        <td>{ticket.price}</td>
                      </tr>
                    </>
                  );
                })}
              </tbody>
            </Table>
          </div>
        </div>
        <div className={styles.summary}>
          <div>
            <span>總張數：</span> <span>{orderConfirmInfo?.tickets.length}張</span>
          </div>
          <div>
            <span>總價：</span> <span>${orderConfirmInfo?.total}張</span>
          </div>
        </div>
        <div className={styles.button}>
          <button onClick={(event) => onSubmitOrder(event)}>確認訂單</button>
        </div>
      </div>
    </>
  );
}

export default Order;
