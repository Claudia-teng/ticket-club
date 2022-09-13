import axios from "axios";
import styles from "./Area.module.sass";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AreaPicture from "../AreaPicture/AreaPicture";

function Area({ sessionId, setSelectedAreaId, ws, setWs, timer }) {
  let navigate = useNavigate();
  const [areas, setAreas] = useState([]);
  const colors = ["#FFF500", "#FF7A00", "#F93131"];

  async function getArea() {
    let token = localStorage.getItem("jwt");
    const data = await axios.get(`${process.env.REACT_APP_DOMAIN}/area/${sessionId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const areaData = data.data;
    setAreas(areaData);
  }

  function onSelectArea(e, areaId) {
    setSelectedAreaId(areaId);
    const data = {
      sessionId,
      areaId,
    };
    ws.emit("join room", data);
  }

  useEffect(() => {
    // handle refresh or navigate to other page
    if (!ws) {
      navigate("/");
    }
    getArea();
  }, []);

  useEffect(() => {
    if (timer === "00:00") {
      ws.disconnect();
      setWs(null);
      // todo - modal show expires
      navigate("/");
    }
  }, [timer]);

  return (
    <>
      <div className={styles.areaContainer}>
        <AreaPicture />
        <div className={styles.selectContainer}>
          <p>請選擇區域</p>
          {Object.keys(areas).map((price, index) => {
            return (
              <>
                <div className={styles.priceContainer}>
                  <div className={styles.price}>
                    <div className={styles.box} style={{ backgroundColor: colors[index] }}></div>
                    <p>{price}區</p>
                  </div>
                  {areas[price].map((data) => {
                    if (!data.seats) {
                      return (
                        <p className={styles.zero}>
                          {data.area} - {data.seats}
                        </p>
                      );
                    } else {
                      return (
                        <Link onClick={(event) => onSelectArea(event, data.id)} to="/ticket/seat" key={data.id}>
                          <div className={styles.areaCard}>
                            <div className={styles.box} style={{ backgroundColor: colors[index] }}></div>
                            <div>
                              <p>{data.area}</p>
                              <p>剩餘 {data.seats} 位</p>
                            </div>
                          </div>
                        </Link>
                      );
                    }
                  })}
                </div>
              </>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default Area;
