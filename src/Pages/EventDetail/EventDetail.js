import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import io from "socket.io-client";

function EventDetail({ ws, setWs, setWaitPeople }) {
  let navigate = useNavigate();
  const [sessionId, setSessionId] = useState(null);

  function onBuyTicket(event, sessionId) {
    setWs(
      io("http://localhost:3000", {
        auth: 1,
      })
    );
    setSessionId(sessionId);
  }

  useEffect(() => {
    if (ws) {
      console.log("success connect!");
      ws.on("check limit", (data) => {
        // console.log("data", data);
        setWaitPeople(data.wait);
        data.pass ? navigate("/ticket/area") : navigate("/wait");
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
