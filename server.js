const express = require('express');
const app = express(); // initialize app
const router = express.Router();
const mongoose = require('mongoose');
const config = require('./config/database');
const path = require('path'); // << built-in
const bodyParser = require('body-parser'); // transform data to json format
const cors = require('cors'); // allows cross origin servers to talk to eachother, angular to node server etc.



// PORT
const port = process.env.PORT || 8080;
// Database
mongoose.Promise = global.Promise;
mongoose.connect(config.uri, (err) => {
    if (err) {
        console.log('Could NOT connect to database: ', err);
    } else {
        // console.log(config.secret);
        console.log('Connected to database: ' + config.db + ' | ' + config.uri);
    }
});

// Setting specific cross origin link instead of general links for safety
// Making sure node is receiving reqs specifically from ANGULAR
app.use(cors({
    origin: 'http://localhost:4200'
}));

// Parse front-end html/text into readable backend json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//  Front-end static directory
app.use(express.static(__dirname + '/public'));
// app.use(express.static(__dirname + '/client/dist/'));

// Routes
const auth = require('./routes/auth')(router); // send express router back for usage
const blog = require('./routes/blog')(router);

app.use('/authentication', auth);
app.use('/blogs', blog);

// Connect backend server to Angular 2 index.html file
// also, use * for all  undefined links will point to the index file
app.get('*', (req, res) => {
    // res.send('hello world!');
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

// INITIALIZE SERVER
app.listen(port, () => {
    console.log('Listening on port' + port);
});


