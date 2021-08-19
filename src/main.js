import React, { Component } from "react";
import ReactDom from "react-dom";

import "./css/app.css";

class App extends Component {
  render() {
    return <h1>React-APP-Webpack</h1>
  }
}

ReactDom.render(
  <App />,
  document.getElementById("app")
);