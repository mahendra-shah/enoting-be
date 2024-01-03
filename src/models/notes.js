const mongoose = require('mongoose');

const notesSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  tag: { 
    type: String, default: 'general'
   },
  createdAt: { type: Date, default: () => new Date() },
  updatedAt: { type: Date },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const Notes = mongoose.model('Notes', notesSchema);

module.exports = Notes;
