import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
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
      navigate("/");
      // console.log("data", data.data);
    } catch (err) {
      console.log("err", err);
    }
  }

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
