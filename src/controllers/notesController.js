const Notes = require('../models/notes');
const { responseWrapper } = require('./userController')

const getNotesId = async (req, res) => {
  // #swagger.tags = ['Notes']
  try {
    console.log(req.params.notesId);
    const note = await Notes.findOne({ _id: req.params.notesId });

    if (!note) {
      return res.status(404).json(responseWrapper(404, false, 'Notes not found', null));
      
    }

    res.status(200).json(responseWrapper(200, true, 'Notes fetched successfully', note));
  } catch (error) {
    console.error('Error getting notes by ID:', error);
    res.status(500).json(responseWrapper(500, false, error.message, null));
  }
};

const getNotes = async (req, res) => {
  // #swagger.tags = ['Notes']
  try {
    const notes = await Notes.find();

    if (!notes) {
      return res.status(404).json(responseWrapper(404, false, 'Notes not found', null));
      
    }

    res.status(200).json(responseWrapper(200, true, 'Notes fetched successfully', notes));
  } catch (error) {
    console.error('Error getting notes by ID:', error);
    res.status(500).json(responseWrapper(500, false, error.message, null));
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
    res.status(201).json(responseWrapper(201, true, 'Notes created successfully', notes));
  } catch (error) {
    console.error('Error creating notes:', error);
    res.status(500).json(responseWrapper(500, false, error.message, null));
  }
};

const updateNotes = async (req, res) => {
  // #swagger.tags = ['Notes']
  try {
    const { title, description, tag } = req.body;

    if (!title && !description && !tag) {
      return res.status(400).json(responseWrapper(400, false, 'At least one property should be provided for update', null));
    }

    const updatedNotes = await Notes.findOneAndUpdate(
      { _id: req.params.notesId, user: req.user._id },
      { $set: req.body },
      { new: true }
    );

    if (!updatedNotes) {
      return res.status(404).json(responseWrapper(404, false, 'Notes not found', null));
    }

    res.status(200).json(responseWrapper(200, true, 'Notes updated successfully', updatedNotes));
  } catch (error) {
    console.error('Error updating notes:', error);
    res.status(500).json(responseWrapper(500, false, error.message, null));
  }
};


const deleteNotes = async (req, res) => {
  // #swagger.tags = ['Notes']
  try {
    const deletedNotes = await Notes.findOneAndDelete({ _id: req.params.notesId, user: req.user._id });

    if (!deletedNotes) {
      return res.status(404).json(responseWrapper(404, false, 'Notes not found', null));
    }

    res.status(200).json(responseWrapper(200, true, 'Notes deleted successfully', deletedNotes));
  } catch (error) {
    console.error('Error deleting notes:', error);
    res.status(500).json(responseWrapper(500, false, error.message, null));
  }
};

module.exports = {
  getNotes,
  getNotesId,
  createNotes,
  updateNotes,
  deleteNotes,
};