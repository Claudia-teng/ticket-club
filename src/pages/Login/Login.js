import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./Login.module.sass";

function Login({ isLogin, setUserInfo, setIsLogin }) {
  let navigate = useNavigate();
  const [init, setInit] = useState(false);
  const [email, setEmail] = useState("demo@test.com");
  const [validEmail, setValidEmail] = useState(true);
  const [validPassword, setValidPassword] = useState(true);
  const [password, setPassword] = useState("demodemo");
  const [emailErrorMsg, setEmailErrorMsg] = useState("");
  const [passwordErrorMsg, setPasswordErrorMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

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

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      onLogin();
    }
  }

  async function onLogin(event) {
    setLoading(true);
    const loginInfo = {
      email,
      password,
    };
    try {
      const data = await axios.post(`https://claudia-teng.com/user/signin`, loginInfo);
      // console.log("data", data.data.data);
      setIsLogin(true);
      setUserInfo(data.data.data);
      localStorage.setItem("jwt", data.data.data.access_token);
      navigate("/profile");
    } catch (err) {
      // console.log("err", err);
      setLoading(false);
      setIsLogin(false);
      setErrorMsg(err.response.data.error);
    }
  }

  useEffect(() => {
    if (isLogin) {
      navigate("/profile");
    }
  }, [isLogin]);

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
                onKeyDown={(event) => handleKeyDown(event)}
              />
              <p className={styles.error}>{emailErrorMsg}</p>
              <input
                type="password"
                placeholder="Password"
                className={validPassword ? "" : styles.error}
                onChange={(event) => onPasswordChange(event)}
                onKeyDown={(event) => handleKeyDown(event)}
                value={password}
              />
              <p className={styles.error}>{passwordErrorMsg}</p>
              <button
                onClick={(event) => onLogin(event)}
                disabled={init || !validEmail || !validPassword || !email || !password || loading}
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
