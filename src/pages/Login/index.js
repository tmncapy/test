import React, { useEffect, useState } from "react";

import { makeStyles } from "@mui/styles";

import Logo from "assets/images/logo.png";
import { TextField, FormGroup, Select, MenuItem, Button } from "@mui/material";
import axios from "axios";

const API_URL = process.env.REACT_APP_ADMIN_ENDPOINT;

const useStyles = makeStyles((theme) => ({
  container: {
    width: 600,
    maxWidth: "80%",
    padding: "24px 36px",
    borderRadius: 6,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
    // whiteSpace: "nowrap",
    maxHeight: "80vh",
  },
  header: {
    color: "#FF0A2C",
  },
  logo: {
    width: "30%",
  },
  form: {
    width: "100%",
    gap: 20,
  },
  btnSubmit: {
    background:
      "radial-gradient(circle, rgba(255,10,44,1) 0%, rgba(255,83,25,1) 100%)",
    color: "white",
  },
}));

const Login = () => {
  const styles = useStyles();

  const [name, setName] = useState(localStorage.getItem("name") || "");
  const [order, setOrder] = useState(localStorage.getItem("order") || 1);
  const [password, setPassword] = useState("");

  const [allowUserList, setAllowUserList] = useState([
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
  ]);

  const handleChangeOrder = (e) => {
    console.log(e.target.value);
    setOrder(e.target.value);
  };

  const handleChangeName = (e) => {
    setName(e.target.value);
  };

  const handleChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = () => {
    let access = true;
    localStorage.setItem("name", name);
    localStorage.setItem("order", order);

    if (password === process.env.REACT_APP_PSAD) {
      if (
        localStorage.getItem("access") === "false" &&
        localStorage.getItem("password") === password
      ) {
        access = false;
      }
    }
    localStorage.setItem("access", access);
    if (access) {
      console.log("okue");
      localStorage.setItem("password", password);
      window.open("client", "_self", "");
    } else {
      window.open("login", "_self", "");
    }
  };

  useEffect(() => {
    const fetchQuestion = async () => {
      const res = await axios.get(API_URL + "/get-data/users");
      console.log("[DATA] ", res.data);
      const regex = new RegExp("^client.$");
      res.data.forEach((user) => {
        if (regex.test(user.role)) {
          setAllowUserList((prev) =>
            Object(prev).filter(
              (num) => num !== parseInt(String(user.role).slice(6))
            )
          );
        }
      });
    };
    fetchQuestion();
  }, []);

  useEffect(() => {
    console.log(allowUserList);
  }, [allowUserList]);

  return (
    <div className={styles.container}>
      <img src={Logo} alt="logo" className={styles.logo} />
      <h2 className={styles.header}>Cuộc Chiến Vương Quyền</h2>
      <FormGroup className={styles.form}>
        <TextField
          id="name"
          label="Họ và Tên"
          fullWidth
          required
          onChange={handleChangeName}
          value={name}
        />
        <Select id="order" value={order} onChange={handleChangeOrder}>
          {allowUserList.map((value) => (
            <MenuItem key={value} value={value}>
              Người chơi số {value}
            </MenuItem>
          ))}
        </Select>
        <TextField
          id="password"
          label="Mật khẩu"
          fullWidth
          required
          onChange={handleChangePassword}
          value={password}
          type="password"
        />
        <Button
          className={styles.btnSubmit}
          onClick={handleLogin}
          sx={{
            color: "white",
            height: 50,
          }}
        >
          Ready
        </Button>
      </FormGroup>
    </div>
  );
};

export default Login;
