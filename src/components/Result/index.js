import { makeStyles } from "@mui/styles";
import React, { useEffect, useState } from "react";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: "10%",
    marginRight: "10%",
  },
  correct: {
    border: "5px solid #CED8DA",
    backgroundColor: "black",
    borderRadius: "20px",
    padding: "10px 20px",
    color: "#CED8DA",
  },
  nextTime: {
    border: "5px solid #CED8DA",
    backgroundColor: "black",
    borderRadius: "20px",
    padding: "10px 20px",
    color: "#CED8DA",
    "&:hover": {
      cursor: "pointer",
    },
  },
  btnFollow: {},
}));

const Result = ({ isCorrect }) => {
  const styles = useStyles();

  const handleOnClickNextTime = () => {
    localStorage.setItem("access", false);
  };

  return (
    <div className={styles.container}>
      {isCorrect ? (
        <div>
          <h1>Congratulations</h1>
          <h1>{localStorage.getItem("name")}</h1>
          <div className={styles.correct}>
            <h1>Next Questions</h1>
          </div>
        </div>
      ) : (
        <div>
          <h1>Sorry, may be next time</h1>
          <div className={styles.nextTime} onClick={handleOnClickNextTime}>
            <h1>
              <a
                href="https://www.facebook.com/ccvqltv"
                style={{ color: "#CED8DA" }}
              >
                Oke, thank you!
              </a>
            </h1>
          </div>
        </div>
      )}
    </div>
  );
};

export default Result;
