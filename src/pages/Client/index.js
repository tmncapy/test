import React, { useEffect, useState } from "react";

import { makeStyles } from "@mui/styles";
import Question from "components/Question";
import Answer from "components/Answer";
import Timer from "components/Timer";
import { useIsMobile } from "hooks/useIsMobile";
import LogoHoz from "assets/images/logo_hoz.png";
import Analyze from "components/Analyze";

import { socket } from "services/socket";

const useStyles = makeStyles((theme) => ({
  container: {
    width: "100%",
    height: "100%",
    minHeight: "-webkit-fill-available",
    overflow: "hidden",
    padding: 0,
    margin: 0,
  },
  over: {
    display: "flex",
    flexDirection: "column",
    margin: "5% 10%",
  },
  logo: {
    width: "40%",
  },
}));

const Client = () => {
  const styles = useStyles();
  const [mode, setMode] = useState("question");
  const [answer, setAnswer] = useState();
  const [score, setScore] = useState(0);
  const isMobile = useIsMobile();
  // mode = "question", "answer", "analyze",

  useEffect(() => {
    socket.on("connect", () => {
      console.log(localStorage.getItem("access"));
      if (localStorage.getItem("access") !== "true") {
        window.open("login", "_self", "");
        window.close();
      } else {
        console.log("oke can connected");
        const name = localStorage.getItem("name");
        const order = localStorage.getItem("order");
        socket.emit("ccvq:setName", {
          role: "client",
          name,
          position: order,
        });
      }
    });

    socket.on("ccvq:splitScreen", (data) => {
      setMode(data.screen);
      if (data.screen === "question") {
        console.log("reset");
        setAnswer(null);
      }
    });

    return () => {
      socket.off("ccvq:splitScreen");
    };
  }, []);

  return (
    <div className={styles.container}>
      {isMobile && <img alt="logo" className={styles.logo} src={LogoHoz} />}
      {mode !== "analyze" ? (
        <div className={styles.over}>
          <Question />
          {mode === "answer" && (
            <>
              <Timer mode={isMobile ? "countdown" : "processing"} />
              <Answer answer={answer} setAnswer={setAnswer} />
            </>
          )}
        </div>
      ) : (
        <Analyze userAnswer={answer} />
      )}
      {isMobile && mode === "question" && <h1>Your Score : {score}</h1>}
    </div>
  );
};

export default Client;
