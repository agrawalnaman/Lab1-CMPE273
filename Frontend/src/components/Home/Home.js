import React, { Component } from "react";
import "../../App.css";
import axios from "axios";
import cookie from "react-cookies";
import { Redirect } from "react-router";
import { connect } from "react-redux";
//import store from "../../redux/store";
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      "FirstName": "",
      "LastName": "",
      "Email": "",
    };
    
  }

  //get the books data from backend
  componentDidMount() {
    console.log("PROPS : " , this.props);
    var data = {params:{idCustomers:+localStorage.getItem("c_id")}};
    axios.get("http://localhost:3001/customerProfile",data).then((response) => {
      //update the state with the response data
      console.log(response);
      this.setState({
        "FirstName": response.data[0].FirstName,
        "LastName": response.data[0].LastName,
        "Email": response.data[0].Email,
        "Country": response.data[0].Country,
      })
      
    });
  }

  render() {
    //if not logged in go to login page
    let redirectVar = null;
    if (!cookie.load("cookie")) {
      redirectVar = <Redirect to="/login" />;
    }
    return (
      <div>
        {redirectVar}
        <div class="container">
        <h3><label >Email ID : {this.state.Email}</label></h3>
        <h3><label >First Name : {this.state.FirstName}</label></h3>
        <h3><label >LastName : {this.state.LastName}</label></h3>
        <h3><label >Country : {this.state.Country}</label></h3>
         </div>
      </div>
    );
  }
}
//export Home Component
// const mapDispatchToProps = {setUsername,setAuthFlag,setCustomerID};
const mapStateToProps = state => {
  return {
    loginState: state.loginState,
  }
};
//export Login Component
export default connect(mapStateToProps,null)(Home);
