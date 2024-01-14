const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const config = require('../config/config');
const { transporter } = require('../config/nodemailerConfig');

// to wrap the response in a common structure
const responseWrapper = (statusCode, success, message, data) => {
  return {
    statusCode,
    success,
    message,
    data,
  };
};

const me = async (req, res) => {
  // #swagger.tags = ['User']
  // #swagger.summary = ' - get current user details'
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json(responseWrapper(404, false, 'User not found', null));

    }
  
    res.status(200).json(responseWrapper(200, true, 'User details fetched successfully', user));
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json(responseWrapper(500, false, error.message, null));  }
};

const signup = async (req, res) => {
  // #swagger.tags = ['User']
  // #swagger.summary = ' - Register a new user'
  try {
    const { name, email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json(responseWrapper(400, false, 'User already exists', null));
    }
    const salt = await bcrypt.genSaltSync(10);
    const secPass = await bcrypt.hashSync(password, salt);
    const newUser = new User({ name, email, password: secPass });
    await newUser.save();
    const token = jwt.sign({ userId: newUser._id }, config.jwtSecret, { expiresIn: '5h' });
    res.status(201).json(responseWrapper(201, true, 'User created successfully', { token } || null));

  } catch (error) {
    console.error('Error in signup:', error);
    res.status(500).json(responseWrapper(500, false, error.message, null));
  }
};

const login = async (req, res) => {
  // #swagger.tags = ['User']
  // #swagger.summary = ' - Login a user'
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json(responseWrapper(404, false, 'Invalid credentials', null));
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
      return res.status(404).json(responseWrapper(404, false, 'Invalid credentials', null));
    }
    
    const token = jwt.sign({ userId: user._id }, config.jwtSecret, { expiresIn: '5h' });
    res.status(200).json(responseWrapper(200, true,  'User logged in successfully', { token }));
    console.log('User logged in successfully');
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json(responseWrapper(500, false, error.message, null));  }
};

const forgetPassword = async (req, res) => {
  // #swagger.tags = ['User']
  // #swagger.summary = ' - Send password reset link to user email'
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json(responseWrapper(404, false, 'User not found', null));
    }

    // Generate a token for password reset with a short expiration time
    const resetToken = jwt.sign({ userId: user._id }, config.jwtSecret, { expiresIn: '10m' });

    // Create a password reset link with the resetToken
    const resetLink = `${config.frontendURL}/reset-password?token=${resetToken}`;

    // Email content
    const mailOptions = {
      from: config.email,
      to: user.email,
      subject: 'Password Reset Request',
      html: `<p>Hello ${user.name},</p>
            <p>You have requested to reset your password. Click the link below to reset your password:</p>
            <a href="${resetLink}">${resetLink}</a>
            <p>If you did not request this, please ignore this email.</p>`,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending password reset email:', error);
        res.status(500).json(responseWrapper(500, false, 'Error sending password reset email', null));
      } else {
        console.log('Password reset email sent:', info.response);
        res.status(200).json(responseWrapper(200, true, 'Password reset email sent successfully', null));
      }
    });
  } catch (error) {
    console.error('Error in forget password:', error);
    res.status(500).json(responseWrapper(500, false, error.message, null));
  }
};

const resetPassword = async (req, res) => {
  // #swagger.tags = ['User']
  // #swagger.summary = ' - Reset user password'
  try {
    const { token, newPassword } = req.body;

    // Verify the token
    const decodedToken = jwt.verify(token, config.jwtSecret);
    const userId = decodedToken.userId;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json(responseWrapper(404, false, 'User not found', null));
    }

    // Update the user's password
    user.password = newPassword;
    await user.save();

    res.status(200).json(responseWrapper(200, true, 'Password reset successfully', null));
  } catch (error) {
    console.error('Error in reset password:', error);
    res.status(500).json(responseWrapper(500, false, error.message, null));
  }
};

module.exports = {
  me,
  signup,
  login,
  forgetPassword,
  resetPassword,
  responseWrapper,
};