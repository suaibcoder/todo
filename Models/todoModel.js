 const mongoose = require("mongoose");
const {Schema} = require('mongoose');
const usermodel = require("./userModels");
const todoSchema = new mongoose.Schema({
    userId: {
       type :   Schema.Types.ObjectId,
      //  ref : usermodel.modelName
    }, 
    title : String,
    task: String,
    completed: Boolean ,
    token : String ,
  });

const Todo = mongoose.model("Todos",todoSchema); 
module.exports = Todo ;