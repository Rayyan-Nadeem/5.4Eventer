const bcrypt = require('bcryptjs');
require('dotenv').config();
const jwt = require('jsonwebtoken');  // Add this to import jwt

// Hardcoded users for testing
const users = [
  {
    username: 'admin',
    password: bcrypt.hashSync('admin123', 10), // Hash for 'admin123'
    role: 'admin',
  },
  {
    username: 'user',
    password: bcrypt.hashSync('password', 10), // Hash for 'password'
    role: 'user',
  },
  {
    username: 'scott',
    password: bcrypt.hashSync('password2', 10), // Hash for 'password2'
    role: 'user',
  },
];

exports.register = async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { username, password: hashedPassword, role };
    users.push(newUser); // Add the new user to the hardcoded array
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = users.find(u => u.username === username);
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password); // Password comparison
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ username: user.username, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '72h',  // 72-hour expiration
    });

    // Ensure token is included in the response
    res.json({ token });  // Send the token directly in the response
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.logout = (req, res) => {
  res.json({ message: 'Logged out successfully' });
}
