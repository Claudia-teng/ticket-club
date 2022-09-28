import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./Signup.module.sass";

function Signup({ isLogin, setUserInfo, setIsLogin }) {
  let navigate = useNavigate();
  const [init, setInit] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validName, setValidName] = useState(true);
  const [nameErrorMsg, setNameErrorMsg] = useState("");
  const [validEmail, setValidEmail] = useState(true);
  const [emailErrorMsg, setEmailErrorMsg] = useState("");
  const [validPassword, setValidPassword] = useState(true);
  const [passwordErrorMsg, setPasswordErrorMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  function onNameChange(event) {
    setInit(false);
    setName(event.target.value);
    if (!event.target.value.trim()) {
      setValidName(false);
      setNameErrorMsg("請輸入使用者名稱");
    } else {
      setValidName(true);
      setNameErrorMsg("");
    }
  }

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
      onSignUp();
    }
  }

  async function onSignUp() {
    const signupInfo = {
      name,
      email,
      password,
    };

    try {
      const data = await axios.post(`${process.env.REACT_APP_DOMAIN}/user/signup`, signupInfo);
      console.log("data", data.data.data);
      setIsLogin(true);
      setUserInfo(data.data.data);
      localStorage.setItem("jwt", data.data.data.access_token);
      navigate("/profile");
    } catch (err) {
      console.log("err", err);
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
      <div className={styles.signup}>
        <div className={styles.card}>
          <h1>SIGNUP</h1>
          <div className={styles.form}>
            <div className={styles.formContainer}>
              <input
                type="text"
                placeholder="Name"
                className={validName ? "" : styles.error}
                onChange={(event) => onNameChange(event)}
                onKeyDown={(event) => handleKeyDown(event)}
                value={name}
              />
              <p className={styles.error}>{nameErrorMsg}</p>
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
                onClick={(event) => onSignUp(event)}
                disabled={init || !name || !email || !password || !validName || !validEmail || !validPassword}
              >
                Submit
              </button>
              <p className={styles.reqError}>{errorMsg}</p>
              <Link to="/login">Already have an account? Login</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signup;
