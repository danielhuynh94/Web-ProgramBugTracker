import React from "react";
import { Form, ButtonToolbar, Button, Card, Col, Alert } from "react-bootstrap";
import { LinkContainer } from 'react-router-bootstrap';
import NumInput from "./NumInput.js";
import DateInput from "./DateInput.js";
import Toast from './Toast.js';

export default class IssueEdit extends React.Component {
  constructor() {
    super();
    this.state = {
      issue: {
        _id: "",
        title: "",
        status: "",
        owner: "",
        effort: null,
        completionDate: null,
        created: null
      },
      invalidFields: {},
      showingValidation: false,
      toastVisible: false, toastMessage: '', toastType: 'success',

    };
    this.dismissValidation = this.dismissValidation.bind(this);
    this.showValidation = this.showValidation.bind(this);
    this.showSuccess = this.showSuccess.bind(this);
    this.showError = this.showError.bind(this);
    this.dismissToast = this.dismissToast.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onValidityChange = this.onValidityChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  componentDidMount() {
    this.loadData();
  }
  onSubmit(event) {
    event.preventDefault();
    this.showValidation();
    if (Object.keys(this.state.invalidFields).length !== 0) {
      return;
    }
    fetch(`/api/issues/${this.props.match.params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(this.state.issue)
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
            this.setState({ issue: updatedIssue });
            this.showSuccess('Updated issue successfully.');
          });
        } else {
          response.json().then(error => {
            this.showError(`Failed to update issue: ${error.message}`);
          });
        }
      })
      .catch(err => {
        this.showError(`Error in sending data to server: ${err.message}`);
      });
  }
  onValidityChange(event, valid) {
    const invalidFields = Object.assign({}, this.state.invalidFields);
    if (!valid) {
      invalidFields[event.target.name] = true;
    } else {
      delete invalidFields[event.target.name];
    }
    this.setState({ invalidFields });
  }
  componentDidUpdate(prevProps) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.loadData();
    }
  }
  onChange(event, convertedValue) {
    const issue = Object.assign({}, this.state.issue);
    const value =
      convertedValue !== undefined ? convertedValue : event.target.value;
    issue[event.target.name] = value;
    this.setState({ issue });
  }
  loadData() {
    fetch(`/api/issues/${this.props.match.params.id}`).then(response => {
      if (response.ok) {
        response.json().then(issue => {
          issue.created = new Date(issue.created);
          issue.completionDate =
            issue.completionDate != null
              ? new Date(issue.completionDate)
              : null;
          issue.effort = issue.effort != null ? issue.effort : 0;
          this.setState({ issue });
        });
      } else {
        response.json().then(error => {
          alert(`Failed to fetch issue: ${error.message}`);
        });
      }
    });
  }
  showValidation() {
    this.setState({ showingValidation: true });
  }
  dismissValidation() {
    this.setState({ showingValidation: false });
  }
  showSuccess(message) {
    this.setState({ toastVisible: true, toastMessage: message, toastType: 'success' });
  }
  showError(message) {
    this.setState({ toastVisible: true, toastMessage: message, toastType: 'danger' });
  }
  dismissToast() {
    this.setState({ toastVisible: false });
  }
  render() {
    const issue = this.state.issue;
    let validationMessage = null;
    if (Object.keys(this.state.invalidFields).length !== 0 && this.state.showingValidation) {
      validationMessage = (
        <Alert variant="danger" onDismiss={this.dismissValidation}>Please correct invalid fields before submitting</Alert>
      );
    }
    return (
      <Card>
        <Card.Header>Edit Issue</Card.Header>
        <Card.Body>
          <Form onSubmit={this.onSubmit}>
            <Form.Group>
              <Col>
                <Form.Label>ID</Form.Label>
              </Col>
              <Col sm={9}>
                <Form.Label>{issue._id}</Form.Label>
              </Col>
            </Form.Group>
            <Form.Group>
              <Col>
                <Form.Label>Created</Form.Label>
              </Col>
              <Col>
                <Form.Label>
                  {issue.created ? issue.created.toDateString() : ""}
                </Form.Label>
              </Col>
            </Form.Group>
            <Form.Group>
              <Col>
                <Form.Label>Status</Form.Label>
              </Col>
              <Col>
                <Form.Control
                  as="select"
                  name="status"
                  value={issue.status}
                  onChange={this.onChange}
                >
                  <option value="New">New</option>
                  <option value="Open">Open</option>
                  <option value="Assigned">Assigned</option>
                  <option value="Fixed">Fixed</option>
                  <option value="Verified">Verified</option>
                  <option value="Closed">Closed</option>
                </Form.Control>
              </Col>
            </Form.Group>
            <Form.Group>
              <Col>
                <Form.Label>Owner</Form.Label>
              </Col>
              <Col>
                <Form.Control
                  name="owner"
                  value={issue.owner}
                  onChange={this.onChange}
                />
              </Col>
            </Form.Group>
            <Form.Group>
              <Col>
                <Form.Label>Effort</Form.Label>
              </Col>
              <Col>
                <NumInput
                  name="effort"
                  value={issue.effort ? issue.effort : 0}
                  onChange={this.onChange}
                />
              </Col>
            </Form.Group>
            <Form.Group>
              <Col>
                <Form.Label>Completion Date</Form.Label>
              </Col>
              <Col>
                <DateInput
                  name="completionDate"
                  value={issue.completionDate}
                  onChange={this.onChange}
                  onValidityChange={this.onValidityChange}
                />
                <Form.Control.Feedback />
              </Col>
            </Form.Group>
            <Form.Group>
              <Col><Form.Label>Title</Form.Label></Col>
              <Col>
                <Form.Control name="title" value={issue.title} onChange={this.onChange} />
              </Col>
            </Form.Group>
            <Form.Group>
              <Col>
                <ButtonToolbar>
                  <Button variant="primary" type="submit">Submit</Button>&nbsp;
                  <LinkContainer to="/issues">
                    <Button variant="link">Back</Button>
                  </LinkContainer>
                </ButtonToolbar>
              </Col>
            </Form.Group>
            <Form.Group>
              <Col sm={{ span: 9, offset: 3 }}>{validationMessage}</Col>
            </Form.Group>
          </Form>
          <Toast
            showing={this.state.toastVisible} message={this.state.toastMessage}
            onDismiss={this.dismissToast} variant={this.state.toastType}
          />
        </Card.Body>
      </Card>
    );
  }
}
