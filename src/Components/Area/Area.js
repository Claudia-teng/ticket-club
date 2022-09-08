import axios from "axios";
import styles from "./Area.module.sass";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Area({ sessionId, setSelectedAreaId, ws, setWs, timer, setTimer }) {
  let navigate = useNavigate();
  const [areas, setAreas] = useState([]);

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
      sessionId: 1,
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
      <div>Area</div>
      {Object.keys(areas).map((price) => {
        return (
          <>
            <p>{price}</p>
            {areas[price].map((data) => {
              return (
                <Link onClick={(event) => onSelectArea(event, data.id)} to="/ticket/seat" key={data.id}>
                  {data.area} - {data.seats}
                </Link>
              );
            })}
          </>
        );
      })}
    </>
  );
}

export default Area;
