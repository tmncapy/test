import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { create } from "jss";
import { StylesProvider, jssPreset } from "@mui/styles";
import vendorPrefixer from "jss-plugin-vendor-prefixer";

import theme from "utils/theme";
import { ThemeProvider } from "@mui/material/styles";

import { UserProvider } from "contexts/user";

import Client from "pages/Client";
import Controller from "pages/Controller";
import Login from "pages/Login";
import NotFoundError from "pages/NotFoundError";
import Viewer from "pages/Viewer";

import "react-toastify/dist/ReactToastify.css";

const jss = create({
  plugins: [...jssPreset().plugins, vendorPrefixer()],
});

const App = () => {
  const maximizableElement = React.useRef(null);
  useEffect(() => {
    if (!document.fullscreenElement && document.fullscreenEnabled) {
      const res = maximizableElement.current
        .requestFullscreen({ navigationUI: "hide" })
        .catch((err) => {
          console.log(err);
        });
      console.log(res);
    } else {
      document.exitFullscreen();
    }
  }, []);

  return (
    <div
      style={{ textAlign: "center", position: "relative", width: "100%" }}
      ref={maximizableElement}
    >
      <StylesProvider jss={jss}>
        <ThemeProvider theme={theme}>
          <UserProvider>
            <Routes>
              <Route path="/" element={<Navigate to="/viewer" replace />} />
              <Route path="/controller" element={<Controller />} />
              <Route path="/client" element={<Client />} />
              <Route path="/viewer" element={<Viewer />} />
              <Route path="/login" element={<Login />} />
              <Route element={<NotFoundError />} />
            </Routes>
          </UserProvider>
        </ThemeProvider>
      </StylesProvider>
    </div>
  );
};

export default App;
