import React from "react";

import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    columnGap: 80,
  },
  question: {
    textAlign: "start",
    fontWeight: "normal",
  },
  image: {
    width: "auto",
    alignSelf: "flex-end",
    maxHeight: "39vh",
  },
  order: {
    textAlign: "start",
  },
}));

const ImageQuestion = ({ order, question, url }) => {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <div>
        <h1 className={styles.order}>Câu hỏi số {order}</h1>
        <h2 className={styles.question}>{question}</h2>
      </div>
      <div style={{ alignSelf: "flex-end" }}>
        <img
          className={styles.image}
          alt="image_question"
          src={`${process.env.PUBLIC_URL}/images/${url}`}
        />
      </div>
    </div>
  );
};

export default ImageQuestion;
