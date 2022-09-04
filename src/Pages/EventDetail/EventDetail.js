import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import io from "socket.io-client";

function EventDetail({ ws, setWs, setWaitPeople, setLeftSeconds }) {
  let navigate = useNavigate();
  const [sessionId, setSessionId] = useState(null);

  function onBuyTicket(event, sessionId) {
    setWs(
      io("http://localhost:3000", {
        auth: {
          token: 1,
        },
      })
    );
    setSessionId(sessionId);
  }

  useEffect(() => {
    if (ws) {
      ws.disconnect();
    }
  }, []);

  useEffect(() => {
    if (ws) {
      console.log("success connect!");
      ws.on("check limit", (data) => {
        // console.log("data", data);
        setWaitPeople(data.waitPeople);
        if (data.pass) {
          navigate("/ticket/area");
        } else {
          console.log("data", data);
          setWaitPeople(data.waitPeople);
          const expires = +data.milliseconds + 610 * 1000;
          const seconds = Math.floor((expires - +data.timeStamp) / 1000);
          console.log("seconds", seconds);
          setLeftSeconds(seconds);
          navigate("/wait");
        }
      });
    }
  }, [ws]);

  useEffect(() => {
    if (sessionId) {
      ws.emit("check limit", sessionId);
    }
  }, [sessionId]);

  return (
    <>
      <div>EventDetail</div>
      <button onClick={(event) => onBuyTicket(event, 1)}>購買票券</button>
    </>
  );
}

export default EventDetail;
