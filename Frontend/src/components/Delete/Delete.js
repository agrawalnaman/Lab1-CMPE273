import React, { Component } from "react";
import "../../App.css";
import axios from "axios";
import cookie from "react-cookies";
import { Redirect } from "react-router";
class Delete extends Component {
  //call the constructor method
  constructor(props) {
    //Call the constrictor of Super class i.e The Component
    super(props);
    //maintain the state required for this component
    this.state = {
      BookID: "",
      Deleted: "",
    };
    //Bind the handlers to this class
    this.BookIDChangeHandler = this.BookIDChangeHandler.bind(this);
    this.submitDelete = this.submitDelete.bind(this);
  }

  BookIDChangeHandler = (e) => {
    this.setState({
      BookID: e.target.value,
    });
  };

  //submit Login handler to send a request to the node backend
  submitDelete = (e) => {
    var headers = new Headers();
    //prevent page from refresh
    e.preventDefault();
    const data = {
      BookID: this.state.BookID,
    };
    //set the with credentials to true
    axios.defaults.withCredentials = true;
    //make a post request with the user data
    axios.post("http://localhost:3001/delete", data).then((response) => {
      console.log("Status Code : ", response.status);
      if (response.status === 200) {
        this.setState({
          Deleted: <Redirect to="/Home" />,
        });
      } else {
        this.setState({
          Deleted: <h1>This BookID Does not Exists!</h1>,
        });
      }
    });
  };

  render() {
    let redirectVar = null;
    if (!cookie.load("cookie")) {
      redirectVar = <Redirect to="/login" />;
    }
    return (
      <div class="container">
        {redirectVar}
        {this.state.Deleted}
        <form>
          <div style={{ width: "50%", float: "left" }} class="form-group">
            <input
              onChange={this.BookIDChangeHandler}
              type="number"
              class="form-control"
              name="BookID"
              placeholder="Search a Book by Book ID"
              required
            />
          </div>
          <div style={{ width: "50%", float: "right" }}>
            <button
              onClick={this.submitDelete}
              class="btn btn-success"
              type="submit"
            >
              Delete
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default Delete;
