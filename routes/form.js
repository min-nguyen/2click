var express = require('express');
var router = express.Router();
var path = require('path');

var form_model = require('../models/form.model');

router.post('/submit', function(req, res, next){
  form_model.insert(req, function(){
    res.redirect('/form');
  })
});
/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendfile(path.join(__dirname + '/../public/views/form.html'));
});


module.exports = router;
