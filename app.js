'use strict';
const express = require('express');
const session = require('express-session');
const passport = require('./utils/pass');
const app = express();
const port = 3000;

const loggedIn = (req, res, next) => {
  console.log('logged', req.user);
  if (req.user) {
    next();
  } else {
    res.redirect('/form');
  }
};

app.use(express.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded
app.use(express.json()); // for parsing application/json

const rightUserName = 'foo';
const rightPassword = 'bar';

app.use(session( {
  secret: 'salainen kissa',
  resave: false,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

app.set('views', './views');
app.set('view engine', 'pug');

app.get('/setCookie/:clr', (req, res) => {
  const myColor = req.params.clr;
  res.cookie('color', myColor);
  res.send()
});

app.get('/deleteCookie', (req, res) => {
  res.clearCookie('color');
  res.send()
});

app.get('/form', (req, res) => {
  res.render('form')
});

/*app.get('/secret', (req, res) => {
  if (req.session.logged) {
    res.render('secret');
  } else {
    res.redirect('/form');
  }
});*/
app.get('/secret', loggedIn, (req, res) => {
  res.render('secret');
});

app.post('/login',
    passport.authenticate('local', {failureRedirect: '/form'}),
    (req, res) => {
      console.log('success');
      res.redirect('/secret');
    });

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

/*app.post('/login', (req, res) => {
  if (rightUserName === req.body.username && rightPassword === req.body.password) {
    req.session.logged = true;
    res.redirect('/secret');
  } else {
    req.session.logged = false;
    res.redirect('/form');
  }
});*/
app.get('/', (req, res) => {
  res.render('home');
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));999
