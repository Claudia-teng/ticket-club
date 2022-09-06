import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Success({ ws }) {
  useEffect(() => {
    ws.disconnect();
  }, []);

  return (
    <>
      <p>Success!</p>
    </>
  );
}

export default Success;
