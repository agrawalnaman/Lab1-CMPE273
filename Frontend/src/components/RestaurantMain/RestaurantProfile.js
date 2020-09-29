import React, { Component } from "react";
import "../../App.css";
import axios from "axios";
import cookie from "react-cookies";
import { Redirect } from "react-router";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

//Define a Login Component
class RestaurantProfile extends Component {
    //call the constructor method
    constructor(props) {
        //Call the constrictor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            email:"",
            name:"",
            password:"",
            location:"",
            description:"",
            contact:"",
            timings:"",
            reviews:"",

        };
    }

    componentDidMount() {
        var data = { params: { idRestaurants: +localStorage.getItem("r_id") } };
        axios.get("http://localhost:3001/restaurantProfile", data).then((response) => {
            //update the state with the response data
            console.log(response.data[0]);
            this.setState({
                profileUpdated:"",
                email:response.data[0].Email,
                name: response.data[0].Name,
                password:response.data[0].Password,
                location:response.data[0].Location,
                description:response.data[0].Description,
                contact:response.data[0].Contact,
                timings:response.data[0].Timings,
            });
        });
    }
    emailChangeHandler = (e) => {
        this.setState({
          email : e.target.value,
        });
    };
    nameChangeHandler = (e) => {
        this.setState({
          name : e.target.value,
        });
    };
    locationChangeHandler = (e) => {
        this.setState({
          location : e.target.value,
        });
    };
    descriptionChangeHandler = (e) => {
        this.setState({
          description : e.target.value,
        });
    };
    timingsChangeHandler = (e) => {
        this.setState({
          timings : e.target.value,
        });
    };
    contactChangeHandler = (e) => {
        this.setState({
          contact : e.target.value,
        });
    };
    passwordChangeHandler = (e) => {
        this.setState({
          password : e.target.value,
        });
    };

    submitUpdateProfile = (e) => {
        var headers = new Headers();
        //prevent page from refresh
        e.preventDefault();
        const data = {
          idRestaurants:+localStorage.getItem("r_id"),
          email: this.state.email,
          location: this.state.location,
          name: this.state.name,
          password:this.state.password,
          description:this.state.description,
          timings:this.state.timings,
          contact:this.state.contact,
     
        };
        //set the with credentials to true
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        // this.props.signup(data);
        axios
          .post("http://localhost:3001/updateRestaurantProfile", data)
          .then((response) => {
            console.log("Status Code : ", response.status);
            if (response.status === 200) {
                this.setState({
                profileUpdated:(
                    <h3>
                        Profile Updated
                    </h3>
                ),
                });
             
            } else {
              this.setState({
                profileUpdated: (
                  <h3>
                    Email already exists! use your own ID please!
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


        return (
            <Form onSubmit={this.submitUpdateProfile} >
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Email" onChange={this.emailChangeHandler} defaultValue={this.state.email} />
                </Form.Group>
                <Form.Group controlId="formPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="text" placeholder="Password" onChange={this.passwordChangeHandler} defaultValue={this.state.password} />
                </Form.Group>
                <Form.Group controlId="formBasicName">
                    <Form.Label>Restaurant Name</Form.Label>
                    <Form.Control type="text" placeholder="Name" onChange={this.nameChangeHandler} defaultValue={this.state.name} />
                </Form.Group>
                <Form.Group controlId="formLocation">
                    <Form.Label>Location</Form.Label>
                    <Form.Control type="text" placeholder="Location" onChange={this.locationChangeHandler} defaultValue={this.state.location} />
                </Form.Group>
                <Form.Group controlId="formDescription">
                    <Form.Label>Description</Form.Label>
                    <Form.Control type="text" placeholder="Description" onChange={this.countryChangeHandler} defaultValue={this.state.description} />
                </Form.Group>
                <Form.Group controlId="formDescription">
                    <Form.Label>Timings</Form.Label>
                    <Form.Control type="text" placeholder="Timings" onChange={this.timingsChangeHandler} defaultValue={this.state.timings} />
                </Form.Group>
                <Form.Group controlId="formContact">
                    <Form.Label>Contact</Form.Label>
                    <Form.Control type="text" placeholder="Contact" onChange={this.contactChangeHandler} defaultValue={this.state.contact} />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Update
            </Button>
            {this.state.profileUpdated}
            </Form>
        );

    }
}

export default RestaurantProfile;