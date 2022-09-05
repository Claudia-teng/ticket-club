import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./Index.module.sass";
import { useNavigate } from "react-router-dom";

function Index() {
  let navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [events, setEvents] = useState([]);

  function onInputChange(event) {
    setSearchText(event.target.value);
  }

  async function onSearchInput(event) {
    try {
      const data = await axios.get(`${process.env.REACT_APP_DOMAIN}/event?search=${searchText}`);
      setEvents(data.data);
    } catch (err) {
      console.log("err", err);
    }
  }

  function onClickEvent(e, id) {
    navigate(`/event/${id}`);
  }

  async function getEvents() {
    try {
      const data = await axios.get(`${process.env.REACT_APP_DOMAIN}/event`);
      setEvents(data.data);
    } catch (err) {
      console.log("err", err);
    }
  }

  useEffect(() => {
    getEvents();
  }, []);

  return (
    <>
      <div>Index</div>
      <div className={styles.input}>
        <input value={searchText} onChange={(event) => onInputChange(event)} />
        <button onClick={(event) => onSearchInput(event)}>搜尋</button>
      </div>
      <div className={styles.container}>
        {events &&
          events.map((event) => {
            return (
              <>
                <div className={styles.card}>
                  <p>{event.title}</p>
                  <button onClick={(e) => onClickEvent(e, event.id)}>購買票券</button>
                </div>
              </>
            );
          })}
      </div>
    </>
  );
}

export default Index;
