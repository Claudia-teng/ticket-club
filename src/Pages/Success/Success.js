import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Success({ ws, setWs }) {
  useEffect(() => {
    ws.disconnect();
    setWs(null);
  }, []);

  return (
    <>
      <p>Success!</p>
    </>
  );
}

export default Success;
