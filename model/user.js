const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var UserSchema = new Schema({     
    userid: {type: String},      
    username : { type: String}, 
    email : {type: String},          
    password: {type:  String},
    portraitUrl: {type: String},                      //id
    userage: {type: Number},                        //年龄
    dishList: {
        dishId :{type: String},
        dishName :{type: String},
        classify :{type: String},
    }
    // logindate : { type: Date}                       //最近登录时间
});

module.exports = mongoose.model('User',UserSchema);