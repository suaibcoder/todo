const usermodel = require("../Models/userModels");

class AuthServices {
    static async register(email, password, username , about ,profileImage) {

        try {
            const newuser = new usermodel({ email, password, username ,about  ,profileImage });
            return await newuser.save();
        } catch (error) {
            throw error;
        }

    }

} 

module.exports = AuthServices ;