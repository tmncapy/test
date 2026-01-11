import React, { useEffect, useState } from "react";

import { makeStyles } from "@mui/styles";
import { useIsMobile } from "hooks/useIsMobile";
import { socket } from "services/socket";

import Cloud from "assets/images/icons/Asset 9.svg";

const useStyles = makeStyles((theme) => ({
  container: {
    width: "100%",
    marginTop: 30,
  },
  normal: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gridTemplateRows: "1fr 1fr",
    columnGap: 20,
    rowGap: 20,
  },
  mobile: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  solution: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyItems: "space-between",
    gap: 20,
    backgroundColor: "#E4E9EB",
    border: "5px solid #001328",
    padding: "5px 10px",
    borderRadius: 30,
    position: "relative",
  },
  id: {
    width: "fit-content",
  },
  value: {
    width: "fit-content",
  },
  answer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    borderRadius: 25,
    border: "5px solid #001328",
  },
  cloud: {
    position: "absolute",
    top: 0,
    right: 10,
    width: 80,
  },
}));

const Answer = ({ answer, setAnswer }) => {
  const isMobile = useIsMobile();

  const styles = useStyles();
  const [disable, setDisable] = useState(true);
  const [solutions, setSolutions] = useState([
    { id: "A", value: "" },
    { id: "B", value: "" },
    { id: "C", value: "" },
    { id: "D", value: "" }
  ]);
  const [confirmation, setConfirmation] = useState(false);

  const handleClickSolution = (answer) => () => {
    if (!disable) {
      setAnswer(answer);
      socket.emit("controller:talk", {
        receivers: ["controller"],
        eventName: "ccvq:clientSendAnswer",
        data: {
          order: localStorage.getItem("order"),
          answer: answer,
        },
      });
    }
  };

  useEffect(() => {
    socket.on("ccvq:openSolution", (data) => {
      setSolutions(data.solutions);
    });

    socket.on("ccvq:timeState", (data) => {
      if (data.status === "start") {
        setDisable(false);
      } else {
        setDisable(true);
      }
    });

    socket.on("ccvq:sendAnswer", (data) => {
      setAnswer(data.id);
      setConfirmation(data.confirmation);
    });

    return () => {
      socket.off("ccvq:openSolution");
      socket.off("ccvq:timeState");
      socket.off("ccvq:sendAnswer");
    };
  }, []);

  return (
    <div
      className={`${styles.container} ${isMobile ? styles.mobile : styles.normal
        }`}
    >
      {Object(solutions).map((solution) => (
        <div
          className={styles.solution}
          key={solution.id}
          onClick={handleClickSolution(solution.id)}
        >
          {confirmation && answer === solution.id && (
            <div className={styles.answer}>
              <img alt={solution.id} src={Cloud} className={styles.cloud} />
            </div>
          )}
          <h1 className={styles.id}>{solution.id}</h1>
          <p className={styles.value}>{solution.value}</p>
        </div>
      ))}
    </div>
  );
};

export default Answer;
