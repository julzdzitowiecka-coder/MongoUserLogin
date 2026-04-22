// Importing necessary libraries and modules
const mongoose = require('mongoose');            // MongoDB ODM library
const Customers = require('./customer');         // Imported MongoDB model for 'customers'
const express = require('express');              // Express.js web framework
const bodyParser = require('body-parser');       // Middleware for parsing JSON requests
const path = require('path');                    // Node.js path module for working with file and directory paths
const bcrypt = require("bcrypt");
const session = require('express-session');
const uuid = require('uuid'); //to generate a unique session id
const saltRounds = 5;
const { ValidationError, InvalidUserError, AuthenticationFailed } = require('./CustomError');

// Creating an instance of the Express application
const app = express();
app.use(session({
    cookie: { maxAge: 120000 }, // Session expires after 2 minutes of inactivity
    secret: 'itsmysecret',
    resave: false,
    saveUninitialized: true,
    genid: () => uuid.v4()
}));

// Setting the port number for the server
const port = 3000;

// MongoDB connection URI and database name
const uri =  "mongodb://root:Xm4exA3bUMJCcZct0oa7UPBC@172.21.201.102:27017";
mongoose.connect(uri, {'dbName': 'customerDB'});

// Middleware to parse JSON requests
app.use("*", bodyParser.json());

// Serving static files from the 'frontend' directory under the '/static' route
app.use('/static', express.static(path.join(".", 'frontend')));

// Middleware to handle URL-encoded form data
app.use(bodyParser.urlencoded({ extended: true }));

// POST endpoint for user login
app.post('/api/login', async (req, res, next) => {
    const data = req.body;
    console.log(data);
    let user_name = data['user_name'];
    let password = data['password'];

    try {
        // Querying the MongoDB 'customers' collection for matching user_name and password
        const documents = await Customers.find({ user_name: user_name });
        // If a matching user is found, set the session username and serve the home page
        if (documents.length > 0) {
            let result = await bcrypt.compare(password, documents[0]['password']);
            if(result) {
                req.session.username = user_name;   // save user
                console.log("Session ID:", req.sessionID);
                res.cookie('username', user_name, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'strict'
                });
                res.sendFile(path.join(__dirname, 'frontend', 'home.html'));
            } else {
                throw new AuthenticationFailed("Passwords don't match");
            }
        } else {
            throw new InvalidUserError("No such user in database");
        }
    } catch (error) {
        next(error);
    }
});

// POST endpoint for adding a new customer
app.post('/api/add_customer', async (req, res, next) => {
    const data = req.body;
    console.log(data);
    const documents = await Customers.find({ user_name: data['user_name']});
    if (documents.length > 0) {
        res.send("User already exists");
    }
    let hashedpwd = bcrypt.hashSync(data['password'], saltRounds);
    // Creating a new instance of the Customers model with data from the request
    try {
        if (age < 21) {
            throw new ValidationError("Customer Under required age limit");
        }
        const customer = new Customers({
            "user_name": data['user_name'],
            "age": age,
            "password": hashedpwd,
            "email": data['email']
        });
        await customer.save();
        res.send("Customer added successfully");
    } catch (error) {
        next(error);
    }
});

// GET endpoint for the root URL, serving the home page
app.get('/', async (req, res) => {
    if (!req.session.username) {
        console.log("Not authorized");
    } else {
        console.log(`Welcome, ${req.session.username}`);
    }
    res.sendFile(path.join(__dirname, 'frontend', 'home.html'));
});

// GET endpoint for user logout
app.get('/api/logout', async (req, res, next) => {
    req.session.destroy((err) => {
        if (err) {
            const logerr = new Error(err);
            logerr.statusCode = 500;
            logerr.details = 'Logout failed';
            next(logerr);
        } else {
            //res.cookie('username', '', { expires: new Date(0) });
            res.clearCookie('connect.sid');
            res.clearCookie('username');
            res.redirect('/');
        }
      });
});

// Catch‑all errors
app.all("*",(req,res,next)=>{
    const err = new Error(`Cannot find the URL ${req.originalUrl} in this application. Please check.`);
    err.status = "Endpoint Failure";
    err.statusCode = 404;
    next(err);
});

// Error Handling middleware
app.use((err, req, res, next) => {
    // Set default values for status code and status if not provided in the error object
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "Error";

    // Log the error stack to the console for debugging purposes
    console.log(err.stack);

    // Send a JSON response with formatted error details
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
    });
});

// Starting the server and listening on the specified port
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
