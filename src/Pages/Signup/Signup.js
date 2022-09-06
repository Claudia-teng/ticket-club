import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Signup() {
  let navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function onNameChange(event) {
    setName(event.target.value);
  }

  function onEmailChange(event) {
    setEmail(event.target.value);
  }

  function onPasswordChange(event) {
    setPassword(event.target.value);
  }

  async function onSignUp() {
    const signupInfo = {
      name,
      email,
      password,
    };

    try {
      const data = await axios.post(`${process.env.REACT_APP_DOMAIN}/user/signup`, signupInfo);
      navigate("/");
      // console.log("data", data.data);
    } catch (err) {
      console.log("err", err);
    }
  }

  return (
    <>
      <p>Sign Up</p>
      <p>Name:</p>
      <input type="text" onChange={(event) => onNameChange(event)} value={name} />
      <p>Email:</p>
      <input type="text" onChange={(event) => onEmailChange(event)} value={email} />
      <p>Password:</p>
      <input type="password" onChange={(event) => onPasswordChange(event)} value={password} />
      <p>
        <button onClick={(event) => onSignUp(event)}>Sign Up</button>
      </p>
    </>
  );
}

export default Signup;
