import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import Login from './Login/Login';
import Home from './Home/Home';
import NavbarComponent from './LandingPage/NavbarComponent';
import Signup from './Signup/Signup';
import RestaurantMain from './RestaurantMain/RestaurantMain';

//Create a Main Component
class Main extends Component {
    render(){
        return(
            <div>
                {/*Render Different Component based on Route*/}
                <Route path="/" component={NavbarComponent}/>
                <Route path="/login" component={Login}/>
                <Route path="/home" component={Home}/>
                <Route path="/signup" component={Signup}/>
                <Route path="/RestaurantMain" component={RestaurantMain}/>
            </div>
        )
    }
}
//Export The Main Component
export default Main;