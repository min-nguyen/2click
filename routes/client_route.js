var express = require('express');
var router = express.Router();
var path = require('path');

var form_model = require('../models/form.model');


router.get('/input', function(req, res, next) {
  res.sendfile(path.join(__dirname + '/../public/views/form.clientinput.html'));
});

router.post('/submit', function(req, res, next){
  form_model.load(req, res, function(stringed){
    res.render(__dirname + '/../public/views/form.client.html', 
                {form: stringed});
  })
});



module.exports = router;
