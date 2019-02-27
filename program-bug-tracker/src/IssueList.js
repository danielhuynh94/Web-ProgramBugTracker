import React, { Component } from "react";
import { Button, Table, Card } from "react-bootstrap";
import "./App.css";

import IssueAdd from "./IssueAdd.js";
import IssueFilter from "./IssueFilter.js";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import querystring from "querystring";
import Toast from "./Toast";

const IssueRow = props => {
  function onDeleteClick() {
    props.deleteIssue(props.issue._id);
  }

  return (
    <tr>
      <td>
        <Link to={`/issues/${props.issue._id}`}>
          {props.issue._id.substr(-4)}
        </Link>
      </td>
      <td>{props.issue.status}</td>
      <td>{props.issue.owner}</td>
      <td>{props.issue.created.toDateString()}</td>
      <td>{props.issue.effort}</td>
      <td>
        {props.issue.completionDate
          ? props.issue.completionDate.toDateString()
          : ""}
      </td>
      <td>{props.issue.title}</td>
      <td>
        <Button onClick={onDeleteClick}>Delete</Button>
      </td>
    </tr>
  );
};

IssueRow.propTypes = {
  issue: PropTypes.object.isRequired,
  deleteIssue: PropTypes.func.isRequired
};

function IssueTable(props) {
  const issueRows = props.issues.map(issue => (
    <IssueRow key={issue._id} issue={issue} deleteIssue={props.deleteIssue} />
  ));
  return (
    <Table bordered hover responsive>
      <thead>
        <tr>
          <th>Id</th>
          <th>Status</th>
          <th>Owner</th>
          <th>Created</th>
          <th>Effort</th>
          <th>Completion Date</th>
          <th>Title</th>
        </tr>
      </thead>
      <tbody>{issueRows}</tbody>
    </Table>
  );
}

IssueTable.propTypes = {
  issues: PropTypes.array.isRequired,
  deleteIssue: PropTypes.func.isRequired
};

function convertObjectToQueryString(queryStringObject) {
  if (!queryStringObject) {
    return "";
  }
  return Object.keys(queryStringObject)
    .map(key => key + "=" + queryStringObject[key])
    .join("&");
}

export default class IssueList extends Component {
  constructor() {
    super();
    this.state = {
      issues: [],
      toastVisible: false, toastMessage: '', toastType: 'success'
    };
    this.createIssue = this.createIssue.bind(this);
    this.setFilter = this.setFilter.bind(this);
    this.deleteIssue = this.deleteIssue.bind(this);
    this.showError = this.showError.bind(this);
    this.dismissToast = this.dismissToast.bind(this);
  }
  componentDidMount() {
    this.loadData();
  }
  showError(message) {
    this.setState({ toastVisible: true, toastMessage: message, toastType: 'danger' });
  }
  dismissToast() {
    this.setState({ toastVisible: false });
  }
  componentDidUpdate(prevProps) {
    const oldParams = querystring.parse(prevProps.location.search.substring(1));
    const newParams = querystring.parse(
      this.props.location.search.substring(1)
    );
    if (
      oldParams.status === newParams.status &&
      oldParams.effort_gte === newParams.effort_gte &&
      oldParams.effort_lte === newParams.effort_lte
    ) {
      return;
    }
    this.loadData();
  }
  loadData() {
    fetch(`/api/issues${this.props.location.search}`)
      .then(response => {
        if (response.ok) {
          response.json().then(data => {
            console.log("Total count of records:", data._metadata.total_count);
            data.records.forEach(issue => {
              issue.created = new Date(issue.created);
              if (issue.completionDate) {
                issue.completionDate = new Date(issue.completionDate);
              }
            });
            this.setState({ issues: data.records });
          });
        } else {
          response.json().then(error => {
            this.showError(`Failed to fetch issues ${error.message}`);
          });
        }
      })
      .catch(err => {
        this.showError(`Error in fetching data from server: ${err}`);
      });
  }
  createIssue(newIssue) {
    fetch("/api/issues", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newIssue)
    })
      .then(response => {
        if (response.ok) {
          response.json().then(updatedIssue => {
            updatedIssue.created = new Date(updatedIssue.created);
            if (updatedIssue.completionDate) {
              updatedIssue.completionDate = new Date(
                updatedIssue.completionDate
              );
            }
            const newIssues = this.state.issues.concat(updatedIssue);
            this.setState({ issues: newIssues });
          });
        } else {
          response.json().then(err => {
            this.showError(`Failed to add issue: ${err.message}`);
          });
        }
      })
      .catch(err => {
        this.showError(`Error in sending data to server: ${err.message}`);
      });
  }
  setFilter(query) {
    let queryString = convertObjectToQueryString(query);
    queryString = queryString ? "?" + queryString : "";
    if (
      this.props.match.path === this.props.location.pathname &&
      queryString === this.props.location.search
    ) {
      return 0;
    }
    this.props.history.push({
      pathname: this.props.match.path,
      search: queryString
    });
  }
  deleteIssue(id) {
    fetch(`api/issues/${id}`, { method: "DELETE" }).then(response => {
      if (!response.ok) {
        if (!response.ok) this.showError('Failed to delete issue');
      } else {
        this.loadData();
      }
    });
  }
  render() {
    return (
      <div>
        <Card>
          <Card.Header>Filters</Card.Header>
          <Card.Body>
            <IssueFilter
              setFilter={this.setFilter}
              queryString={this.props.location.search}
            />
          </Card.Body>
        </Card>
        <hr />
        <IssueTable issues={this.state.issues} deleteIssue={this.deleteIssue} />
        <hr />
        <IssueAdd createIssue={this.createIssue} />
        <Toast
          showing={this.state.toastVisible} message={this.state.toastMessage}
          onDismiss={this.dismissToast} bsStyle={this.state.toastType}
        />
      </div>
    );
  }
}

IssueList.propTypes = {
  location: PropTypes.object.isRequired
  // router: React.PropTypes.object
};
