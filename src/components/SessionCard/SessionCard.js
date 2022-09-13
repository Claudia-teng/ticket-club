import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./SessionCard.module.sass";
import placeIcon from "../../assets/place.png";

function SessionCard({ sessionInfo }) {
  useEffect(() => {}, []);

  return (
    <>
      <div className={styles.sessionCard}>
        <div className={styles.container}>
          <div>
            <p>{new Date(sessionInfo.time).getDate()}</p>
            <p>
              {new Date(sessionInfo.time).getMonth() + 1} 月 {new Date(sessionInfo.time).getFullYear()}
            </p>
            <p>{`${new Date(sessionInfo.time).getHours()}:${
              (new Date(sessionInfo.time).getMinutes() < 10 ? "0" : "") + new Date(sessionInfo.time).getMinutes()
            }`}</p>
          </div>
          <div>
            <div>
              <img alt="place" src={placeIcon} />
              <span>{sessionInfo.city}</span> - <span>{sessionInfo.venue}</span>
            </div>
            <p>{sessionInfo.title}</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default SessionCard;
