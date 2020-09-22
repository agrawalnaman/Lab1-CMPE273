//import the require dependencies
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var session = require("express-session");
var cookieParser = require("cookie-parser");
var cors = require("cors");
app.set("view engine", "ejs");

//connect to MySQL
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "Yelp"
});

//use cors to allow cross origin resource sharing
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

//use express session to maintain session data
app.use(
  session({
    secret: "cmpe273_kafka_passport_mongo",
    resave: false, // Forces the session to be saved back to the session store, even if the session was never modified during the request
    saveUninitialized: false, // Force to save uninitialized session to db. A session is uninitialized when it is new but not modified.
    duration: 60 * 60 * 1000, // Overall duration of Session : 30 minutes : 1800 seconds
    activeDuration: 5 * 60 * 1000,
  })
);

// app.use(bodyParser.urlencoded({
//     extended: true
//   }));
app.use(bodyParser.json());

//Allow Access Control
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,HEAD,OPTIONS,POST,PUT,DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  res.setHeader("Cache-Control", "no-cache");
  next();
});


//Route to handle Post Request Call for Customer Login
app.post("/customerLogin", function (req, res) {
  console.log("Inside Login Post Request");
  console.log("Req Body : ", req.body);
  var email = req.body.email;
  var sql = "SELECT * FROM Customers WHERE Email = ?";
  con.query(sql,[email], function (err, result) {
      if (err){
      console.log('SQL Error:',err);
      res.writeHead(205, {
        "Content-Type": "text/plain",
      });
      res.end("Unsuccessful Login");
      }
      else{

        if(result[0]!=null && result[0].Password===req.body.password){
          console.log("login successfull!");
          res.cookie("cookie", "admin", {
                    maxAge: 900000,
                    httpOnly: false,
                    path: "/",
                  });
          // localStorage.setItem('persona','customer');
          // localStorage.setItem('email',email);
          res.writeHead(200, {
          "Content-Type": "text/plain",});
          res.end("Successful Login");
        }
        else{
          console.log('SQL Error:',err);
          res.writeHead(205, {
            "Content-Type": "text/plain",
          });
          res.end("Unsuccessful Login");
        }
      }
    });
  });

//Route to handle Post Request Call for Restaurant Login

  app.post("/restaurantLogin", function (req, res) {
    console.log("Inside Restaurant Login Post Request");
    console.log("Req Body : ", req.body);
    var email = req.body.email;
    var sql = "SELECT * FROM Restaurants WHERE Email = ?";
    con.query(sql,[email], function (err, result) {
        if (err){
        console.log('SQL Error:',err);
        res.writeHead(205, {
          "Content-Type": "text/plain",
        });
        res.end("Unsuccessful Login");
        }
        else{
  
          if(result[0]!=null && result[0].Password===req.body.password){
            console.log("login successfull!");
            res.cookie("cookie", "restaurant-admin", {
                      maxAge: 900000,
                      httpOnly: false,
                      path: "/",
                    });
            // localStorage.setItem('persona','restaurant');
            // localStorage.setItem('email',email);
            res.writeHead(200, {
            "Content-Type": "text/plain",});
            res.end("Successful Login");
          }
          else{
            console.log('SQL Error:',err);
            res.writeHead(205, {
              "Content-Type": "text/plain",
            });
            res.end("Unsuccessful Login");
          }
        }
      });
    });

//Route to handle Post Request Call for Customer SignUp
  app.post("/customerSignUp", function (req, res) {
    console.log("Inside SignUp Request");
    console.log("Req Body : ", req.body);
    var email = req.body.email;
    var password = req.body.password;
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var sql_findEmail = "SELECT * FROM Customers WHERE Email = ?";
    var sql_insert = "INSERT INTO Customers (Email,FirstName,LastName,Password) VALUES (?,?,?,?)";

    con.query(sql_findEmail,[email], function (err, result) {
      if (err){
        console.log('SQL Error:',err);
        res.writeHead(205, {
          "Content-Type": "text/plain",
        });
        res.end("SignUp failed");
        }
        else{
          if(result[0]==null)
          {
            con.query(sql_insert,[email,firstName,lastName,password], function (err, result) {
              if (err){
              console.log('SQL Error:',err);
              res.writeHead(205, {
                "Content-Type": "text/plain",
              });
              res.end("SignUp failed");
              }
              else{
                  console.log("Sigunp successfull!");
                  res.writeHead(200, {
                  "Content-Type": "text/plain",});
                  res.end("SignUP Login");
          } 
        });
      }
      else{
        console.log('SQL Error:',err);
        res.writeHead(205, {
          "Content-Type": "text/plain",
        });
        res.end("Email already Exists");
      }
    }
  });
});

//Route to handle Post Request Call for Restaurant SignUp
app.post("/restaurantSignUp", function (req, res) {
  console.log("Inside SignUp Request");
  console.log("Req Body : ", req.body);
  var email = req.body.email;
  var password = req.body.password;
  var Name = req.body.name;
  var location = req.body.location;
  var sql_findEmail = "SELECT * FROM Restaurants WHERE Email = ?";
  var sql_insert = "INSERT INTO Restaurants (Email,Name,Password,Location) VALUES (?,?,?,?)";

  con.query(sql_findEmail,[email], function (err, result) {
    if (err){
      console.log('SQL Error:',err);
      res.writeHead(205, {
        "Content-Type": "text/plain",
      });
      res.end("SignUp failed SQL ERROR");
      }
      else{
        if(result[0]==null)
        {
          con.query(sql_insert,[email,Name,password,location], function (err, result) {
            if (err){
            console.log('SQL Error:',err);
            res.writeHead(205, {
              "Content-Type": "text/plain",
            });
            res.end("SignUp failed");
            }
            else{
                console.log("Sigunp successfull!");
                res.writeHead(200, {
                "Content-Type": "text/plain",});
                res.end("SignUp Successful");
        } 
      });
    }
    else{
      console.log('SQL Error:',err);
      res.writeHead(205, {
        "Content-Type": "text/plain",
      });
      res.end("Email already Exists");
    }
  }
});
});






  // con.query("asdasd").then((result) => {

  // }).catch()

  // const results = await con.query("asdasdasd");
  

//Route to get restaurant Profile
app.get("/restaurantProfile", function (req, res) {
  console.log("Inside Restaurant Dashboard");
  var idRestaurants = req.body.idRestaurants;
  console.log(idRestaurants);
  var sql = "SELECT * FROM Restaurants WHERE idRestaurants = ?";
  con.query(sql,[idRestaurants], function (err, result) {
      if (err){
      console.log('SQL Error:',err);
      // res.writeHead(205, {
      //   "Content-Type": "text/plain",
      // });
      res.status(400).send("Unsuccessful To fetch details");
      }
      else{
          res.status(200).send(result);
        }
      });
});

//Route to get Customer Profile
app.get("/customerProfile", function (req, res) {
  console.log("Inside Customer profile section");
  var idCustomers = req.body.idCustomers;
  console.log(idCustomers);
  var sql = "SELECT * FROM Customers WHERE idCustomers = ?";
  con.query(sql,[idCustomers], function (err, result) {
      if (err){
      console.log('SQL Error:',err);
      res.status(400).send("Unsuccessful To fetch details");
      }
      else{
          res.status(200).send(result);
        }
      });
});

//Route to update Customer Profile
app.post("/updateCustomerProfile",function(req,res){
  console.log("Inside Update customer profile section");
  var sql = "UPDATE Customers SET FirstName= ?, LastName= ?,Email= ?,Password=?,Phone=?,Favourites=?,DOB=?,City=?,State=?,Country=?,NickName=?,ProfilePicPath=? WHERE idCustomers = ? ";
  con.query(sql,[req.body.firstname,req.body.lastname,req.body.email,req.body.password,req.body.phone,req.body.favourites,req.body.dob,req.body.city,req.body.state,req.body.country,req.body.nickname,req.body.profilepicpath,req.body.idCustomers], function (err, result) {
    if (err){
    console.log('SQL Error:',err);
    res.status(400).send("Unsuccessful To update details");
    }
    else{
        res.status(200).send(" Customer UPDATED");
      }
    });

});

//Route to update Restaurant Profile
app.post("/updateRestaurantProfile",function(req,res){
  console.log("Inside Update Restaurant profile section");
  var sql = "UPDATE Restaurants SET Name= ?,Email= ?,Password=?,Contact=?,Location=?,Description=?,Timings=?,PictureOfRestaurants=?,PicturesOfDishes=? WHERE idRestaurants = ? ";
  con.query(sql,[req.body.name,req.body.email,req.body.password,req.body.contact,req.body.location,req.body.description,req.body.timings,req.body.pictureofrestaurants,req.body.picturesofdishes,req.body.idRestaurants], function (err, result) {
    if (err){
    console.log('SQL Error:',err);
    res.status(400).send("Unsuccessful To update details");
    }
    else{
        res.status(200).send("Restaurant UPDATED");
      }
    });

});

//Route to list of orders by customers for a restaurant
app.get("/getRestaurantOrders", function (req, res) {
  console.log("Inside Restaurant orders section");
  var idRestaurants = req.body.idRestaurants;
  console.log(idRestaurants);
  var sql = "SELECT * FROM Orders WHERE restaurantID = ? order by customerID";
  con.query(sql,[idRestaurants], function (err, result) {
      if (err){
      console.log('SQL Error:',err);
      res.status(400).send("Unsuccessful To orders list");
      }
      else{
          res.status(200).send(result);
        }
      });
});

//Route to list of orders by restaurants for a customer
app.get("/getCustomerOrders", function (req, res) {
  console.log("Inside Customers orders section");
  var idCustomers = req.body.idCustomers;
  console.log(idCustomers);
  var sql = "SELECT * FROM Orders WHERE customerID = ? order by restaurantID";
  con.query(sql,[idCustomers], function (err, result) {
      if (err){
      console.log('SQL Error:',err);
      res.status(400).send("Unsuccessful To orders list");
      }
      else{
          res.status(200).send(result);
        }
      });
});

//Route to update order status through restaurant
app.post("/updateOrderStatus",function(req,res){
  console.log("Inside Update Order Status");
  var sql = "UPDATE Orders SET orderStatus= ? WHERE idOrders = ? ";
  con.query(sql,[req.body.orderstatus,req.body.idOrders], function (err, result) {
    if (err){
    console.log('SQL Error:',err);
    res.status(400).send("Unsuccessful To update details");
    }
    else{
        res.status(200).send("Order Status UPDATED");
      }
    });

});

//start your server on port 3001
app.listen(3001);
console.log("Server Listening on port 3001");
