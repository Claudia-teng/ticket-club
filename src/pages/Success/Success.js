import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import OrderConfirm from "../../components/OrderConfirm/OrderConfirm";
import styles from "./Success.module.sass";

function Success({ ws, setWs, orderConfirmInfo, setOrderConfirmInfo }) {
  let navigate = useNavigate();

  function navigateToProfile() {
    navigate("/profile");
  }
  function navigateToIndex() {
    navigate("/");
  }

  useEffect(() => {
    ws.disconnect();
    setWs(null);
    return () => {
      setOrderConfirmInfo(null);
    };
  }, []);

  useEffect(() => {
    if (!orderConfirmInfo) {
      navigate("/");
    }
  }, [orderConfirmInfo]);

  return (
    <>
      <div className={styles.successContainer}>
        <div className={styles.container}>
          <h1>恭喜您已完成購票！請確認購票資訊。</h1>
          <div>
            <OrderConfirm orderConfirmInfo={orderConfirmInfo} />
          </div>
          <div className={styles.button}>
            <button onClick={(event) => navigateToProfile(event)}>會員中心</button>
            <button onClick={(event) => navigateToIndex(event)}>繼續購票</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Success;
