import React, { useEffect, useContext, useState } from "react";

import { makeStyles } from "@mui/styles";
import Timer from "components/Timer";
import UserList from "components/UserList";

import Gateway from "assets/images/icons/Asset 8.svg";
import ControlButton from "components/Controller";

import { socket } from "services/socket";
import { UserContext } from "contexts/user";
import axios from "axios";

const sample_data = require("assets/Fes.json");

const useStyles = makeStyles((theme) => ({
  container: {
    border: "10px solid black",
    borderRadius: 30,
    backgroundColor: "#CED8DA",
    minHeight: "-webkit-fill-available",
    display: "grid",
    gridTemplateRows: "3fr 1fr",
    rowGap: 30,
    padding: 20,
  },
  box: {
    border: "5px solid black",
    borderRadius: 20,
    padding: 20,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  },
  image: {
    width: "70%",
  },
}));

const API_URL = process.env.REACT_APP_ADMIN_ENDPOINT;

const Controller = () => {
  const styles = useStyles();

  const [questions, setQuestions] = useState(sample_data);
  const [selectionSet, setSelectionSet] = useState(0);
  const [question, setQuestion] = useState(1);

  const { action } = useContext(UserContext);

  useEffect(() => {
    const clearUsers = async () => {
      const res = await axios.post(API_URL + "/clear/users");
      console.log(res.data);
    };

    clearUsers();

    socket.on("connect", () => {
      socket.emit("ccvq:setName", {
        role: "controller",
        name: "Admin",
        position: "controller",
      });
    });

    socket.on("server:connectedData", ({ users }) => {
      const regex = new RegExp("^client.$");
      users.forEach((connect) => {
        if (regex.test(connect.role)) {
          action.setPlayerName(
            parseInt(String(connect.role).slice(6)),
            connect.name
          );
        }
      });
    });

    socket.on("server:disconnectedData", (data) => {
      console.log(data);
    });

    return () => {
      socket.off("connect");
      socket.off("server:connectedData");
      socket.off("server:disconnectedData");
    };
  }, []);

  return (
    <div style={{ height: "100vh", padding: 30, overflow: "hidden" }}>
      <div className={styles.container}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "3fr 1fr",
            columnGap: 30,
          }}
        >
          <div className={styles.box} style={{ textAlign: "start" }}>
            <div>{questions[selectionSet].data[question - 1].question}</div>
            <div
              style={
                questions[selectionSet].data[question - 1].type === "image"
                  ? {
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    maxHeight: 500,
                  }
                  : {}
              }
            >
              <div
                className={styles.box}
                style={{ textAlign: "start", border: 0 }}
              >
                <ul style={{ marginBottom: "10px" }}>
                  {questions[selectionSet].data[question - 1].solution.map(
                    (item) => (
                      <li>
                        {item.id} {item.value}
                      </li>
                    )
                  )}
                </ul>
                <div>
                  Câu trả lời {questions[selectionSet].data[question - 1].ans}
                </div>
              </div>
              {questions[selectionSet].data[question - 1].type === "image" && (
                <img
                  alt="image_question"
                  src={`${process.env.PUBLIC_URL}/images/${questions[selectionSet].data[question - 1].url
                    }`}
                  style={{ maxHeight: 200 }}
                />
              )}
            </div>

            <UserList />
          </div>
          <div className={styles.box}>
            <Timer mode="countdown" />
            <img alt="gateway" src={Gateway} className={styles.image} />
          </div>
        </div>
        <div className={styles.box}>
          <ControlButton
            questions={questions}
            selectionSet={selectionSet}
            setSelectionSet={setSelectionSet}
            question={question}
            setQuestion={setQuestion}
          />
        </div>
      </div>
    </div>
  );
};

export default Controller;
