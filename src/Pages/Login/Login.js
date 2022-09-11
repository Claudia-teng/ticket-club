import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./Login.module.sass";

function Login({ setUserInfo }) {
  let navigate = useNavigate();
  const [init, setInit] = useState(true);
  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(true);
  const [validPassword, setValidPassword] = useState(true);
  const [password, setPassword] = useState("");
  const [emailErrorMsg, setEmailErrorMsg] = useState("");
  const [passwordErrorMsg, setPasswordErrorMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  function onEmailChange(event) {
    setInit(false);
    setEmail(event.target.value);
    if (!/\S+@\S+\.\S+/.test(event.target.value)) {
      setValidEmail(false);
      return setEmailErrorMsg("Email格式錯誤");
    } else {
      setValidEmail(true);
      setEmailErrorMsg("");
    }
  }

  function onPasswordChange(event) {
    setInit(false);
    setPassword(event.target.value);
    if (!event.target.value) {
      setValidPassword(false);
      setPasswordErrorMsg("請輸入密碼");
    } else {
      setValidPassword(true);
      setPasswordErrorMsg("");
    }
  }

  async function onLogin(event) {
    const loginInfo = {
      email,
      password,
    };
    try {
      const data = await axios.post(`${process.env.REACT_APP_DOMAIN}/user/signin`, loginInfo);
      console.log("data", data.data.data);
      setUserInfo(data.data.data);
      localStorage.setItem("jwt", data.data.data.access_token);
      navigate("/profile");
    } catch (err) {
      console.log("err", err);
      setErrorMsg(err.response.data.error);
    }
  }

  useEffect(() => {
    // navigate to profile if logged in
  }, []);

  return (
    <>
      <div className={styles.login}>
        <div className={styles.card}>
          <h1>LOGIN</h1>
          <div className={styles.form}>
            <div className={styles.formContainer}>
              <input
                type="text"
                placeholder="Email"
                className={validEmail ? "" : styles.error}
                value={email}
                onChange={(event) => onEmailChange(event)}
              />
              <p className={styles.error}>{emailErrorMsg}</p>
              <input
                type="password"
                placeholder="Password"
                className={validPassword ? "" : styles.error}
                onChange={(event) => onPasswordChange(event)}
                value={password}
              />
              <p className={styles.error}>{passwordErrorMsg}</p>
              <button
                onClick={(event) => onLogin(event)}
                disabled={init || !validEmail || !validPassword || !email || !password}
              >
                Submit
              </button>
              <p className={styles.reqError}>{errorMsg}</p>
              <Link to="/signup">Don't have an account? Sign Up</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
