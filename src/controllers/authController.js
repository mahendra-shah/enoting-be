const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config');

// to wrap the response in a common structure
const responseWrapper = (statusCode, message, data) => {
  return {
    statusCode,
    message,
    data,
  };
};

const me = async (req, res) => {
  // #swagger.tags = ['User']
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json(responseWrapper(404, 'User not found', null));

    }
  
    res.status(200).json(responseWrapper(200, 'User details fetched successfully', user));
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json(responseWrapper(500, error.message, null));  }
};

const signup = async (req, res) => {
  // #swagger.tags = ['User']
  try {
    const { name, email, password } = req.body;
    const user = new User({ name, email, password });
    await user.save();
    res.status(201).json({ message: 'User created successfully' });
    res.status(201).json(responseWrapper(201, 'User created successfully', null));

  } catch (error) {
    console.error('Error in signup:', error);
    res.status(500).json(responseWrapper(500, error.message, null));
  }
};

const login = async (req, res) => {
  // #swagger.tags = ['User']
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(404).json(responseWrapper(404, 'Invalid credentials', null));
    }

    const token = jwt.sign({ userId: user._id }, config.jwtSecret, { expiresIn: '1h' });
    res.status(200).json(responseWrapper(200, 'User logged in successfully', { token }));
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json(responseWrapper(500, error.message, null));  }
};

module.exports = {
  me,
  signup,
  login,
  responseWrapper,
};