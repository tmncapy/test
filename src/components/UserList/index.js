import React, { useContext, useEffect, useState } from "react";

import { makeStyles } from "@mui/styles";
import FanIcon from "assets/images/icons/Asset 24.svg";
import BambooIcon from "assets/images/icons/Asset 10.svg";

import { UserContext } from "contexts/user";
import { socket } from "services/socket";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    overflow: "scroll",
    maxWidth: "700px",
    gap: "10px",
  },
  box: {
    border: "2px solid black",
    borderRadius: 20,
    display: "grid",
    gridTemplateColumns: "1fr 8fr 1fr",
    padding: 5,
    columnGap: 10,
    backgroundColor: "#CED8DA",
    width: "fit-content",
    whiteSpace: "nowrap",
  },
  item: {
    border: "2px solid black",
    borderRadius: 20,
    display: "flex",
    alignItems: "center",
    padding: 5,
  },
  icon: {
    height: "32px",
    marginRight: 20,
  },
}));

const UserList = () => {
  const styles = useStyles();

  const { state, action } = useContext(UserContext);

  const { users } = state;

  useEffect(() => {
    socket.on("ccvq:clientSendAnswer", (data) => {
      action.setAnswerUser(parseInt(data.order), data.answer);
    });

    return () => {
      socket.off("ccvq:clientSendAnswer");
    };
  }, []);

  return (
    <div className={styles.container}>
      {users.map((user) => (
        <div className={styles.box}>
          <div className={styles.item} style={{ justifyContent: "center" }}>
            <img
              alt="bamboo"
              className={styles.icon}
              src={BambooIcon}
              style={{
                marginRight: 5,
              }}
            />
            {user.order}
          </div>
          <div className={styles.item}>
            <img alt="icon" className={styles.icon} src={FanIcon} />
            {user.name}
          </div>
          <div
            className={styles.item}
            style={{ justifyContent: "center", fontWeight: "bold" }}
          >
            {user.answer || "NOT YET"}
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserList;
