import React from "react";

//material-ui
import { makeStyles } from "@mui/styles";

//styles
const useStyles = makeStyles((theme, props) => ({
  bar: {
    border: "7px solid #001328",
    backgroundColor: "#F7F5F8",
    zIndex: 2,
    animation: "6s ease 0s 1 normal none running zoomInUp",
    height: 50,
    marginTop: 20,
    padding: 5,
    borderRadius: 20,
    marginLeft: 40,
    marginRight: 40,
  },
  time: {
    height: "100%",
    backgroundColor: "#001328",
    borderRadius: 10,
  },
  time2: {
    height: "100%",
    position: "relative",
    backgroundColor: "#001328",
    "&::after": {
      content: '""',
      backgroundColor: "#001328",
      height: "20px",
      width: "20px",
      borderRadius: "50%",
      position: "absolute",
      top: "-80%",
      right: "-1.5%",
      animation: "2s ease 0s infinite normal none running flash",
    },
  },
  timeDone: {
    height: "100%",
    width: "100%",
    backgroundColor: "#001328",
  },
}));

const Processing = (props) => {
  const styles = useStyles();

  const { timer, time, pause } = props;

  const process = (timer / time) * 100;

  return (
    <div className={styles.bar}>
      <div
        className={
          !time || process === 100 || pause ? styles.timeDone : styles.time
        }
        style={!time ? { width: "0%" } : { width: process + "%" }}
      ></div>
    </div>
  );
};

export default Processing;
