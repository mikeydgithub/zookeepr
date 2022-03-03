const path = require('path');
const router = require('express').Router();

// the / route points us to the route of the server! This is the route used to create a homepage for a server.
// unlike most GET and POST routes that deal with creating or return JSON data. this GET route has just one job to do and that is to reponsd with an HTML page in the browser.
// instead of using res.json(), we're using res.sendFile() and all we have to do is tell them where to find the file we want out our server to read and send back to the client.
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/index.html'));
});

router.get('/animals', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/animals.html'));
});

router.get('/zookeepers', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/zookeepers.html'));
});

// What happens if the client makes a request for a route that doesnt exit?
// A request to /about for instance would result in an error because there's no route that matches.
// Users wouldn't be direct to that URL anyway, but just incase, we can use a wildcard route to catch these kinds of requests
router.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/index.html'));
});

module.exports = router;