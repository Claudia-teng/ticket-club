import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./Profile.module.sass";
import Table from "react-bootstrap/Table";

function Profile({ ws, setWs, setIsLogin, setSessionId, orderConfirmInfo }) {
  const [userInfo, setUserInfo] = useState(null);
  let navigate = useNavigate();

  async function getProfileDetail() {
    let token = localStorage.getItem("jwt");
    if (!token) {
      navigate("/login");
    }
    try {
      const data = await axios.get(`${process.env.REACT_APP_DOMAIN}/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserInfo(data.data);
    } catch (err) {
      console.log("err", err);
      navigate("/login");
    }
  }

  function onLogout() {
    localStorage.removeItem("jwt");
    setIsLogin(false);
    navigate("/");
  }

  useEffect(() => {
    getProfileDetail();
    if (ws) {
      if (orderConfirmInfo) {
        ws.emit("unlock seat", orderConfirmInfo);
      } else {
        ws.disconnect();
        setWs(null);
        setSessionId(null);
      }

      ws.on("finish unlock", () => {
        ws.disconnect();
        setWs(null);
        setSessionId(null);
      });

      return () => {
        ws.off("finish unlock");
      };
    }
  }, []);

  return (
    <>
      <div className={styles.profileContainer}>
        <div className={styles.container}>
          <div className={styles.titleContainer}>
            <div className={styles.divider}></div>
            <div className={styles.singer}>
              <div>
                <h1>MY TICKET CLUB</h1>
              </div>
            </div>
            <div className={styles.divider}></div>
          </div>
          <h2>個人資訊</h2>
          <div className={styles.profile}>
            <div>
              <span>姓名</span>
              <span>{userInfo?.name}</span>
            </div>
            <div>
              <span>Email</span>
              <span>{userInfo?.email}</span>
            </div>
          </div>
          <button onClick={() => onLogout()}>登出</button>
          <h2>個人訂單</h2>
          {!userInfo?.tickets?.length && <p>還沒有任何票券</p>}
          {userInfo?.tickets?.map((ticket, index) => {
            return (
              <>
                <div className={styles.fieldsetContainer}>
                  <fieldset className={styles.fieldset}>
                    <legend>{index + 1}</legend>
                    <div>
                      <span>購票時間</span>
                      <span>
                        {new Date(ticket.createdAt).getFullYear().toString()}.
                        {(new Date(ticket.createdAt).getMonth() + 1).toString()}.
                        {new Date(ticket.createdAt).getDate().toString()}{" "}
                        {new Date(ticket.createdAt).getHours().toString()}:
                        {(new Date(ticket.createdAt).getMinutes() < 10 ? "0" : "") +
                          new Date(ticket.createdAt).getMinutes()}
                      </span>
                    </div>
                    <div>
                      <span>活動</span>
                      <span>{ticket.title}</span>
                    </div>
                    <div>
                      <span>時間</span>
                      <span>
                        {new Date(ticket.time).getFullYear().toString()}.
                        {(new Date(ticket.time).getMonth() + 1).toString()}.{new Date(ticket.time).getDate().toString()}{" "}
                        {new Date(ticket.time).getHours().toString()}:
                        {(new Date(ticket.time).getMinutes() < 10 ? "0" : "") + new Date(ticket.time).getMinutes()}
                      </span>
                    </div>
                    <div>
                      <span>場地</span>
                      <span>{ticket.venue}</span>
                    </div>
                    <h2>訂單細節</h2>
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
                          {ticket?.tickets?.map((seat, index) => {
                            return (
                              <>
                                <tr>
                                  <td>{index + 1}</td>
                                  <td>{seat.area}</td>
                                  <td>
                                    {seat.row} 排 {seat.column} 號
                                  </td>
                                  <td>{seat.price}</td>
                                </tr>
                              </>
                            );
                          })}
                        </tbody>
                      </Table>
                    </div>
                    <div className={styles.summary}>
                      <span>總張數：</span>
                      <span>{ticket?.tickets.length}張</span>
                    </div>
                    <div className={styles.summary}>
                      <span>總價：</span>
                      <span>${ticket?.total}</span>
                    </div>
                  </fieldset>
                </div>
              </>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default Profile;
