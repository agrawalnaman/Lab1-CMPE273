import React, { Component } from "react";
import "../../App.css";
import axios from "axios";
import cookie from "react-cookies";
import { Redirect } from "react-router";
import Card from 'react-bootstrap/Card';
import CardColumns from 'react-bootstrap/CardColumns';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

//Define a Login Component
class Dishes extends Component {
    //call the constructor method
    constructor(props) {
        //Call the constrictor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            dishes: "",
            addDishModal: "false",
            editDishModal: "false",
        };
        this.addDishHandler = this.addDishHandler.bind(this);
        this.editDishHandler = this.editDishHandler.bind(this);
    }
    addDishHandler = (e) => {
        this.setState({
            addDishModal: "true",
        });
    };
    editDishHandler = (e) => {
        this.setState({
            editDishModal: "true",
        });
    };
    componentDidMount() {
        var data = { params: { idRestaurants: +localStorage.getItem("r_id") } };
        axios.get("http://localhost:3001/getRestaurantDishes", data).then((response) => {
            //update the state with the response data
            console.log(response.data);
            this.setState({
                dishes: response.data,
                addDishModal: "false",
                editDishModal: "false",
            });
        });


    }

    render() {
        let addDish = (
            <Modal.Dialog>
                <Modal.Header closeButton>
                    <Modal.Title>Modal title</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p>Modal body text goes here.</p>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary">Close</Button>
                    <Button variant="primary" onClick={() => this.setState({ addDishModal: "false" })}>Save changes</Button>
                </Modal.Footer>
            </Modal.Dialog>
        );

        let editDish = (
            <Modal.Dialog>
                <Modal.Header closeButton>
                    <Modal.Title>Modal title</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p>Modal body text goes here.</p>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary">Close</Button>
                    <Button variant="primary" onClick={() => this.setState({ editDishModal: "false" })}>Save changes</Button>
                </Modal.Footer>
            </Modal.Dialog>
        );
        const data = this.state.dishes;
        console.log("data:", data);
        return (
            <div>
                <button type="button" class="btn btn-light btn-block btn btn-outline-danger" onClick={this.addDishHandler}>Add Dish</button>
                {this.state.addDishModal === "true" ? addDish : ""}
                  {this.state.editDishModal === "true" ? editDish : ""}
                <CardColumns>
                    {data !== "" ? data.map( (d)=> {
                        return (

                            <Card>
                                <Card.Header as="h5"> Category : {d.Category}</Card.Header>
                                <Card.Img variant="top" src={d.Image} />
                                <Card.Body>
                                    <Card.Title>{d.Name}</Card.Title>
                                    <Card.Text>
                                        Price : ${d.Price}
                                    </Card.Text>
                                    <Card.Text>
                                        Ingredients : {d.Ingredients}
                                    </Card.Text>
                                </Card.Body>
                                <Card.Footer>
                                    <Button variant="primary" onClick={this.editDishHandler}>Edit</Button>
                                </Card.Footer>
                            </Card>
                        )
                    }) : ""}
                </CardColumns>
            </div>
        );
    }
}

export default Dishes;