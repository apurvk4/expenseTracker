import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./App/store";
import { Analytics } from "@vercel/analytics/react";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
        <Analytics />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
