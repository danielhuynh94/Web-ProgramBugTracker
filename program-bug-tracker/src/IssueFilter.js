import React, { Component } from "react";
import PropTypes from "prop-types";
import querystring from "querystring";
import {
  Form,
  Row,
  Col,
  InputGroup,
  ButtonToolbar,
  Button
} from "react-bootstrap";

export default class IssueFilter extends Component {
  constructor(props) {
    super(props);
    let initFilter = this.getInitFilterObject(props);
    this.state = {
      status: initFilter.status,
      effort_gte: initFilter.effort_gte,
      effort_lte: initFilter.effort_lte,
      changed: false
    };
    this.onChangeStatus = this.onChangeStatus.bind(this);
    this.onChangeEffortGte = this.onChangeEffortGte.bind(this);
    this.onChangeEffortLte = this.onChangeEffortLte.bind(this);
    this.applyFilter = this.applyFilter.bind(this);
    this.resetFilter = this.resetFilter.bind(this);
    this.clearFilter = this.clearFilter.bind(this);
  }
  componentWillReceiveProps(newProps) {
    let initFilter = this.getInitFilterObject(newProps);
    this.setState({
      status: initFilter.status,
      effort_gte: initFilter.effort_gte,
      effort_lte: initFilter.effort_lte,
      changed: false
    });
  }
  resetFilter() {
    let initFilter = this.getInitFilterObject(this.props);
    this.setState({
      status: initFilter.status,
      effort_gte: initFilter.effort_gte,
      effort_lte: initFilter.effort_lte,
      changed: false
    });
  }
  getInitFilterObject(props) {
    let initFilter = {};
    if (props.queryString) {
      initFilter = querystring.parse(props.queryString.substring(1));
    }
    initFilter = {
      status: initFilter && initFilter.status ? initFilter.status : "",
      effort_gte:
        initFilter && initFilter.effort_gte ? initFilter.effort_gte : "",
      effort_lte:
        initFilter && initFilter.effort_lte ? initFilter.effort_lte : ""
    };
    return initFilter;
  }
  onChangeStatus(e) {
    this.setState({ status: e.target.value, changed: true });
  }
  onChangeEffortGte(e) {
    const effortString = e.target.value;
    if (effortString.match(/^\d*$/)) {
      this.setState({ effort_gte: e.target.value, changed: true });
    }
  }
  onChangeEffortLte(e) {
    const effortString = e.target.value;
    if (effortString.match(/^\d*$/)) {
      this.setState({ effort_lte: e.target.value, changed: true });
    }
  }
  applyFilter() {
    const newFilter = {};
    if (this.state.status) newFilter.status = this.state.status;
    if (this.state.effort_gte) newFilter.effort_gte = this.state.effort_gte;
    if (this.state.effort_lte) newFilter.effort_lte = this.state.effort_lte;
    this.props.setFilter(newFilter);
  }
  clearFilter() {
    this.props.setFilter({});
  }
  render() {
    return (
      <Form>
        <Row>
          <Col>
            <Form.Group>
              <Form.Label>Status</Form.Label>
              <Form.Control as="select" onChange={this.onChangeStatus}>
                <option value="">(Any)</option>
                <option value="New">New</option>
                <option value="Open">Open</option>
                <option value="Assigned">Assigned</option>
                <option value="Fixed">Fixed</option>
                <option value="Verified">Verified</option>
                <option value="Closed">Closed</option>
              </Form.Control>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>Effort</Form.Label>
              <InputGroup>
                <Form.Control
                  value={this.state.effort_gte}
                  onChange={this.onChangeEffortGte}
                />
                <InputGroup.Text>-</InputGroup.Text>
                <Form.Control
                  value={this.state.effort_lte}
                  onChange={this.onChangeEffortLte}
                />
              </InputGroup>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>&nbsp;</Form.Label>
              <ButtonToolbar>
                <Button
                  className="mr-2"
                  variant="primary"
                  onClick={this.applyFilter}
                >
                  Apply
                </Button>
                <Button
                  className="mr-2"
                  variant="secondary"
                  onClick={this.resetFilter}
                  disabled={!this.state.changed}
                >
                  Reset
                </Button>
                <Button
                  className="mr-2"
                  variant="secondary"
                  onClick={this.clearFilter}
                >
                  Clear
                </Button>
              </ButtonToolbar>
            </Form.Group>
          </Col>
        </Row>
      </Form>
    );
  }
}

IssueFilter.propTypes = {
  setFilter: PropTypes.func.isRequired,
  queryString: PropTypes.string.isRequired
};
