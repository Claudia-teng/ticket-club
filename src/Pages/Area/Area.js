import axios from "axios";
import styles from "./Area.module.sass";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import io from "socket.io-client";

function Area({ setSelectedAreaId, ws, setWs, timer }) {
  let navigate = useNavigate();
  const [areas, setAreas] = useState([]);

  async function getArea() {
    const data = await axios.get("http://localhost:3000/area/1");
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

  function connectWebSocket() {
    setWs(io("http://localhost:3000"));
  }

  useEffect(() => {
    getArea();
    connectWebSocket();
  }, []);

  useEffect(() => {
    if (ws) {
      console.log("success connect!");
    }
  }, [ws]);

  useEffect(() => {
    if (timer === "00:00") {
      // navigate("/index");
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
                <Link onClick={(event) => onSelectArea(event, data.id)} to="/seat" key={data.id}>
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
