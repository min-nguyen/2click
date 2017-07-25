var express = require('express');
var router = express.Router();
var path = require('path');

var form_model = require('../models/form.model');

router.post('/submit', function(req, res, next){
  form_model.insert(req, function(){
    res.redirect('/form/admin');
  })
});

router.get('/admininput', function(req, res, next) {
  res.sendfile(path.join(__dirname + '/../public/views/form.admininput.html'));
});

router.post('/adminedit', function(req, res, next) {
  form_model.load(req, res, function(stringed){
    res.render(__dirname + '/../public/views/form.adminedit.html', 
                {form: stringed});
  })
});

router.get('/adminnew', function(req, res, next) {
  res.sendfile(path.join(__dirname + '/../public/views/form.adminnew.html'));
});


router.get('/clientinput', function(req, res, next) {
  res.sendfile(path.join(__dirname + '/../public/views/form.clientinput.html'));
});

router.post('/client', function(req, res, next){
  form_model.load(req, res, function(stringed){
    res.render(__dirname + '/../public/views/form.client.html', 
                {form: stringed});
  })
});

module.exports = router;
