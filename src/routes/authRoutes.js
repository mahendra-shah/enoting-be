const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/api/auth/me', authMiddleware, authController.me);
router.post('/api/auth/signup', authController.signup);
router.post('/api/auth/login', authController.login);

module.exports = router;
