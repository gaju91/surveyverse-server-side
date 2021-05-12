const mongoose = require('mongoose');

mongoose.connect(   
    require('../config/keyController').mongoURI,
    { useNewUrlParser : true, useUnifiedTopology : true},
    (err) => {
        if(!err) {
            console.log("Connected to database");
        }
        else {
            console.log("Failed to connect to database");
        }
    }
)

module.exports = mongoose;