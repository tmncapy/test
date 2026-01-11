import io from "socket.io-client";

const SOCKET_URL = `${process.env.REACT_APP_SERVER_URL}:${process.env.REACT_APP_SERVER_PORT}`;

// const SOCKET_URL = `http://10.9.9.217:2021`;

export const socket = io(SOCKET_URL);
