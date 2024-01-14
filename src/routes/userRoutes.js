const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/api/user/me', authMiddleware, userController.me);
router.post('/api/user/signup', userController.signup);
router.post('/api/user/login', userController.login);
router.post('/api/user/forget-password/:email', userController.forgetPassword);
router.post('/api/user/reset-password', userController.resetPassword);

module.exports = router;
