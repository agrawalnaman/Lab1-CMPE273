import React, { Component } from "react";
import "../../App.css";
import axios from "axios";
import cookie from "react-cookies";
import { Redirect } from "react-router";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
// import Button from 'react-bootstrap';
//Define a Login Component
class Signup extends Component {
  //call the constructor method
  constructor(props) {
    //Call the constrictor of Super class i.e The Component
    super(props);
    //maintain the state required for this component
    this.state = {
    //   username: "",
    //   password: "",
    //   authFlag: false,
    //   invalidCredentials: "",
         email:"",
         password:"",
         firstname:"",
         lastname:"",
         idCreated:""

    };
    //Bind the handlers to this class
    this.emailChangeHandler = this.emailChangeHandler.bind(this);
    this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
    this.firstnameChangeHandler = this.firstnameChangeHandler.bind(this);
    this.lastnameChangeHandler = this.lastnameChangeHandler.bind(this);
    this.submitSignup = this.submitSignup.bind(this);
  }
  //Call the Will Mount to set the auth Flag to false
//   componentWillMount() {
//     this.setState({
//       authFlag: false,
//     });
//   }
  //username change handler to update state variable with the text entered by the user
  emailChangeHandler = (e) => {
    this.setState({
      email: e.target.value,
    });
  };
  //password change handler to update state variable with the text entered by the user
  passwordChangeHandler = (e) => {
    this.setState({
      password: e.target.value,
    });
  };
  firstnameChangeHandler = (e) => {
    this.setState({
      firstname: e.target.value,
    });
  };
  lastnameChangeHandler = (e) => {
    this.setState({
      lastname: e.target.value,
    });
  };
  //submit Login handler to send a request to the node backend
  submitSignup = (e) => {
    var headers = new Headers();
    //prevent page from refresh
    e.preventDefault();
    const data = {
      email: this.state.email,
      password: this.state.password,
      firstName: this.state.firstname,
      lastName:this.state.lastname,
    };
    //set the with credentials to true
    axios.defaults.withCredentials = true;
    //make a post request with the user data
    axios
      .post("http://localhost:3001/customerSignUp", data)
      .then((response) => {
        console.log("Status Code : ", response.status);
        if (response.status === 200) {
            this.setState({
            idCreated:(
                <h3>
                    Account Created
                </h3>
            ),
            });
         
        } else {
          this.setState({
            idCreated: (
              <h3>
                Email Id already registered!
              </h3>
            ),
          });
        }
      })
      .catch((e) => {
        debugger;
        console.log("FAIL!!!");
      });
  };

  render() {
    //redirect based on successful login
    // let redirectVar = null;
    // let invalidCredentials = null;
    // if (cookie.load("cookie")) {
    //   redirectVar = <Redirect to="/home" />;
    // }

    return (
      <div>
        {/* {redirectVar} */}
        <div class="container">
          <div class="signup-form">
          {this.state.idCreated}
            <Form   onSubmit={this.submitSignup} >
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email"  onChange={this.emailChangeHandler} />
                    <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                    </Form.Text>
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" onChange={this.passwordChangeHandler} />
                </Form.Group>
                <Form.Group controlId="formBasicFirstName">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control type="text" placeholder="First Name" onChange={this.firstnameChangeHandler} />
                </Form.Group>
                <Form.Group controlId="formBasicLastName">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control type="text" placeholder="Last Name" onChange={this.lastnameChangeHandler} />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}
//export Login Component
export default Signup;
