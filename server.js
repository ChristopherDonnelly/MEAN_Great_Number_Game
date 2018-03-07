
var express = require("express");
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require("path");

// create the express app
var app = express();

app.use(session({
    secret: 'counter_secret', 
    saveUninitialized: true,
    resave: true
}));

app.use(bodyParser.urlencoded({ extended: true }));

// static content
app.use(express.static(path.join(__dirname, "./static")));

// setting up ejs and our views folder
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

// root route to render the index.ejs view
app.get('/', function(req, res) {

    if(!req.session.randomNum){
        req.session.randomNum = Math.floor(Math.random() * 100)+1;
    }
    if(!req.session.guess){
        req.session.guess = 'none';
    }
    if(!req.session.color){
        req.session.color = 'white';
    }
    if(!req.session.border){
        req.session.border = 'transparent';
    }
    if(!req.session.count){
        req.session.count = 0;
    }

    context = {
        randomNum: req.session.randomNum,
        guess: req.session.guess,
        color: req.session.color,
        border: req.session.border,
        count: req.session.count
    }
    res.render("index", context);
});

app.post('/guess', function(req, res) {
    
    if(req.body.answer != ""){
        req.session.guess = req.body.answer;
        req.session.border = 'black';
        req.session.count++;

        if(parseInt(req.session.randomNum) > parseInt(req.session.guess)){
            req.session.color = 'red';
        }else if(parseInt(req.session.randomNum) < parseInt(req.session.guess)){
            req.session.color = 'red';
        }else if(parseInt(req.session.randomNum) == parseInt(req.session.guess)){
            req.session.color = 'green';
        }
    }
    
    res.redirect('/');
});

app.post('/reset', function(req, res) {
    req.session.destroy();
    res.redirect('/');
});

// tell the express app to listen on port 8000
app.listen(8000, function() {
    console.log("listening on port 8000");
});