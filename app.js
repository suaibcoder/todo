const express = require("express");
const dotenv = require('dotenv');
const router = require('./Routes/UserRoutes.js');

const dbconn = require('./Utils/db.js');
dotenv.config();
dbconn();
const app = express();


// middlewere
app.use(express.json());
app.use("/api",router); 
app.use("/api/profileImg" , express.static('Uploads'));

  

app.listen(process.env.PORT, () => {
    console.log('Server is running on port:' + process.env.PORT);
});

