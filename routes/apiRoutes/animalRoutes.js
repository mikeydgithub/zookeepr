// Imports
const { filterByQuery, findById, createNewAnimal, validateAnimal } = require('../../lib/animals')
const { animals } = require('../../data/animals');
// Router allows you to decalre routs in any file as long as you use the proper middleware.
const router = require('express').Router();


// .get method requires two arguments. The first is a string that describes the route the client will have to fetch from.
// The second is a callback function that will execute every time that rout is accessed with a GET request.
// The seconday takeaway is that we are using send() method from the res parameter (short for response) to send the string Hello! to our client.
// To add the route, type the following code just before app.listen():
router.get('/animals', (req, res) => {
    let results = animals;
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});

// If no record exists for the animal being searched for, the client recieves a 404 error.
router.get('/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if (result) {
        res.json(result);
    } else {
        res.send(404);
    } 
});

router.post('/animals', (req, res) => {
    // req.body is where our incoming content will be
    // Set id based on what the neext index of the array will be
    req.body.id = animals.length.toString();

    // If any data in req.body is incorrect, send 400 error back
    if (!validateAnimal(req.body)) {
        res.status(400).send('The Animal is not properly formatted.');
    } else {

    // Add animal to json file and animals array in this function
    const animal = createNewAnimal(req.body, animals);

    res.json(animal);
    // Now when we receive new post data to be added to the animals.json file, we'll take the length property of the animals array (because it's a one-to-one representation of our animals.json file data) and set that as the id for the new data. Remember, the length property is always going to be one number ahead of the last index of the array so we can avoid any duplicate values.
    }
});

module.exports = router;

