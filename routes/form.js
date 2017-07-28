var express = require('express');
var router = express.Router();
var path = require('path');

var form_model = require('../models/form.model');

router.get('/admin-new', function(req, res, next) {
  res.sendfile(path.join(__dirname + '/../public/views/form.adminnew.html'));
});

router.post('/admin-submit', function(req, res, next){
  form_model.insert(req, res, function(){
    res.redirect('/form/admin-new');
  })
});

router.get('/admin-index', function(req, res, next){
  form_model.loadIndex(req, function(){
    res.redirect('/form/adminnew');
  });
})

router.get('/admin-input', function(req, res, next) {
  res.sendfile(path.join(__dirname + '/../public/views/form.admininput.html'));
});

router.post('/admin-edit/postupdate', function(req, res, next) {
  form_model.postUpdate(req, function(){
     res.send('successful');
  });
});

router.post('/admin-submitedit', function(req, res, next) {
  form_model.replace(req, res, function(stringed){
     form_model.load(req, res, function(stringed){
        res.render(__dirname + '/../public/views/form.adminedit.html', 
                {form: stringed});
        })
  });
});

router.post('/admin-edit', function(req, res, next) {
  form_model.load(req, res, function(stringed){
    res.render(__dirname + '/../public/views/form.adminedit.html', 
                {form: stringed});
  })
});


router.get('/client-input', function(req, res, next) {
  res.sendfile(path.join(__dirname + '/../public/views/form.clientinput.html'));
});

router.post('/client', function(req, res, next){
  form_model.load(req, res, function(stringed){
    res.render(__dirname + '/../public/views/form.client.html', 
                {form: stringed});
  })
});



module.exports = router;
