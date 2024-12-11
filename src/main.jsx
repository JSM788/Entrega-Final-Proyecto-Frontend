import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
// import './index.css'
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@material-tailwind/react";
import ContextProvider from './Components/utils/global.context';

//const basename = import.meta.env.MODE === "production" ? "/movelt-front" : "/";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ThemeProvider>
      <ContextProvider>
        <App />
      </ContextProvider>
    </ThemeProvider>
  </BrowserRouter>
);
