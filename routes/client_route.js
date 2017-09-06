var xlsx = require('node-xlsx');
var express = require('express');
var router = express.Router();
var path = require('path');
var user_model = require('../models/user.model');
var form_model = require('../models/form.model');

var file = xlsx.parse(__dirname + '/4086_Minh_Ng.xlsx');
var excelForm = {
  Name: (2, 1),
  JobRef: (2, 6),
  Address: (6, 2),
  PostCode: (11, 1),
  Equipment: (20, 0),
  Make: (20, 0),
  Cable: (20, 1),
  Charger: (20, 2),
  Case: (20, 3),
  CD: (20, 4),
  Manual: (20, 5),
  Additional: (20, 6),
  JobDscrpt: (30, 0),
  WorkDone: (30, 3)

}

for(z in file[0].data){
  if(file[0].data[z].length != 0 ){
    var line = file[0].data[z];
    console.log(z + ": " + line);

  }
    
}


router.get('/login', function(req, res, next) {
  res.sendfile(path.join(__dirname + '/../public/views/client.login.html'));
});

router.post('/loginattempt', function(req, res, next){
  user_model.authenticateClient(req, res, function(){
    res.send("OK");
  })
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
