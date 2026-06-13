import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { DepartProvider } from "./contexts/DepartContext";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter basename="/">
    <AuthProvider>
      <DepartProvider>
        <App />
      </DepartProvider>
    </AuthProvider>
  </BrowserRouter>,
);
