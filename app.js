// app.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const categoryRoutes = require('./routes/categories');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Connect to MongoDB 
mongoose.connect("mongodb+srv://mhameeedahmad:3G27841971g=@mydata.9mdsuxt.mongodb.net/?retryWrites=true&w=majority&appName=MyData");
//example of GET
app.get('/',(req,res)=>{
  res.send("Im Working")
})
// Auth routes
app.use('/auth', authRoutes); 

// Task routes
app.use('/api', taskRoutes);

// Category routesבךד
app.use('/api', categoryRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
