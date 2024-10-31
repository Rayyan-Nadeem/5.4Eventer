const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

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
    password: bcrypt.hashSync('LeTip5569', 10), // Hash for 'password2'
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

    res.cookie('token', token, { httpOnly: true, maxAge: 72 * 60 * 60 * 1000 }); // 72 hours in milliseconds
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
}
