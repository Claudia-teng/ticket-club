import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./Login.module.sass";

function Login({ setUserInfo }) {
  let navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function onEmailChange(event) {
    setEmail(event.target.value);
  }

  function onPasswordChange(event) {
    setPassword(event.target.value);
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
              <input type="text" placeholder="Email" onChange={(event) => onEmailChange(event)} value={email} />
              <input
                type="password"
                placeholder="Password"
                onChange={(event) => onPasswordChange(event)}
                value={password}
              />
              <button onClick={(event) => onLogin(event)}>Submit</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
