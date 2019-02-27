import React from "react";
import ReactDOM from "react-dom";
import {
  Route,
  BrowserRouter,
  Redirect,
  Switch,
  withRouter
} from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import "./index.css";
import * as serviceWorker from "./serviceWorker";

import IssueList from "./IssueList";
import IssueEdit from "./IssueEdit";
import PropTypes from "prop-types";

const NoMatch = () => <p>Page Not Found</p>;

const Header = () => (
  <Navbar bg="light" expand="lg">
    <Navbar.Brand>Issue Tracker</Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="mr-auto">
        <LinkContainer to="/issues">
          <Nav.Item className="nav-link">Issues</Nav.Item>
        </LinkContainer>
        <LinkContainer to="/reports">
          <Nav.Item className="nav-link">Reports</Nav.Item>
        </LinkContainer>
      </Nav>
      <Nav>
        <Nav.Item className="nav-link">Create Issue</Nav.Item>
        <Nav.Item className="nav-link">Logout</Nav.Item>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
);

const App = props => (
  <div>
    <Header />
    <div className="container-fluid">
      {props.children}
      <hr />
      <h5>
        <small>This is a footer</small>
      </h5>
    </div>
  </div>
);

App.propTypes = {
  children: PropTypes.object.isRequired
};

const RoutedApp = () => (
  <BrowserRouter>
    <App>
      <Switch>
        <Redirect exact from="/" to="/issues" />
        <Route path="/issues/:id" component={IssueEdit} />
        <Route path="/issues" component={withRouter(IssueList)} />
        <Route path="*" component={NoMatch} />
      </Switch>
    </App>
  </BrowserRouter>
);

ReactDOM.render(<RoutedApp />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
