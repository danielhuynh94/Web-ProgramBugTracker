import React from "react";
import ReactDOM from "react-dom";
import IssueList from "./IssueList";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<IssueList />, div);
  ReactDOM.unmountComponentAtNode(div);
});
