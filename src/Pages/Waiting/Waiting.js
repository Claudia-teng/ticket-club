import styles from "./Waiting.module.sass";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Waiting({ waitPeople }) {
  return (
    <>
      <p>前面還有：{waitPeople}人</p>
    </>
  );
}

export default Waiting;
