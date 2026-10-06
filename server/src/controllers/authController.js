const { query } = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const userCheck = await query('SELECT * FROM users WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const token = require('crypto').randomBytes(16).toString('hex'); // Legacy support token

    const result = await query(
      'INSERT INTO users (name, email, password, token) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, token',
      [name, email, hashedPassword, token]
    );

    const user = result.rows[0];

    // Create JWT
    const jwtToken = jwt.sign({ id: user.id, role: user.role || 'user' }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });

    res.status(201).json({ token: jwtToken, user: { id: user.id, name: user.name, email: user.email, role: user.role || 'user' } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const jwtToken = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });

    res.json({
      token: jwtToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};
