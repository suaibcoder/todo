const { Validator } = require("node-input-validator");
const Todo = require('../Models/todoModel');

const posttodo = async (req, res) => {
  console.log("stating ---------------- post todo");
  // const token = req.header('Authorization');
  // if (!token) return res.status(401).json({ message: 'Unauthorized' });

  // try {
  //   const decoded = jwt.verify(token,'thisismysecretkey');
  //   req.userId = decoded.userId;  
  //   console.log('UserId in posttodo:', req.userId);

  //   global.gettodobyid = req.userId ;
  // } catch (error) {
  //   res.status(401).json({ message: 'Invalid token' });
  // }
  try {

    const validation = new Validator(req.body, {
      task: 'required|string',
      completed: 'required|boolean',
      userId: 'required|string',
      title: 'required|string'
    });

    // Run validation
    const passed = await validation.check();

    if (!passed) {
      return res.status(400).json({ errors: validation.errors });
    }

    const { task, completed, userId, title } = req.body;
    if (!task) {
      return res.status(400).json({ message: 'Task is required' });
    }

    const todo = new Todo({ userId, task, completed, title });
    await todo.save();
    console.log("ending ---------------- post todo");

    res.json({ message: 'Todo added successfully', Todo: todo });
  } catch (error) {
    console.error('Error adding todo:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


const updatetodo = async (req, res) => {
  try {

    const { userId } = req.params;

    const { title, task, completed } = req.body;
 
    // const updateFields = { title, task, completed } 
    const updateFields = {};

    if (title !== undefined && title !== '') {
      updateFields.title = title;
    }

    if (task !== undefined && task !== '') {
      updateFields.task = task;
    }
    if (completed !== undefined && completed !== '') {
      updateFields.completed = completed;
    }

    // If both username and about are not provided or are empty, return without updating
    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ message: 'Nothing to update' });
    }

    
    const updatetodo = await Todo.findOneAndUpdate(
      { _id: userId },
      { $set: updateFields },
      { new: true }
    );
    console.log("----");
    console.log(updatetodo);
    return res.status(200).json({ todo: updatetodo });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
}
// const updatetodo = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const { title, task, completed } = req.body;

//     const updateFields = { title, task, completed };

//     // Make sure to await the findOneAndUpdate call
//     const updatedTodo = await Todo.findOneAndUpdate(
//       { _id: userId },
//       { $set: updateFields },
//       { new: true }
//     );

//     console.log(updatedTodo);

//     return res.status(200).json({ todo: updatedTodo });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: error.message });
//   }
// };


const gettodobyid = async (req, res) => {


  // try { 
  //   const { id } = req.params;
  //   const todo = await Todo.findById(id); // Assuming you're using Mongoose for MongoDB
  //   if (!todo) {
  //       return res.status(404).json({ message: 'Todo not found' });
  //   }
  //   return res.status(200).json(todo);
  // } catch (error) {
  //   console.error('Error getting todos:', error);
  //   return  res.status(500).json({ message: 'Internal Server Error' });
  // }
  try {
    console.log(req.params); // Log req.params to check its structure
    const userId = req.params.id;
    console.log(userId);
    const todos = await Todo.find({ userId });
    // Assuming you're using Mongoose for MongoDB 
    console.log("-----------------");
    console.log(req.params);
    console.log(userId);
    console.log(todos);
    console.log("-----------------");

    if (!todos || todos.length === 0) {
      return res.status(404).json({ message: 'Todos not found for this user ID' });
    }
    return res.status(200).json(todos);
  } catch (error) {
    console.error('Error getting todos by user ID:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const gettodo = async (req, res) => {


  try {
    const val = new Validator(req.body, {
      userId: 'required|string'
    });


    const ismatched = await val.check();
    if (!ismatched) {

      return res.status(403).json({ status: 403, error: val.errors })

    }
    const { userId } = req.body;
    console.log(req.body);
    const todos = await Todo.find({ userId });
    return res.status(200).json(todos);
  } catch (error) {
    console.error('Error getting todos:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }

};



const allDeleteTodo = async (req, res) => {
  try {
    const { userId } = req.body;
    const todo = await Todo.deleteMany({ userId });
    if (!todo) {
      return res.status(404).send('Todo not found');
    }
    res.send(todo);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }


};

const deleteTodo = async (req, res) => {
  try {
    const { id } = req.body;
    const todo = await Todo.findByIdAndDelete(id);
    if (!todo) {
      return res.status(404).send('Todo not found');
    }
    res.send(todo);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }


}

module.exports = { posttodo, gettodo, deleteTodo, allDeleteTodo, gettodobyid, updatetodo };