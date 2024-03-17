const usermodel = require('../Models/userModels');
const profilemodel = require('../Models/profileModel')
const bcrypt = require('bcrypt');
const { Validator } = require("node-input-validator");
const jwt = require('jsonwebtoken');
const AuthServices = require('../services/authServices');
const path = require('path');
const multer = require('multer');
const session = require('express-session');
//-----------------------------------Register user ------------------------------------

const register = async (req, res) => {
  try {

    const val = new Validator(req.body, {
      email: "required|email",
      password: "required",
      username: "required|string",

    });
    const matched = await val.check();

    if (!matched) {
      return res.status(422).json({ status: 422, error: val.errors });
    }
    const { email, password, username ,about  , profileImage } = req.body;
console.log(req.body);
    const existinguser = await usermodel.findOne({ email });
    if (existinguser) {
      return res.status(400).json({ messege: "user alredy exist", register: false });
    }

  //  const profileImage =  req.file.filename
  const user =  AuthServices.register(email, password, username , about,profileImage);
console.log(user);
    return res.status(200).json({ messege: "registered sucssesfull !!", status: true , user : user });

  } catch (error) {

    return res.status(500).json({ messege: "intarnal server errror" });
  }

};
// const updateUserProfile = async (req, res) => {
 

//   try {
//     const val = new Validator(req.body, {
//       // username: "required",
//       // about: "required",

//     });
//     const matched = await val.check();

//     if (!matched) {
//       return res.status(422).json({ status: 422, error: val.errors });
//     }
//     const { userId } = req.params; // Assuming you're passing the userId in the URL
//     const { username, about } = req.body;

//     // Create the update object with the provided fields (name and about)
//     // const updateFields = { username, about };
//     const updateFields = {};
//     if (username !== undefined) updateFields.username = username;
//     if (about !== undefined) updateFields.about = about;
//     // Update the user document with the new name and about fields
//     const updatedUser = await usermodel.findByIdAndUpdate(
//       // { _id: userId }, // Filter criteria to find the user by userId
//       // { $set: updateFields }, // Update operation to set the new name and about fields
//       // { new: true } // Option to return the updated document 
//       (userId, updateFields, {
//         new: true,
//       })
//     );

//     if (!updatedUser) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     return res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
//   } catch (error) {
//     console.error('Error updating profile:', error);
//     return res.status(500).json({ message: 'Internal server error' });
//   }


// };
const updateUserProfile = async (req, res) => {
  try {
    const val = new Validator(req.body, {
      // username: "required",
      // about: "required",
    });
    const matched = await val.check();

    if (!matched) {
      return res.status(422).json({ status: 422, error: val.errors });
    }

    const { userId } = req.params;
    const { username, about } = req.body;

    // Fetch the existing user document
    const existingUser = await usermodel.findById(userId);

    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Construct updateFields based on the provided fields and the existing user data
    const updateFields = {};

    if (username !== undefined && username !== '') {
      updateFields.username = username;
    }

    if (about !== undefined && about !== '') {
      updateFields.about = about;
    }

    // If both username and about are not provided or are empty, return without updating
    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ message: 'Nothing to update' });
    }

    // Update the user document with the new fields
    const updatedUser = await usermodel.findByIdAndUpdate(
      userId,
      updateFields,
      { new: true }
    );

    return res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating profile:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


//-----------------------------------Login user ------------------------------------
const login = async (req, res) => {
  try {
    const val = new Validator(req.body, {
      email: "required|email",
      password: "required",
    });
    const matched = await val.check();

    if (!matched) {
      return res.status(422).json({ status: 422, error: val.errors });
    }

    const { email, password , isActive } = req.body;
    const user = await usermodel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);


    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password !!" });
    } else {
      let tokendata = {
        _id: user._id,
        email: user.email,
        username: user.username,
        
      }
      await usermodel.updateOne({ email }, { isActive: true });
       
      const token = jwt.sign(tokendata, 'thisismysecretkey', { expiresIn: '1d' }); // Token expires in 2 minutes
      return res.status(200).json({ message: "Login successful!!", user, token, tokendata: tokendata });
    }
  } catch (error) {
    console.error("Error in login function:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};

const logout = async(req, res) => {
  try {

    const val =new Validator(req.body , {
      "email" : "required"
    });
      const matched =await val.check(); 
      if (!matched) { 

       return   res.status(403).json({ error : val.errors });

        
      } 
      const {email , isActive} = req.body ;
  const user = await    usermodel.findOne({email}) ;
   if (!user) { 

       return   res.status(404).json({ message: 'user does not exist' , user : user });
    
   }
 const logoutUser = await   usermodel.updateOne({ email }, { isActive: false });
          // return res.status(500).json({ message: 'Failed to logout' });
       return   res.status(200).json({ message: 'Logout successful' , user : logoutUser });
   
  } catch (error) {
      console.error('Error in logout function:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};


const loginUserCount=  async (req, res) => {
  try {
    const count = await usermodel.countDocuments({ isActive: true });
    res.status(200).json({ active_users_count: count });
  } catch (error) {
    console.error('Error getting active users count:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

////////////////////////////// forget password ///////////////////////////////////////////////

const forgotpassword = async (req, res) => {
  try {
    const { email, newPassword, } = req.body;
    if (!email || !newPassword) {
      return res.status(500).send({
        success: false,
        message: "Please Privide All Fields",
      });
    }
    const user = await usermodel.findOne({ email });
    if (!user) {
      return res.status(500).send({
        success: false,
        message: "User Not Found ",
      });
    }
    //hashing password
    var salt = bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    await user.save();
    res.status(200).send({
      success: true,
      message: "Password Reset SUccessfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "eror in PASSWORD RESET API",
      error,
    });
  }
}; 
// const validateFileField = [
//   body('file').custom((value, { req }) => {
//       if (!req.file) {
//           throw new Error('File is required');
//       }
//       return true;
//   })
// ];


const storage = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "Uploads");
    },
    filename: function (req, file, cb) {
      const ext = path.extname(file.originalname); // Get the file extension
      const fullpath = file.fieldname + "-" + Date.now() + ext;
      cb(null, fullpath);

    }
  })
}).single('profileImage');



// Initialize Multer with the storage configuration
// const upload = multer({ storage: storage });

// Define the upload endpoint
const upload =  (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  
  // If file uploaded successfully, respond with the filename
  res.status(200).json({ filename: req.file.filename });
};

const getprofile = async(req ,res)=>{ 
//    try {
//     const {id} = req.params ; 
//     console.log(id);
//   const user =await usermodel.findOne(id);
 
// return res.status(200).json({user:user , status: success})  ;
    
//    } catch (error) {
// return res.status(500).json({error : error})  ;
    
//    }
try {
  const { id } = req.params;
  console.log(id);

  // Assuming usermodel is a Mongoose model
  const user = await usermodel.findById(id); // Changed findOne to findById and added await

  if (!user) {
      return res.status(404).json({ error: 'User not found' }); // Handle case where user is not found
  }

  return res.status(200).json({ user: user, status: 'success' }); // Corrected 'success' to a string
} catch (error) {
  console.error('Error:', error); // Log the error for debugging
  return res.status(500).json({ error: error.message }); // Return error message in response
}
};

const profile = async (req, res) => { 
  console.log(req
    .file.filename);
console.log(req.body);
  const val = new Validator(req.body , {
    email: 'required',
    name: 'required',
   
  });

  const ismatched =await val.check();
  if (!ismatched) {
    return res.status(403).json({ error: val.errors });

  }

  const { about, name, email } = req.body;
  const profileImage = req.file.filename 
  console.log(profileImage);;


  const profile = await profilemodel({ profileImage, about, name, email });
  profile.save();

  res.send({ filedat: req.file, profile: profile });

}


module.exports = { register, login, forgotpassword, profile, upload ,storage ,getprofile ,updateUserProfile , loginUserCount ,logout };