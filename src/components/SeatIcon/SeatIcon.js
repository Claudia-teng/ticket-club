import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./SeatIcon.module.sass";

function SeatIcon({ color }) {
  return (
    <>
      <svg
        className={styles.svg}
        width="20"
        height="21"
        viewBox="0 0 20 21"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M18.2783 8.79932V4.77003C18.2783 2.13674 16.1049 0 13.431 0H6.5771C3.90719 0 1.72975 2.14081 1.72975 4.77003V8.79932C0.712248 9.29179 0 10.3256 0 11.5303V20.004H6.66664V19.1697H13.3333V20.004H19.9999V11.5303C20.0081 10.3256 19.2958 9.28772 18.2783 8.79932ZM5.00202 12.503V14.1717V18.3394H1.6687V11.5303C1.6687 10.8791 2.12453 10.3337 2.73503 10.1953H2.74317C2.84899 10.1709 2.94667 10.1587 3.04028 10.1587H3.62636C4.38338 10.1587 5.00202 10.7733 5.00202 11.5344V12.503ZM13.3374 14.1676H6.67071V12.4989H13.3374V14.1676ZM15.0061 18.3353V14.1676V12.4989V11.5262C15.0061 10.7692 15.6206 10.1506 16.3817 10.1506H16.9637C17.0573 10.1506 17.155 10.1628 17.2608 10.1872H17.269C17.8795 10.3256 18.3353 10.8709 18.3353 11.5221V18.3353H15.0061Z"
          fill={color}
          className={color === "#ffffff" || color === "#FFF500" ? styles.pointer : ""}
        />
      </svg>
    </>
  );
}

export default SeatIcon;
