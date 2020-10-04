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
  con.query(sql, [email], function (err, result) {
    if (err) {
      console.log('SQL Error:', err);
      res.writeHead(205, {
        "Content-Type": "text/plain",
      });
      res.end("Unsuccessful Login");
    }
    else {

      if (result[0] != null && result[0].Password === req.body.password) {
        console.log("login successfull!");
        res.cookie("cookie", "customer-admin", {
          maxAge: 3600000,
          httpOnly: false,
          path: "/",
        });
        // localStorage.setItem('persona','customer');
        // localStorage.setItem('email',email);
        resjson = {
          idCustomers: result[0].idCustomers,
          password: result[0].Password,
        };
        res.status(200).send(resjson);
      }
      else {
        console.log('SQL Error:', err);
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
  con.query(sql, [email], function (err, result) {
    if (err) {
      console.log('SQL Error:', err);
      res.writeHead(205, {
        "Content-Type": "text/plain",
      });
      res.end("Unsuccessful Login");
    }
    else {

      if (result[0] != null && result[0].Password === req.body.password) {
       
        res.cookie("cookie", "restaurant-admin", {
          maxAge: 3600000,
          httpOnly: false,
          path: "/",
        });
        resjson = {
          idRestaurants: result[0].idRestaurants,
        };
        console.log("login successfull!");
        res.status(200).send(resjson);
      }
      else {
        console.log('SQL Error:', err);
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

  con.query(sql_findEmail, [email], function (err, result) {
    if (err) {
      console.log('SQL Error:', err);
      res.writeHead(205, {
        "Content-Type": "text/plain",
      });
      res.end("SignUp failed");
    }
    else {
      if (result[0] == null) {
        con.query(sql_insert, [email, firstName, lastName, password], function (err, result) {
          if (err) {
            console.log('SQL Error:', err);
            res.writeHead(205, {
              "Content-Type": "text/plain",
            });
            res.end("SignUp failed");
          }
          else {
            console.log("Sigunp successfull!");
            res.writeHead(200, {
              "Content-Type": "text/plain",
            });
            res.end("SignUP Login");
          }
        });
      }
      else {
        console.log('SQL Error:', err);
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

  con.query(sql_findEmail, [email], function (err, result) {
    if (err) {
      console.log('SQL Error:', err);
      res.writeHead(205, {
        "Content-Type": "text/plain",
      });
      res.end("SignUp failed SQL ERROR");
    }
    else {
      if (result[0] == null) {
        con.query(sql_insert, [email, Name, password, location], function (err, result) {
          if (err) {
            console.log('SQL Error:', err);
            res.writeHead(205, {
              "Content-Type": "text/plain",
            });
            res.end("SignUp failed");
          }
          else {
            console.log("Sigunp successfull!");
            res.writeHead(200, {
              "Content-Type": "text/plain",
            });
            res.end("SignUp Successful");
          }
        });
      }
      else {
        console.log('SQL Error:', err);
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
  var idRestaurants = req.query.idRestaurants;
  console.log(req.query);
  var sql = "SELECT * FROM Restaurants WHERE idRestaurants = ?";
  con.query(sql, [idRestaurants], function (err, result) {
    if (err) {
      console.log('SQL Error:', err);
      // res.writeHead(205, {
      //   "Content-Type": "text/plain",
      // });
      res.status(400).send("Unsuccessful To fetch details");
    }
    else {
      console.log("restaurant profile fetched successfully");
      res.status(200).send(result);
    }
  });
});

//Route to get Customer Profile
app.get("/customerProfile", function (req, res) {
  console.log("Inside Customer profile section");
  var idCustomers = req.query.idCustomers;
  console.log(idCustomers);
  var sql = "SELECT * FROM Customers WHERE idCustomers = ?";
  con.query(sql, [idCustomers], function (err, result) {
    if (err) {
      console.log('SQL Error:', err);
      res.status(400).send("Unsuccessful To fetch details");
    }
    else {
      res.status(200).send(result);
    }
  });
});

//Route to create a new Dish for a restaurant

app.post("/restaurantAddNewDish", function (req, res) {
  console.log("Inside Add new Dish Request");
  console.log("Req Body : ", req.body);
  var idRestaurants = req.body.idRestaurants;
  var dishName = req.body.dishName;
  var price = req.body.price;
  var category = req.body.category;
  var imageURL = req.body.imageURL;
  var ingredients = req.body.ingredients;
  var sql_insert = "INSERT INTO Dishes (Name,Price,Ingredients,Image,Category,restaurantID) VALUES (?,?,?,?,?,?);";
  con.query(sql_insert, [dishName,price,ingredients,imageURL,category,idRestaurants], function (err, result) {
    if (err) {
      console.log('SQL Error:', err);
      res.writeHead(205, {
        "Content-Type": "text/plain",
      });
      res.end("failed to add new dish");
    }
    else {
      console.log("add new dish successfull!");
      res.writeHead(200, {
        "Content-Type": "text/plain",
      });
      res.end("added new dish");
    }
  });

});

// ADD events by restaurants
app.post("/restaurantAddNewEvent", function (req, res) {
  console.log("Inside Add new event Request");
  console.log("Req Body : ", req.body);
  var idRestaurants = req.body.idRestaurants;
  var Name = req.body.name;
  var Description = req.body.description;
  var Time = req.body.time;
  var Date = req.body.date;
  var Location = req.body.location;
  var Hashtags = req.body.hashtags;
  var sql_insert = "INSERT INTO Events (`EventName`, `Description`, `Time`, `Date`, `Location`, `Hashtags`, `restaurantID`) VALUES (?,?,?,?,?,?,?);";
  con.query(sql_insert, [Name,Description,Time,Date,Location,Hashtags,idRestaurants ], function (err, result) {
    if (err) {
      console.log('SQL Error:', err);
      res.writeHead(205, {
        "Content-Type": "text/plain",
      });
      res.end("failed to add new event");
    }
    else {
      console.log("add new dish successfull!");
      res.writeHead(200, {
        "Content-Type": "text/plain",
      });
      res.end("added new event");
    }
  });

});

//Update Menue Item By Customer
app.post("/restaurantEditNewDish", function (req, res) {
  console.log("Inside Update Dishes Edit section");
  var idRestaurants = req.body.idRestaurants;
  var idDishes = req.body.idDishes;
  var dishName = req.body.dishName;
  var price = req.body.price;
  var category = req.body.category;
  var imageURL = req.body.imageURL;
  var ingredients = req.body.ingredients;
  var sql = "UPDATE Dishes SET Name= ?,Price= ?,Ingredients=?,Image=?,Category=? WHERE idDishes = ? ";
  con.query(sql, [dishName,price,ingredients, imageURL, category,idDishes], function (err, result) {
    if (err) {
      console.log('SQL Error:', err);
      res.status(205).send("Unsuccessful To Edit Dishes");
    }
    else {
      res.status(200).send("Dish UPDATED");
    }
  });

});

//Route to update Customer Profile
app.post("/updateCustomerProfile", function (req, res) {
  console.log("Inside Update customer profile section");
  var sql = "UPDATE Customers SET FirstName= ?, LastName= ?,Email= ?,Password=?,Phone=?,Favourites=?,DOB=?,City=?,State=?,Country=?,NickName=?,About=? WHERE idCustomers = ? ";
  con.query(sql, [req.body.firstname, req.body.lastname, req.body.email, req.body.password, req.body.phone, req.body.favourites, req.body.dob, req.body.city, req.body.state, req.body.country, req.body.nickname,req.body.about, req.body.idCustomers], function (err, result) {
    if (err) {
      console.log('SQL Error:', err);
      res.status(205).send("Unsuccessful To update details");
    }
    else {
      res.status(200).send(" Customer UPDATED");
    }
  });

});

//Route to post customer review
app.post("/postReview", function (req, res) {
  console.log("Inside post customer review section");
  var sql ="INSERT INTO Reviews ( `restaurantID`, `customerID`, `reviewDate`, `ratings`, `comments`) VALUES (?, ?, now(), ?, ?)";
  con.query(sql, [req.body.restaurantID,req.body.customerID,req.body.ratings,req.body.comments], function (err, result) {
    if (err) {
      console.log('SQL Error:', err);
      res.status(205).send("Unsuccessful To Post Review");
    }
    else {
      res.status(200).send("Review Posted");
    }
  });

});

//Route to update Restaurant Profile
app.post("/updateRestaurantProfile", function (req, res) {
  console.log("Inside Update Restaurant profile section");
  var sql = "UPDATE Restaurants SET Name= ?,Email= ?,Password=?,Contact=?,Location=?,Description=?,Timings=?,PictureOfRestaurants=?,PicturesOfDishes=? WHERE idRestaurants = ? ";
  con.query(sql, [req.body.name, req.body.email, req.body.password, req.body.contact, req.body.location, req.body.description, req.body.timings, req.body.pictureofrestaurants, req.body.picturesofdishes, req.body.idRestaurants], function (err, result) {
    if (err) {
      console.log('SQL Error:', err);
      res.status(205).send("Unsuccessful To update details");
    }
    else {
      res.status(200).send("Restaurant UPDATED");
    }
  });

});

//Route to register a customer to event
app.post("/registerCustomerEvent", function (req, res) {
  console.log("Inside register customer event section",req.body.idEvents);
  var sql1 = "INSERT INTO EventRegistration (`EventID`, `CustomerID`) VALUES (?, ?)";
  var sql2= "SELECT * From EventRegistration where CustomerID=? AND EventID=?";
  //var sql = "UPDATE Restaurants SET Name= ?,Email= ?,Password=?,Contact=?,Location=?,Description=?,Timings=?,PictureOfRestaurants=?,PicturesOfDishes=? WHERE idRestaurants = ? ";
  con.query(sql2, [req.body.idCustomers,req.body.idEvents], function (err, result) {
    if (err) {
      console.log('SQL Error:', err);
      res.status(205).send("Unsuccessful To register to event");
    }
    else {
      if(result.length===0){

        con.query(sql1, [req.body.idEvents,req.body.idCustomers], function (err, result) {
          if (err) {
            console.log('SQL Error:', err);
            res.status(205).send("Unsuccessful To register to event");
          }
          else{
            res.status(200).send("Registered to Event");
          }

        });
       
      }
      else{
        res.status(205).send("Unsuccessful To register to event");

      }

    }
  });

});

//Route to list of orders by customers for a restaurant
app.get("/getRestaurantOrders", function (req, res) {
  console.log("Inside Restaurant orders section");
  var idRestaurants = req.query.idRestaurants;
  console.log(idRestaurants);
  var sql = "SELECT * FROM Orders WHERE restaurantID = ? order by customerID";
  con.query(sql, [idRestaurants], function (err, result) {
    if (err) {
      console.log('SQL Error:', err);
      res.status(400).send("Unsuccessful To orders list");
    }
    else {
      res.status(200).send(result);
    }
  });
});

//Route to list of orders by customers for a restaurant
app.get("/getRestaurantDishes", function (req, res) {
  console.log("Inside Restaurant orders section");
  var idRestaurants = req.query.idRestaurants;
  console.log(idRestaurants);
  var sql = "SELECT * FROM Dishes WHERE restaurantID = ? order by Category";
  con.query(sql, [idRestaurants], function (err, result) {
    if (err) {
      console.log('SQL Error:', err);
      res.status(400).send("Unsuccessful To orders list");
    }
    else {
      res.status(200).send(result);
    }
  });
});

//Route to list of events for a restaurant
app.get("/getRestaurantEvents", function (req, res) {
  console.log("Inside Restaurant Events section");
  var idRestaurants = req.query.idRestaurants;
  console.log(idRestaurants);
  var sql = "SELECT * FROM Events WHERE restaurantID = ?";
  con.query(sql, [idRestaurants], function (err, result) {
    if (err) {
      console.log('SQL Error:', err);
      res.status(400).send("Unsuccessful To orders list");
    }
    else {
      res.status(200).send(result);
    }
  });
});

//Route to list upcoming events for customers 
app.get("/getUpcomingEvents", function (req, res) {
  console.log("Inside Upcoming Events section",req.query.name);
  var sql1="SELECT Events.*, Restaurants.Name FROM Events INNER JOIN Restaurants ON Events.restaurantID=Restaurants.idRestaurants";
  //var sql = "SELECT * FROM Events WHERE Name = ?";
  con.query(sql1, function (err, result) {
    if (err) {
      console.log('SQL Error:', err);
      res.status(205).send("Unsuccessful To Search Event");
    }
    else {
      if(result.length===0)
      {
        res.status(205).send("events not found");
      }
      else{
      res.status(200).send(result);
      console.log("event search success",result);
      }
    }
  });
});

//Route for customer list for a event for restaurants
app.get("/getCustomerListEvent", function (req, res) {
  console.log("Inside Customer list events section",req.query.idEvents);
  var sql1="SELECT Customers.* FROM EventRegistration INNER JOIN Customers ON Customers.idCustomers=EventRegistration.CustomerID WHERE EventRegistration.EventID=?";
  //var sql = "SELECT * FROM Events WHERE Name = ?";
  con.query(sql1,[req.query.idEvents], function (err, result) {
    if (err) {
      console.log('SQL Error:', err);
      res.status(205).send("Unsuccessful To fetch list of customers");
    }
    else {
      if(result.length===0)
      {
        res.status(205).send("Customers not found");
      }
      else{
      res.status(200).send(result);
      console.log("event search success",result);
      }
    }
  });
});

//Route to list upcoming events for customers 
app.get("/getRegisteredEvents", function (req, res) {
  console.log("Inside Registered Events section",req.query.idCustomers);
  var sql1="SELECT Events.* FROM Events INNER JOIN EventRegistration ON EventRegistration.EventID=Events.idEvents where EventRegistration.CustomerID=?";
  //var sql = "SELECT * FROM Events WHERE Name = ?";
  con.query(sql1,[req.query.idCustomers], function (err, result) {
    if (err) {
      console.log('SQL Error:', err);
      res.status(205).send("Unsuccessful To Search Event");
    }
    else {
      if(result.length===0)
      {
        res.status(205).send("events not found");
      }
      else{
      res.status(200).send(result);
      console.log("event search success",result);
      }
    }
  });
});


//Route to list of search events by customers 
app.get("/getSearchEvents", function (req, res) {
  console.log("Inside Search Events section",req.query.name);
  var sql1="SELECT Events.*, Restaurants.Name FROM Events INNER JOIN Restaurants ON Events.restaurantID=Restaurants.idRestaurants WHERE EventName = ?";
  //var sql = "SELECT * FROM Events WHERE Name = ?";
  con.query(sql1, [req.query.name], function (err, result) {
    if (err) {
      console.log('SQL Error:', err);
      res.status(205).send("Unsuccessful To Search Event");
    }
    else {
      if(result.length===0)
      {
        res.status(205).send("event not found");
      }
      else{
      res.status(200).send(result);
      console.log("event search success",result);
      }
    }
  });
});



//Route to list of reviews for a restaurant
app.get("/getRestaurantReviews", function (req, res) {
  console.log("Inside Restaurant orders section");
  var idRestaurants = req.query.idRestaurants;
  console.log("reviews for restaurant :", idRestaurants);
  var sql = "SELECT * FROM Reviews WHERE `restaurantID` = ? order by `customerID`";
  con.query(sql, [idRestaurants], function (err, result) {
    if (err) {
      console.log('SQL Error:', err);
      res.status(400).send("Unsuccessful To find review list");
    }
    else {
      res.status(200).send(result);
    }
  });
});


//Route to list of orders by restaurants for a customer
app.get("/getCustomerOrders", function (req, res) {
  console.log("Inside Customers orders section");
  var idCustomers = req.query.idCustomers;
  console.log(idCustomers);
  var sql = "SELECT * FROM Orders WHERE customerID = ? order by restaurantID";
  con.query(sql, [idCustomers], function (err, result) {
    if (err) {
      console.log('SQL Error:', err);
      res.status(205).send("Unsuccessful To orders list");
    }
    else {
      res.status(200).send(result);
    }
  });
});

//Route to update order status through restaurant
app.post("/updateOrderStatus", function (req, res) {
  console.log("Inside Update Order Status");
  console.log(req.body.orderstatus,req.body.idOrders)
  var sql = "UPDATE Orders SET orderStatus= ? WHERE idOrders = ? ";
  con.query(sql, [req.body.orderstatus, req.body.idOrders], function (err, result) {
    if (err) {
      console.log('SQL Error:', err);
      res.status(205).send("Unsuccessful To update details");
    }
    else {
      res.status(200).send("Order Status UPDATED");
    }
  });

});

//start your server on port 3001
app.listen(3001);
console.log("Server Listening on port 3001");
