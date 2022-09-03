import styles from "./Waiting.module.sass";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Waiting({ waitPeople, setWaitPeople, ws }) {
  let navigate = useNavigate();
  useEffect(() => {
    ws.on("ready to go", () => {
      navigate("/ticket/area");
    });

    ws.on("minus waiting people", () => {
      setWaitPeople((current) => current - 1);
    });
  }, []);

  return (
    <>
      <p>前面還有：{waitPeople}人</p>
    </>
  );
}

export default Waiting;
