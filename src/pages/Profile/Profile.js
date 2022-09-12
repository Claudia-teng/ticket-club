import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Profile({ ws, setWs, setIsLogin }) {
  const [userInfo, setUserInfo] = useState(null);
  let navigate = useNavigate();

  async function getProfileDetail() {
    let token = localStorage.getItem("jwt");
    if (!token) {
      navigate("/login");
    }
    try {
      const data = await axios.get(`${process.env.REACT_APP_DOMAIN}/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserInfo(data.data);
    } catch (err) {
      console.log("err", err);
      navigate("/login");
    }
  }

  function onLogout() {
    localStorage.removeItem("jwt");
    setIsLogin(false);
    navigate("/");
  }

  useEffect(() => {
    getProfileDetail();
    if (ws) {
      ws.disconnect();
      setWs(null);
    }
  }, []);

  return (
    <>
      <p>Profile</p>
      {userInfo && (
        <div>
          <p>Name: {userInfo.name}</p>
          <p>Email: {userInfo.email}</p>
          <button onClick={() => onLogout()}>Logout</button>
        </div>
      )}
    </>
  );
}

export default Profile;
