import styles from "./Navbar.module.sass";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar({ isLogin, setIsLogin }) {
  useEffect(() => {
    if (localStorage.getItem("jwt")) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  }, [isLogin]);

  return (
    <>
      <div className={styles.navber}>
        <Link className={styles.logo} to="/">
          TICKETCLUB
        </Link>
        {isLogin ? (
          <Link className={styles.member} to="/profile">
            PROFILE
          </Link>
        ) : (
          <Link className={styles.member} to="/login">
            LOGIN
          </Link>
        )}
      </div>
    </>
  );
}

export default Navbar;
