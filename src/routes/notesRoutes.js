const express = require('express');
const notesController = require('../controllers/notesController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authMiddleware); // Middleware to ensure authentication for notes routes

router.get('/api/notes', notesController.getNotes);
router.get('/api/notes/:notesId', notesController.getNotesId);
router.post('/api/notes', notesController.createNotes);
router.put('/api/notes/:notesId', notesController.updateNotes);
router.delete('/api/notes/:notesId', notesController.deleteNotes);

module.exports = router;
