import React, { useEffect, useState } from "react";

import { makeStyles } from "@mui/styles";

import LogoHoz from "assets/images/qrcode.png";
import Analyze from "components/Analyze";
import Answer from "components/Answer";
import Question from "components/Question";
import Timer from "components/Timer";

import { socket } from "services/socket";

import { useIsMobile } from "hooks/useIsMobile";

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
    gap: 10,
  },
  logo: {
    width: "40%",
  },
  box: {
    border: "10px solid black",
    borderRadius: 30,
    backgroundColor: "#CED8DA",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "fixed",
    height: "70vh",
    width: "fit-content",
    padding: "0 100px",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
  logo_hoz: {
    height: "80%",
  },
}));

const Viewer = () => {
  const styles = useStyles();
  const [mode, setMode] = useState("normal");
  // mode = "question", "answer", "analyze", "normal"

  const [answer, setAnswer] = useState();
  const isMobile = useIsMobile();

  useEffect(() => {
    socket.on("connect", () => {
      socket.emit("ccvq:setName", {
        role: "viewer",
        name: "Viewer",
        position: "viewer",
      });
    });

    socket.on("ccvq:splitScreen", (data) => {
      setMode(data.screen);
    });

    return () => {
      socket.off("connect");
      socket.off("ccvq:splitScreen");
    };
  }, []);

  return (
    <div className={styles.container}>
      {isMobile && <img alt="logo" className={styles.logo} src={LogoHoz} />}
      {mode === "analyze" ? (
        <Analyze />
      ) : mode === "normal" ? (
        <div className={styles.box}>
          <img alt="logo" className={styles.logo_hoz} src={LogoHoz} />
        </div>
      ) : (
        <div className={styles.over}>
          <Question noMode={false} />
          {mode === "answer" && (
            <>
              <Timer mode={isMobile ? "countdown" : "processing"} />
              <Answer answer={answer} setAnswer={setAnswer} />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Viewer;
