const mongoose = require('mongoose');
const profileSchema =mongoose.Schema({ 

    profileImage : String , 
    name : String , 
    email : String ,
    about : String

  });
 const profileModel = mongoose.model("profile", profileSchema);

module.exports =  profileModel ;
