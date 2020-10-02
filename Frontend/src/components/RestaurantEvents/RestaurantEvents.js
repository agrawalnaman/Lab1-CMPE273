import React, { Component } from "react";
import "../../App.css";
import axios from "axios";
import cookie from "react-cookies";
import { Redirect } from "react-router";
import Card from 'react-bootstrap/Card';
import CardColumns from 'react-bootstrap/CardColumns';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';


//Define a Login Component
class RestaurantEvents extends Component {
    //call the constructor method
    constructor(props) {
        //Call the constrictor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            events: "",
            addEventModal: false,
            eventAdded:"",
            name:"",
            description:"",
            time:"",
            date:"",
            location:"",
            hashtags:"",
        };
        this.addEventHandler = this.addEventHandler.bind(this);
        this.nameHandler = this.nameHandler.bind(this);
        this.descriptionHandler=this.descriptionHandler.bind(this);
        this.timeHandler=this.timeHandler.bind(this);
        this.dateHandler=this.dateHandler.bind(this);
        this.locationHandler=this.locationHandler.bind(this);
        this.hashtagsHandler=this.hashtagsHandler.bind(this);
        this.submitAddEvent = this.submitAddEvent.bind(this);
 
    }
    addEventHandler = (e) => {
        this.setState({
            addEventModal: true,

        });
    };

    nameHandler = (e) => {
        this.setState({
            name: e.target.value,

        });
    };
    
    descriptionHandler = (e) => {
        this.setState({
            description: e.target.value,

        });
    };    
    
    timeHandler = (e) => {
        this.setState({
            time: e.target.value,

        });
    };
    dateHandler = (e) => {
        this.setState({
            date: e.target.value,
        });
    };
    locationHandler = (e) => {
        this.setState({
            location: e.target.value,
        });
    };

    hashtagsHandler = (e) => {
        this.setState({
            hashtags: e.target.value,
        });
    };
    componentDidMount() {
        var data = { params: { idRestaurants: +localStorage.getItem("r_id") } };
        axios.get("http://localhost:3001/getRestaurantEvents", data).then((response) => {
            //update the state with the response data
            console.log(response.data);
            this.setState({
                events: response.data,
                addEventModal: false,
                eventAdded:"",
                name:"",
                description:"",
                time:"",
                date:"",
                location:"",
                hashtags:"",

            });
        });


    }




    submitAddEvent = (e) => {
        var headers = new Headers();
        //prevent page from refresh
        e.preventDefault();
        const data = {
            idRestaurants: +localStorage.getItem("r_id"),
            name:this.state.name,
            description:this.state.description,
            time:this.state.time,
            date:this.state.date,
            location:this.state.location,
            hashtags:this.state.hashtags,

        };
        //set the with credentials to true
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        // this.props.signup(data);
        axios
            .post("http://localhost:3001/restaurantAddNewEvent", data)
            .then((response) => {
                console.log("Status Code : ", response.status);
                if (response.status === 200) {
                    this.setState({
                        eventAdded: (
                            <h3>
                                New Event Added!
                            </h3>
                        ),
                    });

                } else {
                    this.setState({
                        eventAdded: (
                            <h3>
                                Unable to Add New Event!
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
        let redirectVar = null;
        let invalidCredentials = null;
        if (!cookie.load("cookie")) {
            redirectVar = <Redirect to="/login" />;
        }
        let addEvent = (
            <Modal show={this.state.addEventModal} onHide={() => this.setState({ addEventModal: false })}>
                <Modal.Header closeButton>
                    <Modal.Title>Add a new Event!</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form onSubmit={this.submitAddEvent} >
                        <Form.Group controlId="formName">
                            <Form.Label>Event Name</Form.Label>
                            <Form.Control type="text" placeholder="Name" onChange={this.nameHandler} />
                        </Form.Group>
                        <Form.Group controlId="Description">
                            <Form.Label>Description</Form.Label>
                            <Form.Control type="text" placeholder="Description" onChange={this.descriptionHandler} />
                        </Form.Group>
                        <Form.Group controlId="FormTime">
                            <Form.Label>Time</Form.Label>
                            <Form.Control type="text" placeholder="Time" onChange={this.timeHandler} />
                        </Form.Group>
                        <Form.Group controlId="formDate">
                            <Form.Label>Date</Form.Label>
                            <Form.Control type="text" placeholder="Date" onChange={this.dateHandler} />
                        </Form.Group>
                        <Form.Group controlId="formLocation">
                            <Form.Label>Location</Form.Label>
                            <Form.Control type="text" placeholder="Location" onChange={this.locationHandler} />
                        </Form.Group>
                        <Form.Group controlId="formHashTag">
                            <Form.Label>Hashtags</Form.Label>
                            <Form.Control type="text" placeholder="Hashtags" onChange={this.hashtagsHandler} />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Add
                        </Button>
                        {this.state.eventAdded}
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="primary" onClick={() => this.setState({ addEventModal: false })}>Close</Button>
                </Modal.Footer>
            </Modal>
        );

      
        const data = this.state.events;
        console.log("data:", data);
        return (
            <div>
                 {redirectVar}
                <button type="button" class="btn btn-light btn-block btn btn-outline-danger" onClick={this.addEventHandler}>Add Event</button>
                {addEvent}
                <CardColumns>
                    {data !== "" ? data.map((d) => {
                        return (

                            <Card style={{ width: '25rem' }} bg={'danger'}  className="mb-2" text={'white'}>
                                <Card.Header as="h5">Name : {d.Name}</Card.Header>
                                <Card.Body>
                                    <Card.Title>Event Id : {d.idEvents}</Card.Title>
                                    <Card.Text>
                                        Description : {d.Description}
                                    </Card.Text>
                                    <Card.Text>
                                        Location : {d.Location}
                                    </Card.Text>
                                    <Card.Text>
                                        Hashtags : {d.Hashtags}
                                    </Card.Text>
                                </Card.Body>
                                <Card.Footer>
                                        Time : {d.Time} , 
                                        Date : {d.Date} ,
                                </Card.Footer>
                            </Card>
                        )
                    }) : ""}
                </CardColumns>
              
            </div>
        );
    }
}

export default RestaurantEvents;