const mongoose = require('mongoose');
const bcryptjs = require('bcrypt');
const { schema } = require('./todoModel');

const userSchema = mongoose.Schema({
    email: {
        type : String ,
        required : true ,
    },
    username: {
        type : String ,
        required : true ,
    },
    password: {
        type : String ,
        required : true ,
    },
    token : {
        type : String ,
        default : "",
    },
    about : {
        type :String ,
    },
    profileImage : {
        type : String ,
    },
     userId : {
        type : String ,
        
    },
    isActive: {

         type: Boolean,
          default: false
         }
    
},{
    timestamps: true,
  });

  userSchema.pre('save', async function () {
try {
    
    const hashhpassword = await bcryptjs.hash(this.password,10);
    this.password = hashhpassword ;
    
} catch (error) {
    throw error ;
}
  });

const usermodel = mongoose.model("users",userSchema); 
module.exports = usermodel  ;