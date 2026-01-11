import React, { useEffect, useState } from "react";

import { makeStyles } from "@mui/styles";

import { socket } from "services/socket";
import ImageQuestion from "./ImageQuestion";

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: "#E4E9EB",
    border: "10px solid #001328",
    borderRadius: 20,
    width: "100%",
    height: "fit-content",
    minHeight: "80%",
    padding: 20,
    position: "relative",
  },
  order: {
    textAlign: "start",
  },
  question: {
    textAlign: "start",
    fontWeight: "normal",
  },
}));

const Question = ({ noMode = true }) => {
  const styles = useStyles();
  const [type, setType] = useState("image");
  const [order, setOrder] = useState();
  const [question, setQuestion] = useState("");

  const [url, setUrl] = useState("");
  const [display, setDisplay] = useState(false);

  // type : normal, image, voice, video

  useEffect(() => {
    socket.on("ccvq:sendQuestion", (data) => {
      setOrder(data.order);
      setQuestion(data.question);
      setType(data.type);
      setUrl(data.url);
      setDisplay(data.display);
    });
    return () => {
      socket.off("ccvq:sendQuestion");
    };
  }, []);

  return (
    <div className={styles.container}>
      {display && order ? (
        <>
          {type === "text" || noMode ? (
            <div>
              <h1 className={styles.order}>Câu hỏi số {order}</h1>
              <h1 className={styles.question}>{question}</h1>
            </div>
          ) : type === "image" ? (
            <ImageQuestion order={order} question={question} url={url} />
          ) : null}
        </>
      ) : (
        <div style={{ height: "60vh" }} />
      )}
    </div>
  );
};

export default Question;
