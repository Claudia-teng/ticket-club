import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Table from "react-bootstrap/Table";
import styles from "./OrderConfirm.module.sass";

function OrderConfirm({ orderConfirmInfo }) {
  return (
    <>
      <div className={styles.container}>
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
                <p>{new Date(orderConfirmInfo?.tickets[0].time).getFullYear().toString()}.
                  {(new Date(orderConfirmInfo?.tickets[0].time).getMonth() + 1).toString()}.{new Date(orderConfirmInfo?.tickets[0].time).getDate().toString()} {new Date(orderConfirmInfo?.tickets[0].time).getHours().toString()}:
                  {(new Date(orderConfirmInfo?.tickets[0].time).getMinutes() < 10 ? "0" : "") + new Date(orderConfirmInfo?.tickets[0].time).getMinutes()}</p>
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
      </div>
    </>
  );
}

export default OrderConfirm;
