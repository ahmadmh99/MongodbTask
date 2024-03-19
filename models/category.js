// models/category.js
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }]
  // Add any other fields you need for categories
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
