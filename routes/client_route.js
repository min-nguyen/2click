var express = require('express');
var router = express.Router();
var path = require('path');
var user_model = require('../models/user.model');
var form_model = require('../models/form.model');


router.get('/login', function(req, res, next) {
  res.sendfile(path.join(__dirname + '/../public/views/client.login.html'));
});


router.post('/submit', function(req, res, next){
  user_model.authenticateClient(req, res, function(){
    form_model.loadForm(req, res, function(stringed){
      res.render(__dirname + '/../public/views/client.form.html', 
                  {form: stringed});
    })
  });
});


module.exports = router;
