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
class RestaurantOrders extends Component {
    //call the constructor method
    constructor(props) {
        //Call the constrictor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            dishes: "",
            addDishModal: false,
            editDishModal: false,
            dishName:"",
            price:"",
            ingredients:"",
            category:"",
            imageURL:"",
            dishAdded:"",
        };
        this.addDishHandler = this.addDishHandler.bind(this);
        this.editDishHandler = this.editDishHandler.bind(this);
        this.dishNameChangeHandler = this.dishNameChangeHandler.bind(this);
        this.priceChangeHandler = this.priceChangeHandler.bind(this);
        this.categoryChangeHandler = this.categoryChangeHandler.bind(this);
        this.ingredientsChangeHandler = this.ingredientsChangeHandler.bind(this);
        this.imageUrlChangeHandler = this.imageUrlChangeHandler.bind(this);
        this.submitAddDish=this.submitAddDish.bind(this);
    }
    addDishHandler = (e) => {
        this.setState({
            addDishModal: true,
        });
    };
    editDishHandler = (e) => {
        this.setState({
            editDishModal: true,
        });
    };
    dishNameChangeHandler = (e) => {
        this.setState({
            dishName:  e.target.value,
        });
    };
    priceChangeHandler = (e) => {
        this.setState({
            price:  e.target.value,
        });
    };
    categoryChangeHandler = (e) => {
        this.setState({
            category:  e.target.value,
        });
    };
    ingredientsChangeHandler = (e) => {
        this.setState({
            ingredients:  e.target.value,
        });
    };
    imageUrlChangeHandler = (e) => {
        this.setState({
            imageURL:  e.target.value,
        });
    };
    componentDidMount() {
        var data = { params: { idRestaurants: +localStorage.getItem("r_id") } };
        axios.get("http://localhost:3001/getRestaurantOrders", data).then((response) => {
            //update the state with the response data
            console.log(response.data);
            this.setState({
                dishes: response.data,
                addDishModal: false,
                editDishModal: false,
                dishName:"",
                price:"",
                ingredients:"",
                category:"",
                dishAdded:"",
            });
        });


    }

    submitAddDish = (e) => {
        var headers = new Headers();
        //prevent page from refresh
        e.preventDefault();
        const data = {
          idRestaurants:+localStorage.getItem("r_id"),
          dishName:this.state.dishName,
          price:this.state.price,
          ingredients:this.state.ingredients,
          category:this.state.category,
          imageURL:this.state.imageURL,
     
        };
        //set the with credentials to true
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        // this.props.signup(data);
        axios
          .post("http://localhost:3001/restaurantAddNewDish", data)
          .then((response) => {
            console.log("Status Code : ", response.status);
            if (response.status === 200) {
                this.setState({
                dishAdded:(
                    <h3>
                        New Dish Added!
                    </h3>
                ),
                });
             
            } else {
              this.setState({
                dishAdded: (
                  <h3>
                   Unable to Add New Dish!
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
        let addDish = (
            <Modal show={this.state.addDishModal} onHide={() => this.setState({ addDishModal: false })}>
                <Modal.Header closeButton>
                    <Modal.Title>Add a new Dish!</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form onSubmit={this.submitAddDish} >
                        <Form.Group controlId="formDishName">
                            <Form.Label>Dish Name</Form.Label>
                            <Form.Control type="text" placeholder="Name" onChange={this.dishNameChangeHandler} />
                        </Form.Group>
                        <Form.Group controlId="Price">
                            <Form.Label>Price</Form.Label>
                            <Form.Control type="text" placeholder="Price" onChange={this.priceChangeHandler}/>
                        </Form.Group>
                        <Form.Group controlId="exampleForm.ControlSelect1">
                            <Form.Label>Category</Form.Label>
                            <Form.Control as="select" onChange ={this.categoryChangeHandler}>
                                <option value="Main Course">Main Course</option>
                                <option  value="Appetizer">Appetizer</option>
                                <option  value="Salads">Salads</option>
                                <option  value="Desserts">Desserts</option>
                                <option  value="Beverages">Beverages</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="formIngredients">
                            <Form.Label>Ingredients</Form.Label>
                            <Form.Control type="text" placeholder="Ingredients" onChange={this.ingredientsChangeHandler} />
                        </Form.Group>
                        <Form.Group controlId="formImageURL">
                            <Form.Label>Image URL</Form.Label>
                            <Form.Control type="text" placeholder="Image URL" onChange={this.imageUrlChangeHandler} />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Add
                        </Button>
                        {this.state.dishAdded}
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="primary" onClick={() => this.setState({ addDishModal: false })}>Close</Button>
                </Modal.Footer>
            </Modal>
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
                    <Button variant="primary" onClick={() => this.setState({ editDishModal: false })}>Save changes</Button>
                </Modal.Footer>
            </Modal.Dialog>
        );
        const data = this.state.dishes;
        console.log("data:", data);
        return (
            <div>
                <button type="button" class="btn btn-light btn-block btn btn-outline-danger" onClick={this.addDishHandler}>Add Dish</button>
                {addDish}

                <CardColumns>
                    {data !== "" ? data.map((d) => {
                        return (

                            <Card>
                                <Card.Header as="h5"> Category : {d.deliveryMode}</Card.Header>
                                <Card.Body>
                                    <Card.Title>  Order ID : {d.idOrders}</Card.Title>
                                    <Card.Text>
                                        Time : {d.time}
                                    </Card.Text>
                                    <Card.Text>
                                    Customer ID :{d.customerID}
                                    </Card.Text>
                                </Card.Body>
                                <Card.Footer>
                                
                                <large className="text-muted">Order Status : {d.orderStatus}</large>
                                    <Button variant="primary" onClick={this.editDishHandler}>Edit</Button>
                                    {this.state.editDishModal === true ? editDish : ""}
                                </Card.Footer>
                            </Card>
                        )
                    }) : ""}
                </CardColumns>
            </div>
        );
    }
}

export default RestaurantOrders;