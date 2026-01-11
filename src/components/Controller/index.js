import React, { useState, useEffect, useContext } from "react";

import { makeStyles } from "@mui/styles";
import { Button, MenuItem, Select } from "@mui/material";
import { socket } from "services/socket";
import { UserContext } from "contexts/user";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    overflowX: "scroll",
    gap: "10px",
  },
}));

const ControlButton = ({
  questions,
  selectionSet,
  setSelectionSet,
  question,
  setQuestion,
}) => {
  const styles = useStyles();

  const [startTimer, setStartTimer] = useState(false);

  const { state } = useContext(UserContext);

  const handleChangeSet = (e) => {
    setSelectionSet(e.target.value);
  };

  const handleChangeQuestion = (e) => {
    setQuestion(e.target.value);
  };

  const handleOnStart = () => {
    socket.emit("controller:talk", {
      receivers: ["viewer", "client"],
      eventName: "ccvq:splitScreen",
      data: {
        screen: "question",
      },
    });
  };

  const handleOnSendQuestion = () => {
    const data = questions[selectionSet].data[question - 1];
    socket.emit("controller:talk", {
      receivers: ["viewer", "client"],
      eventName: "ccvq:sendQuestion",
      data: {
        order: data.id,
        question: data.question,
        type: data.type,
        url: data.url,
        display: true,
      },
    });
    socket.emit("controller:talk", {
      receivers: ["viewer", "client"],
      eventName: "ccvq:splitScreen",
      data: {
        screen: "answer",
      },
    });
  };

  const handleOpenSolution = () => {
    const data = questions[selectionSet].data[question - 1];
    socket.emit("controller:talk", {
      receivers: ["viewer", "client"],
      eventName: "ccvq:openSolution",
      data: {
        solutions: data.solution,
      },
    });
    socket.emit("controller:talk", {
      receivers: ["viewer", "client", "controller"],
      eventName: "ccvq:setTime",
      data: {
        seconds: 15,
      },
    });
  };

  const handleStartTimer = () => {
    setStartTimer(true);
    socket.emit("controller:talk", {
      receivers: ["viewer", "client", "controller"],
      eventName: "ccvq:timeState",
      data: {
        status: "start",
      },
    });
  };

  const handleStopTimer = () => {
    setStartTimer(false);
    socket.emit("controller:talk", {
      receivers: ["viewer", "client", "controller"],
      eventName: "ccvq:timeState",
      data: {
        status: "pause",
      },
    });
  };

  const handleShowAnalytics = () => {
    socket.emit("controller:talk", {
      receivers: ["viewer", "client"],
      eventName: "ccvq:splitScreen",
      data: {
        screen: "analyze",
      },
    });

    const { users } = state;

    const data = users.reduce(
      (prev, cur) => {
        let dumb = prev;
        if (cur.answer) {
          dumb[String(cur.answer).charCodeAt(0) - 65].value++;
        }
        return dumb;
      },
      [
        { id: "A", value: 0 },
        { id: "B", value: 0 },
        { id: "C", value: 0 },
        { id: "D", value: 0 },
      ]
    );

    socket.emit("controller:talk", {
      receivers: ["viewer", "client"],
      eventName: "ccvq:analyze",
      data: data,
    });
  };

  const handleSendAnswer = () => {
    const data = questions[selectionSet].data[question - 1];
    socket.emit("controller:talk", {
      receivers: ["viewer", "client"],
      eventName: "ccvq:sendAnswer",
      data: {
        confirmation: true,
        id: data.ans,
      },
    });
  };

  useEffect(() => {
    socket.on("ccvq:timeState", (data) => {
      console.log(data);
      if (data.status === "timeout") {
        setStartTimer(false);
      }
    });

    return () => {
      socket.off("ccvq:timeState");
    };
  }, []);

  return (
    <div className={styles.container}>
      <Select value={selectionSet} onChange={handleChangeSet}>
        {Object.keys(questions).map((ques) => (
          <MenuItem value={ques} key={ques}>
            Lượt {parseInt(ques) + 1}
          </MenuItem>
        ))}
      </Select>
      <Select value={question} onChange={handleChangeQuestion}>
        {questions[selectionSet].data.map((ques) => (
          <MenuItem value={ques.id} key={ques.id}>
            <p>Cau hoi so {ques.id}</p>
          </MenuItem>
        ))}
      </Select>
      <Button
        variant="outlined"
        sx={{ color: "#001328", border: "2px solid #001328" }}
        color="success"
        onClick={handleOnStart}
      >
        Bắt đầu
      </Button>
      <Button
        variant="contained"
        sx={{ color: "#CED8DA", backgroundColor: "#001328" }}
        color="tertiary"
        onClick={handleOnSendQuestion}
      >
        Gửi câu hỏi
      </Button>
      <Button
        variant="contained"
        sx={{ color: "#CED8DA", backgroundColor: "#001328" }}
        color="danger"
        onClick={handleOpenSolution}
      >
        Mở đáp án
      </Button>
      {!startTimer ? (
        <Button
          variant="outlined"
          sx={{ color: "#001328", border: "2px solid #001328" }}
          color="success"
          onClick={handleStartTimer}
        >
          Đếm giờ
        </Button>
      ) : (
        <Button
          variant="contained"
          sx={{ color: "#CED8DA", backgroundColor: "#001328" }}
          color="danger"
          onClick={handleStopTimer}
        >
          Tạm dừng
        </Button>
      )}
      {/* <Button
        variant="outlined"
        sx={{ color: "#001328", border: "2px solid #001328" }}
        color="success"
      >
        Show
      </Button> */}
      {/* <Button
        variant="outlined"
        sx={{ color: "#001328", border: "2px solid #001328" }}
        color="success"
        onClick={handleShowAnalytics}
      >
        Coi kết quả
      </Button> */}
      <Button
        variant="contained"
        sx={{ color: "#CED8DA", backgroundColor: "#001328" }}
        color="danger"
        onClick={handleSendAnswer}
      >
        Chốt
      </Button>
    </div>
  );
};

export default ControlButton;
