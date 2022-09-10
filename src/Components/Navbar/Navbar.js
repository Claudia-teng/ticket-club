import styles from "./Navbar.module.sass";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <>
      <div className={styles.navber}>
        <Link className={styles.logo} to="/">
          TICKETCLUB
        </Link>
        <Link className={styles.member} to="/login">
          LOGIN
        </Link>
      </div>
    </>
  );
}

export default Navbar;
