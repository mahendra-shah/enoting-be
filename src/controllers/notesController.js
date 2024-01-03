const Notes = require('../models/notes');
const { responseWrapper } = require('./authController')

const getNotesByUserId = async (req, res) => {
  // #swagger.tags = ['Notes']
  try {
    const notes = await Notes.findOne({ user: req.params.userId });

    if (!notes) {
      return res.status(404).json(responseWrapper(404, 'Notes not found', null));
      
    }

    res.status(200).json(responseWrapper(200, 'Notes fetched successfully', notes));
  } catch (error) {
    console.error('Error getting notes by ID:', error);
    res.status(500).json(responseWrapper(500, error.message, null));
  }
};

const createNotes = async (req, res) => {
  // #swagger.tags = ['Notes']
  try {
    const { title, description, tag } = req.body;
    const notes = new Notes({
      title,
      description,
      tag,
      user: req.user._id,
    });
    await notes.save();
    res.status(201).json(responseWrapper(201, 'Notes created successfully', notes));
  } catch (error) {
    console.error('Error creating notes:', error);
    res.status(500).json(responseWrapper(500, error.message, null));
  }
};

const updateNotes = async (req, res) => {
  // #swagger.tags = ['Notes']
  try {
    const { title, description, tag } = req.body;
    const updatedNotes = await Notes.findOneAndUpdate(
      { _id: req.params.notesId, user: req.user._id },
      { $set: req.body },
      { new: true }
    );

    if (!updatedNotes) {
      return res.status(404).json(responseWrapper(404, 'Notes not found', null));
    }

    res.status(200).json(responseWrapper(200, 'Notes updated successfully', updatedNotes));
  } catch (error) {
    console.error('Error updating notes:', error);
    res.status(500).json(responseWrapper(500, error.message, null));
  }
};

const deleteNotes = async (req, res) => {
  // #swagger.tags = ['Notes']
  try {
    const deletedNotes = await Notes.findOneAndDelete({ _id: req.params.notesId, user: req.user._id });

    if (!deletedNotes) {
      return res.status(404).json(responseWrapper(404, 'Notes not found', null));
    }

    res.status(200).json(responseWrapper(200, 'Notes deleted successfully', deletedNotes));
  } catch (error) {
    console.error('Error deleting notes:', error);
    res.status(500).json(responseWrapper(500, error.message, null));
  }
};

module.exports = {
  getNotesByUserId,
  createNotes,
  updateNotes,
  deleteNotes,
};