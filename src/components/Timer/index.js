import React, { useEffect, useState } from "react";

import { makeStyles } from "@mui/styles";

import Countdown from "./Countdown";
import Processing from "./Processing";

import { socket } from "services/socket";

const useStyles = makeStyles((theme) => ({
  container: {},
}));

const Timer = ({ mode = "processing" }) => {
  const styles = useStyles();

  const [time, setTime] = useState(0);
  const [pause, setPause] = useState(true);
  const [milliseconds, setMilliseconds] = useState(0);
  const [display, setDisplay] = useState(true);
  const [timer, setTimer] = useState(0);

  //test
  const [start, setStart] = useState(new Date().getTime());

  useEffect(() => {
    socket.on("ccvq:setTime", (data) => {
      setMilliseconds(data.seconds * 1000);
      setTime(data.seconds * 1000);
    });
    socket.on("ccvq:timeState", (data) => {
      if (data.status === "pause" || data.status === "timeout") {
        setPause(true);
      }
      if (data.status === "start") {
        setPause(false);
        setStart(new Date().getTime());
      }
    });

    return () => {
      socket.off("ccvq:setTime");
      socket.off("ccvq:timeState");
    };
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!pause) {
      const timerInterval = setTimeout(() => {
        if (milliseconds > 0) {
          setMilliseconds(milliseconds - 100);
        } else {
          clearTimeout(timerInterval);
        }
      }, 100);
      return () => {
        clearTimeout(timerInterval);
      };
    }
  }, [pause, milliseconds]);

  useEffect(() => {
    if (Date.now() - start <= time && time !== milliseconds) {
      const _timer = Date.now() - start;
      setTimer(_timer);
    }
    //eslint-disable-next-line
  }, [milliseconds]);

  // useEffect(() => {
  //   const interval = setTimeout(() => {
  //     setDisplay(true);
  //   }, 3000);
  //   return () => {
  //     clearTimeout(interval);
  //   };
  // }, []);

  useEffect(() => {
    if (parseInt(((time - timer) / 1000).toString().split(".")[0]) === 0) {
      socket.emit("controller:talk", {
        receivers: ["controller", "client"],
        eventName: "ccvq:timeState",
        data: {
          status: "timeout",
        },
      });
    }
  }, [timer]);

  return (
    <div className={styles.container}>
      {display && (
        <>
          {mode === "processing" ? (
            <Processing timer={timer} pause={pause} time={time} />
          ) : (
            <Countdown timer={timer} pause={pause} time={time} />
          )}
        </>
      )}
    </div>
  );
};

export default Timer;
