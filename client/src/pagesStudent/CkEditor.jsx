import React from "react";
import ReactDOM from "react-dom";

import { Editors } from "./Editors";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <React.StrictMode>
    <Editors />
  </React.StrictMode>,
  rootElement
);
