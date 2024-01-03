const express = require('express');
const notesController = require('../controllers/notesController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authMiddleware); // Middleware to ensure authentication for task routes

router.get('/api/notes/:userId', notesController.getNotesByUserId);
router.post('/api/notes', notesController.createNotes);
router.put('/api/notes/:notesId', notesController.updateNotes);
router.delete('/api/notes/:notesId', notesController.deleteNotes);

module.exports = router;
