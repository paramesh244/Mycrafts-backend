const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types
const adminSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    resetToken:String,
    expireToken:Date,
    pic:{
     type:String,
     default:"https://icons.veryicon.com/png/o/miscellaneous/yuanql/icon-admin.png"
    },
    
})

mongoose.model("Admin",adminSchema)