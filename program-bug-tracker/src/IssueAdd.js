import React, { Component } from "react";
import { Form, Button } from "react-bootstrap";

export default class IssueAdd extends Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(e) {
    e.preventDefault();
    var form = document.forms.issueAdd;
    this.props.createIssue({
      owner: form.owner.value,
      title: form.title.value,
      status: "New",
      created: new Date()
    });
    // clear the form for the next input
    form.owner.value = "";
    form.title.value = "";
  }
  render() {
    return (
      <div>
        <Form inline name="issueAdd" onSubmit={this.handleSubmit}>
          <Form.Control name="owner" placeholder="Owner" />
          &nbsp;
          <Form.Control name="title" placeholder="Title" />
          &nbsp;
          <Button type="submit" variant="primary">
            Add
          </Button>
        </Form>
      </div>
    );
  }
}
