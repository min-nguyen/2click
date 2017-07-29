
var express = require('express');
var router = express.Router();
var path = require('path');
var form_model = require('../models/form.model');
var user_model = require('../models/user.model');


// PRIORITISE IF LOGIN/ENTER IS REQUESTED
router.get('/login', function(req, res, next){
  res.sendfile(path.join(__dirname + '/../public/views/adminlogin.html'));
});

router.post('/enter', function(req, res, next){
  console.log(req)
    user_model.authenticate(req, res, function(){
      req.session.username = req.body.username;
      res.locals.username = req.body.username;
      res.redirect('/admin/index');
    });
});

// IF NOT LOGIN OR ENTER, CHECK IF SESSION IS AUTHENTICATED
// KEEP THIS BELOW LOGIN AND ENTER FUNCTIONS
router.use(function(req, res, next){
  if (!req.session.username) {
    res.redirect('/admin/login');
  } else {
    next();
  }
})

router.get('/new', function(req, res, next) {
  res.sendfile(path.join(__dirname + '/../public/views/form.adminnew.html'));
});

router.post('/submit', function(req, res, next){
  form_model.insert(req, res, function(){
    res.redirect('/form/admin-new');
  })
});


router.post('/index/getPost', function(req, res, next){
  form_model.getPost(req, res, function(){
    
  });
});

router.get('/index', function(req, res, next) {
  res.sendfile(path.join(__dirname + '/../public/views/form.adminindex.html'));
});

router.post('/submit-edit', function(req, res, next) {
  form_model.replace(req, res, function(stringed){
     form_model.load(req, res, function(stringed){
        res.render(__dirname + '/../public/views/form.adminedit.html', 
                {form: stringed});
        })
  });
});

router.post('/edit/postupdate', function(req, res, next) {
  form_model.postUpdate(req, res, function(){
     res.send('successful');
  });
});


router.post('/edit', function(req, res, next) {
  form_model.load(req, res, function(stringed){
    res.render(__dirname + '/../public/views/form.adminedit.html', 
                {form: stringed});
  })
});

module.exports = router;