//So we've seen and used the fs library before, but what's this new one called path? This is another module built into the Node.js API that provides utilities for working with file and directory paths. It ultimately makes working with our file system a little more predictable, especially when we work with production environments such as Heroku.
const fs = require('fs');
const path = require('path');

// Creates an Express application. The express() function is a top-level function exported by the express module
const express = require('express');

// Creating a route that the front-end can request data from
const { animals } = require('./data/animals');

const PORT = process.env.PORT || 3001;

// Setting up the server only takes two steps: we need to instantiate the server, then tell it to listen for requests. To instantiate the server, add the following code
// We assign express() to the app variable so that we can later chain on methods to the Express.js server.
const app = express();
//parse incoming string or array data
// The express.urlencoded({extended: true}) method is a method built into Express.js. It takes incoming POST data and converts it to key/value pairings that can be accessed in the req.body object. The extended: true option set inside the method call informs our server that there may be sub-array data nested in it as well, so it needs to look as deep into the POST data as possible to parse all of the data correctly.
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
// The express.json() method we used takes incoming POST data in the form of JSON and parses it into the req.body JavaScript object. Both of the above middleware functions need to be set up every time you create a server that's looking to accept POST data.
app.use(express.json());

function filterByQuery(query, animalsArray) {
    let personalityTraitsArray = [];
    // Note that we save the animalsArray as filteredResults here
    let filteredResults = animalsArray;
    if (query.personalityTraits) {
        // Save peronsalityTraits as a dedicated array.
        // If personalityTraits is a string, place it into a new array and save.
        if (typeof query.personalityTraits === 'string') {
            personalityTraitsArray = [query.personalityTraits];
        } else {
            personalityTraitsArray = query.personalityTraits
        }
        // Loop through each trait in the personalityTraits array:
        personalityTraitsArray.forEach(trait => {
            // Check the trait against each animal in the filteredResults array.
            // Remeber, it is initially a copy of the animalsArray,
            // but here we're updating it for each trait in the .forEach() loop.
            // FOr Reach trait being targetd by the filter, the filteredResults
            // array will then contain only yhe entries that contain the trait,
            // so at the end we'll have an array of animals that have everyone 
            // of the traits when the .forEach() loop is finished.
            filteredResults = filteredResults.filter(
                animal => animal.personalityTraits.indexOf(trait) !== -1
            );
        });
    }
    if (query.diet) {
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet); 
    }
    if (query.species) {
        filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    if (query.name) {
        filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }
    return filteredResults;
}

//JSON response is a single object instead of an array.
function findById(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result;
}

function createNewAnimal(body, animalsArray) {
    const animal = body;
    animalsArray.push(animal);
    // Here, we're using the fs.writeFileSync() method, which is the synchronous version of fs.writeFile() and doesn't require a callback function
    fs.writeFileSync(
        path.join(__dirname, './data/animals.json'),
        JSON.stringify({ animals: animalsArray }, null, 2)
    );
    // Next, we need to save the JavaScript array data as JSON, so we use JSON.stringify() to convert it. The other two arguments used in the method, null and 2, are means of keeping our data formatted. The null argument means we don't want to edit any of our existing data; if we did, we could pass something in there. The 2 indicates we want to create white space between our values to make it more readable. If we were to leave those two arguments out, the entire animals.json file would work, but it would be really hard to read.

    // return finished code to post route for response
    return animal;
}

function validateAnimal(animal) {
    if (!animal.name || typeof animal.name !== 'string') {
        return false;
    }
    if (!animal.species || typeof animal.species !== 'string') {
    return false;
    }
    if (!animal.diet || typeof animal.diet !== 'string') {
        return false;
    }
    if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)){
        return false;
    }
    return true;
}


// .get method requires two arguments. The first is a string that describes the route the client will have to fetch from.
// The second is a callback function that will execute every time that rout is accessed with a GET request.
// The seconday takeaway is that we are using send() method from the res parameter (short for response) to send the string Hello! to our client.
// To add the route, type the following code just before app.listen():
app.get('/api/animals', (req, res) => {
    let results = animals;
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
})

// If no record exists for the animal being searched for, the client recieves a 404 error.
app.get('/api/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if (result) {
        res.json(result);
    } else {
        res.send(404);
    } 
});

app.post('/api/animals', (req, res) => {
    //req.body is where our incoming content will be
    // set id based on what the neext index of the array will be
    req.body.id = animals.length.toString();

    // if any data in req.body is incorrect, send 400 error back
    if (!validateAnimal(req.body)) {
        res.status(400).send('The Animal is not properly formatted.');
    } else {

    // add animal to json file and animals array in this function
    const animal = createNewAnimal(req.body, animals);

    res.json(animal);
    // Now when we receive new post data to be added to the animals.json file, we'll take the length property of the animals array (because it's a one-to-one representation of our animals.json file data) and set that as the id for the new data. Remember, the length property is always going to be one number ahead of the last index of the array so we can avoid any duplicate values.
    }
});

// app.listen doesnt need to be put at the bottom of the page. it just needs to be placed at any point after app is declared.
// Putting it on the bottom is common practice. 
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});

