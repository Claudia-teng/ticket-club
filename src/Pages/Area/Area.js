import axios from "axios";
import styles from "./Area.module.sass";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import io from "socket.io-client";

function Area({ setSelectedAreaId, ws, setWs }) {
  const [areas, setAreas] = useState([]);

  async function getArea() {
    const data = await axios.get("http://localhost:3000/area/1");
    const areaData = data.data;
    setAreas(areaData);
  }

  function onSelectArea(e, areaId) {
    setSelectedAreaId(areaId);
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

  return (
    <>
      <div>Area</div>
      {Object.keys(areas).map((price) => {
        return (
          <>
            <p>{price}</p>
            {areas[price].map((data) => {
              return (
                <Link onClick={(event) => onSelectArea(event, data.id)} to="/seat">
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
