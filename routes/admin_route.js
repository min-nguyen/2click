
var express = require('express');
var router = express.Router();
var path = require('path');
var form_model = require('../models/form.model');
var user_model = require('../models/user.model');

// PRIORITISE IF LOGIN/ENTER IS REQUESTED
router.get('/login', function(req, res, next){
  res.sendfile(path.join(__dirname + '/../public/views/admin.login.html'));
});

router.post('/enter', function(req, res, next){
    user_model.authenticate(req, res, function(){
      req.session.username = req.body.username;
      res.locals.username = req.body.username;
      res.redirect('/admin/index');
    });
});

// IF NOT LOGIN OR ENTER, CHECK IF SESSION IS AUTHENTICATED
// KEEP THIS BELOW LOGIN AND ENTER FUNCTIONS
// router.use(function(req, res, next){
//   if (!req.session.username) {
//     res.redirect('/admin/login');
//   } else {
//     next();
//   }
// })

router.post('/new/checkValidJobRef', function(req, res, next){
  form_model.checkValidJobRef(req, res);
})

router.get('/new', function(req, res, next) {
  res.sendfile(path.join(__dirname + '/../public/views/admin.new.html'));
});

router.post('/submit', function(req, res, next){
  form_model.insertForm(req, res, function(){
    res.redirect('/admin/index');
  })
});


router.post('/index/newClientJob', function(req, res, next){
  form_model.newClientJob(req, res, function(stringed){
    console.log(stringed);
      res.render(__dirname + '/../public/views/admin.edit.html', 
                  {form: stringed}, function(err, html){
                    if(err) console.log(err)
                      else res.end(html)
      });
    })
});

router.post('/index/getJobs', function(req, res, next){
  form_model.getJobs(req, res, function(){
    
  });
});
router.post('/index/getClients', function(req, res, next){
  form_model.getClients(req, res, function(){
    
  });
});

router.get('/index', function(req, res, next) {
  res.sendfile(path.join(__dirname + '/../public/views/admin.index.html'));
});

router.post('/submit-edit', function(req, res, next) {
  form_model.replaceForm(req, res, function(stringed){
     form_model.loadForm(req, res, function(stringed){
        res.render(__dirname + '/../public/views/admin.edit.html', 
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
  form_model.loadForm(req, res, function(stringed){
    res.render(__dirname + '/../public/views/admin.edit.html', 
                {form: stringed});
  })
});

module.exports = router;