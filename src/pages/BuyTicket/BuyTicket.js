import { Outlet } from "react-router-dom";
import Countdown from "../../components/Countdown/Countdown";
import SessionCard from "../../components/SessionCard/SessionCard";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./BuyTicket.module.sass";

function BuyTicket({ ws, timer, setTimer, leftSeconds, setLeftSeconds, sessionInfo, setFromBuyTicket }) {
  let navigate = useNavigate();

  useEffect(() => {
    // handle refresh
    if (!ws) {
      return navigate("/");
    }

    setFromBuyTicket(true);
    setLeftSeconds(600);
    return () => {
      setFromBuyTicket(false);
    };
  }, []);

  return (
    <>
      <div className={styles.buyTicket}>
        {sessionInfo && <SessionCard sessionInfo={sessionInfo} />}
        <div className={styles.countdown}>
          <h1>COUNTDOWN</h1>
          <Countdown timer={timer} setTimer={setTimer} leftSeconds={leftSeconds} />
        </div>
        <div className={styles.warning}>
          <p>1. 購票過程請勿重新整理，否則將需重新排隊進入</p>
          <p>2. 一個帳號每個場次限購4張門票</p>
        </div>
        <Outlet />
      </div>
    </>
  );
}

export default BuyTicket;
