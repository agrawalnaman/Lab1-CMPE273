import React, { Component } from "react";
import "../../App.css";
import axios from "axios";
import cookie from "react-cookies";
import { Redirect } from "react-router";
class Create extends Component {
  //call the constructor method
  constructor(props) {
    //Call the constrictor of Super class i.e The Component
    super(props);
    //maintain the state required for this component
    this.state = {
      BookID: "",
      Title: "",
      Author: "",
      Added: "",
    };
    //Bind the handlers to this class
    this.BookIDChangeHandler = this.BookIDChangeHandler.bind(this);
    this.TitleChangeHandler = this.TitleChangeHandler.bind(this);
    this.AuthorChangeHandler = this.AuthorChangeHandler.bind(this);
    this.submitCreate = this.submitCreate.bind(this);
  }

  BookIDChangeHandler = (e) => {
    this.setState({
      BookID: e.target.value,
    });
  };

  TitleChangeHandler = (e) => {
    this.setState({
      Title: e.target.value,
    });
  };

  AuthorChangeHandler = (e) => {
    this.setState({
      Author: e.target.value,
    });
  };
  //submit Login handler to send a request to the node backend
  submitCreate = (e) => {
    var headers = new Headers();
    //prevent page from refresh
    e.preventDefault();
    const data = {
      BookID: this.state.BookID,
      Title: this.state.Title,
      Author: this.state.Author,
    };
    //set the with credentials to true
    axios.defaults.withCredentials = true;
    //make a post request with the user data
    axios.post("http://localhost:3001/create", data).then((response) => {
      console.log("Status Code : ", response.status);
      if (response.status === 200) {
        this.setState({
          Added: <Redirect to="/Home" />,
        });
      } else {
        this.setState({
          Added: <h1>This BookID Already Exists!</h1>,
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
      <div>
        {redirectVar}
        {this.state.Added}
        <br />
        <div class="container">
          <form action="http://127.0.0.1:3000/create" method="post">
            <div style={{ width: "30%" }} class="form-group">
              <input
                onChange={this.BookIDChangeHandler}
                type="number"
                class="form-control"
                name="BookID"
                placeholder="Book ID"
                required
              />
            </div>
            <br />
            <div style={{ width: "30%" }} class="form-group">
              <input
                onChange={this.TitleChangeHandler}
                type="text"
                class="form-control"
                name="Title"
                placeholder="Book Title"
                required
              />
            </div>
            <br />
            <div style={{ width: "30%" }} class="form-group">
              <input
                onChange={this.AuthorChangeHandler}
                type="text"
                class="form-control"
                name="Author"
                placeholder="Book Author"
                required
              />
            </div>
            <br />
            <div style={{ width: "30%" }}>
              <button
                onClick={this.submitCreate}
                class="btn btn-success"
                type="submit"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
export default Create;
