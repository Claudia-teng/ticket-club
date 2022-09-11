import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./Signup.module.sass";

function Signup({ setUserInfo }) {
  let navigate = useNavigate();
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
    setName(event.target.value);
  }

  function onEmailChange(event) {
    setEmail(event.target.value);
  }

  function onPasswordChange(event) {
    setPassword(event.target.value);
  }

  function onValidateEmail(event) {
    if (!/\S+@\S+\.\S+/.test(event.target.value)) {
      setValidEmail(false);
      return setEmailErrorMsg("Email格式錯誤");
    } else {
      setValidEmail(true);
      setEmailErrorMsg("");
    }
  }

  function onValidatePassword(event) {
    if (!event.target.value) {
      setValidPassword(false);
      setPasswordErrorMsg("請輸入密碼");
    } else {
      setValidPassword(true);
      setPasswordErrorMsg("");
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
      setUserInfo(data.data.data);
      localStorage.setItem("jwt", data.data.data.access_token);
      navigate("/profile");
    } catch (err) {
      console.log("err", err);
    }
  }

  function onValidateName(event) {
    if (!event.target.value) {
      setValidName(false);
      setNameErrorMsg("請輸入使用者名稱");
    } else {
      setValidName(true);
      setNameErrorMsg("");
    }
  }

  useEffect(() => {
    // navigate to profile if logged in
  }, []);

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
                value={name}
                onBlur={(event) => onValidateName(event)}
              />
              <p className={styles.error}>{nameErrorMsg}</p>
              <input
                type="text"
                placeholder="Email"
                className={validEmail ? "" : styles.error}
                value={email}
                onChange={(event) => onEmailChange(event)}
                onBlur={(event) => onValidateEmail(event)}
              />
              <p className={styles.error}>{emailErrorMsg}</p>
              <input
                type="password"
                placeholder="Password"
                className={validPassword ? "" : styles.error}
                onChange={(event) => onPasswordChange(event)}
                onBlur={(event) => onValidatePassword(event)}
                value={password}
              />
              <p className={styles.error}>{passwordErrorMsg}</p>
              <button onClick={(event) => onSignUp(event)} disabled={!validName || !validEmail || !validPassword}>
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
