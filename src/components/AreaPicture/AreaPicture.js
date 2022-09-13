import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./AreaPicture.module.sass";

function AreaPicture() {
  return (
    <>
      <div className={styles.picture}>圖片</div>
    </>
  );
}

export default AreaPicture;
