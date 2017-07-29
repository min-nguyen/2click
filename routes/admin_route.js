
var express = require('express');
var router = express.Router();
var path = require('path');
var form_model = require('../models/form.model');
var user_model = require('../models/user.model');

// function requireLogin(req, res, next){
//   res.redirect('/admin/login');
//   // if (!req.username) {
//   //   res.redirect('/admin/login');
//   // } else {
//   //   next();
//   // }
// }

// router.use(function(req, res, next){
//   if(req.session && req.session.username){
//     next();
//   }
// })

router.get('/login', function(req, res, next){
    res.sendfile(path.join(__dirname + '/../public/views/adminlogin.html'));
});

router.post('/enter', function(req, res, next){
    user_model.authenticate(req, res, function(){
      req.username = req.body.username;
      req.session.username = req.body.username;
      res.locals.username = req.body.username;
      res.redirect('/admin/index');
    });
});

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