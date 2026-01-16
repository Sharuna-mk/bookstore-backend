const mongoose = require("mongoose")

const userSchema= mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    bio:{
        type:String,
        required:false
    },
    profile:{
        type:String,
        required:false
    },
    role:{
        type:String,
        required:false,
        default:'Bookstore User'
    }

})

module.exports = mongoose.model('User',userSchema)