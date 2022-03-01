// Creates an Express application. The express() function is a top-level function exported by the express module
const express = require('express');
// Creating a route that the front-end can request data from
const { animals } = require('./data/animals');
const PORT = process.env.PORT || 3001;
// Setting up the server only takes two steps: we need to instantiate the server, then tell it to listen for requests. To instantiate the server, add the following code
// We assign express() to the app variable so that we can later chain on methods to the Express.js server.
const app = express();

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
// To add the route, type the following code just before app.listen():
app.get('/api/animals', (req, res) => {
    let results = animals;
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    console.log(req.query)
    res.json(results);
});
// .get method requires two arguments. The first is a string that describes the route the client will have to fetch from.
// The second is a callback function that will execute every time that rout is accessed with a GET request.
// The seconday takeaway is that we are using send() method from the res parameter (short for response) to send the string Hello! to our client.
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});

