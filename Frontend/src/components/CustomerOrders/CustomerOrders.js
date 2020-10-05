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
        this.statusChangeHandler = this.statusChangeHandler.bind(this);
    }


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




    render() {
        let redirectVar = null;
        let invalidCredentials = null;
        if (!cookie.load("cookie")) {
            redirectVar = <Redirect to="/login" />;
        }
        const data = this.state.orders;
        console.log("data:", data);
        return (
            <div>
                 {redirectVar}

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
                                Restaurant ID :{d.restaurantID}
                                </Card.Text>
                            </Card.Body>
                            <Card.Footer>
                            
                            <large className="text-muted">Order Status : {d.orderStatus}</large>
        
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