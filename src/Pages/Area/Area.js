import axios from "axios";
import styles from "./Area.module.sass";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Area({ setSelectedAreaId }) {
  const [areas, setAreas] = useState([]);

  async function getArea() {
    const data = await axios.get("http://localhost:3000/area/1");
    const areaData = data.data;
    setAreas(areaData);
  }

  function onSelectArea(e, areaId) {
    setSelectedAreaId(areaId);
  }

  useEffect(() => {
    getArea();
  }, []);

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
