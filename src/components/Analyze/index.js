import React, { useState, useEffect } from "react";

import Cloud from "assets/images/icons/Asset 9.svg";
import Follower from "assets/images/icons/Asset 1.svg";
import { useIsMobile } from "hooks/useIsMobile";

import { makeStyles } from "@mui/styles";
import { socket } from "services/socket";
import Result from "../Result";

const useStyles = makeStyles((theme) => ({
  container: {
    border: "10px solid black",
    margin: "5% 10%",
    borderRadius: 30,
    backgroundColor: "#CED8DA",
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr 1fr",
    minHeight: "700px",
    position: "relative",
  },
  item: {
    alignSelf: "flex-end",
    padding: 20,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingBottom: 10,
  },
  column: {
    borderRadius: 30,
    border: "5px solid white",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
    paddingTop: 10,
  },
  image: {
    height: 60,
    position: "absolute",
    bottom: 35,
  },
  cloud: {},
}));

const Analyze = ({ userAnswer }) => {
  const styles = useStyles();
  const isMobile = useIsMobile();

  const [data, setData] = useState([]);

  const [answer, setAnswer] = useState("");

  useEffect(() => {
    socket.on("ccvq:analyze", (data) => {
      setData(data);
    });

    socket.on("ccvq:sendAnswer", (data) => {
      setAnswer(data.id);
    });

    return () => {
      socket.off("ccvq:analyze");
      socket.off("ccvq:sendAnswer");
    };
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div className={styles.container}>
        {Object(data).map((item) => (
          <div className={styles.item}>
            <div
              style={{
                backgroundColor: "#ADBDC3",
                height: 60 * item.value,
                width: "50%",
              }}
              className={styles.column}
            >
              {!isMobile && (
                <img
                  alt="cloud"
                  src={Cloud}
                  className={styles.cloud}
                  style={{
                    height: 50 * item.value,
                  }}
                />
              )}
            </div>
            <h1>{item.id}</h1>
            {answer === item.id && (
              <img alt="answer" className={styles.image} src={Follower} />
            )}
          </div>
        ))}
      </div>
      {isMobile && localStorage.getItem("order") && (
        <div>
          {userAnswer ? (
            <h1>Your Answer is: {userAnswer}</h1>
          ) : (
            <h1>Not Yet Answer</h1>
          )}
          {answer && <Result isCorrect={answer === userAnswer} />}
        </div>
      )}
    </div>
  );
};

export default Analyze;
