var express = require('express');
const path = require('path');
const fs = require('fs');
var router = express.Router();
const mongoose = require('mongoose');
const User = require('../model/user');
DB_URL = 'mongodb://localhost:27017/rr-home';

mongoose.connect(DB_URL);
mongoose.connection.on('connected', function () {    
    console.log('Mongoose connection open to ' + DB_URL);  
});    

mongoose.connection.on('error',function (err) {    
    console.log('Mongoose connection error: ' + err);  
});    
 
mongoose.connection.on('disconnected', function () {    
    console.log('Mongoose connection disconnected');  
}); 

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/firstApi', function(req, res, next) {
  res.send('this is my firstApi');
});

router.get('/getUsers', function(req, res, next) {
    var id = "5b189905aacdce0e186fc841";
    User.findById(id,(err,doc)=> {
      if(err) {
        res.json({
          status:"-1",
          message:err.message
        })
      }else {
        res.json({
          status:"1",
          message:"success",
          result:{
            count:doc.length,
            data:doc
          }
        })
      }
  })
});

router.post('/signIn', function(req, res, next) {
    let user = new User({
      username:req.body.username,
      password:req.body.password
    })
    
    user.save((err,doc)=>{
      if(err) {
        res.json({
          status:"-1",
          message:err.message
        })
      }
      else {
        res.json({
          status:"1",
          message:"success",
          result:{
            data:""
          }
        })
        
      }
    })
});

router.post('/update', (req, res, next)=> {
  if (req.busboy) {  
    req.busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {  
      // console.log(fieldname, file, filename, encoding, mimetype);
        var saveTo = path.join(__dirname, "abc.png");   
        console.log(saveTo);          
        file.pipe(fs.createWriteStream(saveTo));  
        file.on('end', function () {  
            //在这边可以做一些数据库操作  
            res.json({  
                success: true  
            });  
        });  
    });  
    req.pipe(req.busboy);  
}  
})

router.get('/login', function(req, res, next) {

});

module.exports = router;
