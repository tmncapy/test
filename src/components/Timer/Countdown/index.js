import React from "react";

import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  container: {},
  countdown: {
    fontSize: "8rem",
    margin: "2rem 0",
    marginBottom: 10,
  },
}));

const Countdown = (props) => {
  const styles = useStyles();
  const { timer, time } = props;
  const countdown = ((time - timer) / 1000).toString().split(".")[0];

  return (
    <div className={styles.container}>
      <h1 className={styles.countdown}>{countdown}</h1>
    </div>
  );
};

export default Countdown;
