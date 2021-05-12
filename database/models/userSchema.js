const mongoose = require('../connection');

const userSchema = new mongoose.Schema({
    authid : String
})

mongoose.model('user',userSchema);