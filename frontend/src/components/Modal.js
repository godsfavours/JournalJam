import React, { Component } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Input,
  Label,
} from "reactstrap";

export default class CustomModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: this.props.activeItem,
    };
  }

  handleChange = (e) => {
    let { name, value } = e.target;

    if (e.target.type === "checkbox") {
      value = e.target.checked;
    }

    const activeItem = { ...this.state.activeItem, [name]: value };

    this.setState({ activeItem });
  };

  render() {
    const { toggle, onSave } = this.props;

    return (
      <Modal isOpen={true} toggle={toggle}>
        <ModalHeader toggle={toggle}>Todo Item</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="journal-title">Title</Label>
              <Input
                type="text"
                id="journal-title"
                name="title"
                value={this.state.activeItem.title}
                onChange={this.handleChange}
                placeholder="Enter Journal Title"
              />
            </FormGroup>
            <FormGroup>
              <Label for="journal-subject">Subject</Label>
              <Input
                type="text"
                id="journal-subject"
                name="subject"
                value={this.state.activeItem.subject}
                onChange={this.handleChange}
                placeholder="Enter Journal Subject"
              />
            </FormGroup>
            <FormGroup>
              <Label for="journal-description">Description</Label>
              <Input
                type="text"
                id="journal-description"
                name="description"
                value={this.state.activeItem.description}
                onChange={this.handleChange}
                placeholder="Enter Journal description"
              />
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input
                  type="checkbox"
                  name="completed"
                  checked={this.state.activeItem.completed}
                  onChange={this.handleChange}
                />
                Completed
              </Label>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button
            color="success"
            onClick={() => onSave(this.state.activeItem)}
          >
            Save
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}