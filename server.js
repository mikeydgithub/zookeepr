//So we've seen and used the fs library before, but what's this new one called path? This is another module built into the Node.js API that provides utilities for working with file and directory paths. It ultimately makes working with our file system a little more predictable, especially when we work with production environments such as Heroku.
const fs = require('fs');
const path = require('path');

// The require() statements will read the index.js files in each of the directories indicated
const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');

// Creates an Express application. The express() function is a top-level function exported by the express module
const express = require('express');

// Creating a route that the front-end can request data from
const { animals } = require('./data/animals');

const PORT = process.env.PORT || 3001;

// Setting up the server only takes two steps: we need to instantiate the server, then tell it to listen for requests. To instantiate the server, add the following code
// We assign express() to the app variable so that we can later chain on methods to the Express.js server.
const app = express();

// Parse incoming string or array data
// The express.urlencoded({extended: true}) method is a method built into Express.js. It takes incoming POST data and converts it to key/value pairings that can be accessed in the req.body object. The extended: true option set inside the method call informs our server that there may be sub-array data nested in it as well, so it needs to look as deep into the POST data as possible to parse all of the data correctly.
app.use(express.urlencoded({ extended: true }));

// Parse incoming JSON data
// The express.json() method we used takes incoming POST data in the form of JSON and parses it into the req.body JavaScript object. Both of the above middleware functions need to be set up every time you create a server that's looking to accept POST data.
app.use(express.json());

app.use('/api', apiRoutes);
app.use('/', htmlRoutes);

// We added some more middleware to our server and used the express.static() method.
// The way it works is that we provide a file path to a location in our application (in this case, the public folder) and instruct the server to make these files static resources.
// This means that all of our front-end code can now be accessed without having a specific server endpoint created for it!
// app.use(express.static('public'));


// app.listen doesnt need to be put at the bottom of the page. it just needs to be placed at any point after app is declared.
// Putting it on the bottom is common practice. 
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});

