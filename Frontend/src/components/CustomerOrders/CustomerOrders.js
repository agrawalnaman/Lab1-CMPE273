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
class CustomerOrders extends Component {
    //call the constructor method
    constructor(props) {
        //Call the constrictor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            orders: "",
            orderStatusModal: false,
            idOrders:"",
            orderStatusEdited:"",
            deliveryMode:"",
            status:"",


        };
        this.editOrderStatusHandler = this.editOrderStatusHandler.bind(this);
        this.statusChangeHandler = this.statusChangeHandler.bind(this);
        this.submitStatus= this.submitStatus.bind(this);
    }

    editOrderStatusHandler = (d) => {
        this.setState({
            orderStatusModal: true,
            idOrders:d.idOrders,
            status:d.orderStatus,
            deliveryMode:d.deliveryMode,
        });
    };


    statusChangeHandler = (e) => {
        this.setState({
            status: e.target.value,
        });
    };
  
    componentDidMount() {
        var data = { params: { idCustomers: +localStorage.getItem("c_id") } };
        axios.get("http://localhost:3001/getCustomerOrders", data).then((response) => {
            //update the state with the response data
            console.log(response.data);
            this.setState({
                orders: response.data,
                orderStatusModal: false,
                orderStatusEdited:"",
                deliveryMode:"",
                status:"",
            });
        });


    }


    submitStatus = (e) => {
        var headers = new Headers();
        //prevent page from refresh
        e.preventDefault();
        const data = {
           orderstatus:this.state.status,
           idOrders:this.state.idOrders,
        };
        //set the with credentials to true
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        // this.props.signup(data);
        axios
            .post("http://localhost:3001/updateOrderStatus", data)
            .then((response) => {
                console.log("Status Code : ", response.status);
                if (response.status === 200) {
                    this.setState({
                        orderStatusEdited: (
                            <h3>
                             Status Updated
                            </h3>
                        ),
                    });

                } else {
                    this.setState({
                        orderStatusEdited: (
                            <h3>
                                Unable to update Status!
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
        let orderStatus = (
            <Modal show={this.state.orderStatusModal} onHide={() => this.setState({ orderStatusModal: false })}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Dish!</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form onSubmit={this.submitStatus} >
                        <Form.Group controlId="exampleForm.ControlSelect1">
                            <Form.Label>Category</Form.Label>
   {this.state.deliveryMode==="delivery"?( <Form.Control as="select" onChange={this.statusChangeHandler}  defaultValue={this.state.status}>
                                <option value="orderrecieved">Order Recieved</option>
                                <option value="preparing">Preparing</option>
                                <option value="ontheway">On The Way</option>
                                <option value="delivered">Delivered</option>
                            </Form.Control>):( <Form.Control as="select" onChange={this.statusChangeHandler}  defaultValue={this.state.status}>
                                <option value="orderrecieved">Order Recieved</option>
                                <option value="preparing">Preparing</option>
                                <option value="pickupready">Pick Up Ready</option>
                                <option value="pickedup">Picked Up</option>
                            </Form.Control>)}
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Update
                    </Button>
                        {this.state.orderStatusEdited}
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="primary" onClick={() => this.setState({ orderStatusModal: false })}>Close</Button>
                </Modal.Footer>
            </Modal>
        );
        const data = this.state.orders;
        console.log("data:", data);
        return (
            <div>
                 {redirectVar}
                {orderStatus}
                <CardColumns>
                    {data !== "" ? data.map((d) => {
                        return (

                            <Card  style={{ width: '25rem' }}>
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
                            <Button variant="primary" onClick={() => this.editOrderStatusHandler(d)}>Update Status</Button>
                            </Card.Footer>
                        </Card>
                        )
                    }) : ""}
                </CardColumns>
              
            </div>
        );
    }
}

export default CustomerOrders;