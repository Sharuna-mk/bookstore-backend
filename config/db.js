const mongoose = require('mongoose')

mongoose.connect(process.env.DBCONNECTIONSTRING).then(res => {
    console.log("MongoDB connected...");

}).catch(err => {
    console.log("MongoDB connection Failed" + err);

})