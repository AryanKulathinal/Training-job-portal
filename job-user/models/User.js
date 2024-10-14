const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    userId:{type:String,required:true,unique:true},
    userName:{type:String,required:true},
    userEmail:{type:String,required:true},
    userPhone:{type:String,required:true},
    userAddress:{type:String,required:true},
    userHighestDegree:{type:String,required:true},
    userExperience:{type:Number,required:true},
    userSkills:{type:String,required:true},
    appliedJobs: [String],

})

module.exports = mongoose.model('User',userSchema);