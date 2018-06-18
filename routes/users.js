var express = require('express');
const path = require('path');
const fs = require('fs');
var router = express.Router();
const mongoose = require('mongoose');
const User = require('../model/user');
const DB_URL = 'mongodb://localhost:27017/rr-home';
const BASE_PATH = "http://192.168.1.108:10006/";
const AB_TEMP_PATH = path.resolve(__dirname, "../public/images/temp");
const AB_IMAGE_PATH = path.resolve(__dirname, "../public/images");

const LE_TEMP_PATH = "images/temp/";
const LE_IMAGE_PATH = "images/";

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
    let username = req.body.username;
    let password = req.body.password;
    let email = req.body.email;
    let portraitUrl = req.body.portraitUrl;
    let userFolder = path.resolve(AB_IMAGE_PATH , username);

    if(!fs.existsSync(userFolder)) { //没有临时文件夹则创建之
      fs.mkdirSync(userFolder);
    }
    // copyDir(AB_TEMP_PATH,userFolder);
    portraitUrl = portraitUrl.split('/');
    let portraitName = portraitUrl[portraitUrl.length - 1];

    portraitUrl = BASE_PATH + LE_IMAGE_PATH + username + '/' + portraitName;

    fs.writeFileSync(path.join(userFolder,portraitName), fs.readFileSync(path.join(AB_TEMP_PATH ,portraitName)));
    emptyDir(AB_TEMP_PATH); 

    let user = new User({
      username:username,
      password:password,
      email:email,
      portraitUrl:portraitUrl
    });

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

router.post('/updatePortrait', (req, res, next)=> {
  if (req.busboy) {  
    req.busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {  
        // 文件夹相关操作
        if(!fs.existsSync(AB_TEMP_PATH)) { //没有临时文件夹则创建之
          fs.mkdirSync(AB_TEMP_PATH);
        }
        emptyDir(AB_TEMP_PATH);  //清空文件夹
        // 文件操作
        let portraitName = randomString(16) + ".png";
        let portraitUrl = path.resolve(AB_TEMP_PATH, portraitName);   
        file.pipe(fs.createWriteStream(portraitUrl));  
        file.on('end', function () {  
            //在这边可以做一些数据库操作  
            res.json({
              status:"1",
              message:"success",
              result:{
                data:{
                  portraitUrl: BASE_PATH + LE_TEMP_PATH + portraitName
                }
              }
            }) 
        });  
    });  
    req.pipe(req.busboy);  
}  
})
// 随机字符串
function randomString(len) {
  　　len = len || 32;
  　　var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';   
  　　var maxPos = $chars.length;
  　　var pwd = '';
  　　for (i = 0; i < len; i++) {
  　　　　pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  　　}
  　　return pwd;
}

function emptyDir(fileUrl){   
  let files = fs.readdirSync(fileUrl);
  files.forEach(function(file){
    let stats = fs.statSync(fileUrl+'/'+file);
    if(stats.isDirectory()) {
        emptyDir(fileUrl+'/'+file);
    }else{
        fs.unlinkSync(fileUrl+'/'+file); 
        console.log("删除文件"+fileUrl+'/'+file+"成功");
    }        
  });
}
function copyDir(srcDir,tarDir) {
  let files = fs.readdirSync(srcDir);
  files.forEach(function(file){
    let srcPath = path.join(srcDir, file);
    let tarPath = path.join(tarDir, file);
    fs.writeFileSync(tarPath, fs.readFileSync(srcPath));
    // let stats = fs.statSync(fileUrl+'/'+file);
    // if(stats.isDirectory()) {
    //     emptyDir(fileUrl+'/'+file);
    // }else{
    //     fs.unlinkSync(fileUrl+'/'+file); 
    //     console.log("删除文件"+fileUrl+'/'+file+"成功");
    // }        
  });
}
router.post('/login', function(req, res, next) {
  let username = req.body.username;
  let password = req.body.password;
  res.json({
    status:"1",
    message:"success",
    result:{
      data:""
    }
  })
});

module.exports = router;
