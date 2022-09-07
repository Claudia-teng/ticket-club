import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
      <p>Login</p>

      <p>Email:</p>
      <input type="text" onChange={(event) => onEmailChange(event)} value={email} />
      <p>Password:</p>
      <input type="password" onChange={(event) => onPasswordChange(event)} value={password} />
      <p>
        <button onClick={(event) => onLogin(event)}>Login</button>
      </p>
    </>
  );
}

export default Login;
