var express = require('express');
var router = express.Router();
var path = require('path');

var form_model = require('../models/form.model');

router.post('/submit', function(req, res, next){
  form_model.insert(req, function(){
    res.redirect('/form/admin');
  })
});

router.get('/admin', function(req, res, next) {
  res.sendfile(path.join(__dirname + '/../public/views/form.admin.html'));
});


router.get('/input', function(req, res, next) {
  res.sendfile(path.join(__dirname + '/../public/views/form.input.html'));
});

router.post('/load', function(req, res, next){
  form_model.load(req, res, function(){
    res.redirect('/form.client.html');
  })
});
router.get('/client', function(req, res, next){
  res.sendfile(path.join(__dirname + '/../public/views/form.client.html'));
});

module.exports = router;
