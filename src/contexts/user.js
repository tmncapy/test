import React, { useState } from "react";

const UserContext = React.createContext();

const USERS_FORMAT = [
  {
    name: "PLAYER 1",
    score: 0,
    order: 1,
  },
  {
    name: "PLAYER 2",
    score: 0,
    order: 2,
  },
  {
    name: "PLAYER 3",
    score: 0,
    order: 3,
  },
  {
    name: "PLAYER 4",
    score: 0,
    order: 4,
  },
  {
    name: "PLAYER 5",
    score: 0,
    order: 5,
  },
  {
    name: "PLAYER 6",
    score: 0,
    order: 6,
  },
  {
    name: "PLAYER 7",
    score: 0,
    order: 7,
  },
  {
    name: "PLAYER 8",
    score: 0,
    order: 8,
  },
  {
    name: "PLAYER 9",
    score: 0,
    order: 9,
  },
  {
    name: "PLAYER 10",
    score: 0,
    order: 10,
  },
];

const UserProvider = ({ children }) => {
  const [users, setUsers] = useState(USERS_FORMAT);
  const [logContent, setLogContent] = useState("");

  const setEachPlayerScore = (playerId, score) => {
    setUsers((prev) =>
      Object(prev).map((user) => {
        if (user.order === playerId) {
          return { ...user, score: user.score + score };
        } else return { ...user };
      })
    );
  };

  const setPlayerName = (order, name) => {
    console.log(order, name);
    setUsers((prev) =>
      Object(prev).map((user) => {
        if (user.order === order) return { ...user, name: name };
        else return { ...user };
      })
    );
  };

  const setAnswerUser = (order, answer) => {
    console.log(order, answer);
    setUsers((prev) =>
      Object(prev).map((user) => {
        if (user.order === order) return { ...user, answer: answer };
        else return { ...user };
      })
    );
  };

  return (
    <UserContext.Provider
      value={{
        state: {
          users,
          logContent,
        },
        action: {
          setEachPlayerScore,
          setPlayerName,
          setAnswerUser,
        },
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
