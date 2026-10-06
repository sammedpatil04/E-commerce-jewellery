const { pool } = require('../src/config/db');
const bcrypt = require('bcrypt');

const updateSchema = async () => {
  try {
    console.log('Updating database schema...');
    
    // Add role column
    await pool.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'user'");
    
    // Create Admin User
    const email = 'admin@divinejewels.com';
    const password = 'admin'; // Setup a default admin password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const token = require('crypto').randomBytes(16).toString('hex');

    // Check if admin exists
    const res = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (res.rows.length === 0) {
      await pool.query(
        'INSERT INTO users (name, email, password, role, token) VALUES ($1, $2, $3, $4, $5)',
        ['Admin User', email, hashedPassword, 'admin', token]
      );
      console.log('Admin user created successfully.');
    } else {
       // Ensure existing admin has role
       await pool.query("UPDATE users SET role = 'admin' WHERE email = $1", [email]);
       console.log('Admin user role verified.');
    }

    console.log('Schema update complete.');
  } catch (err) {
    console.error('Error updating schema:', err);
  } finally {
    await pool.end();
  }
};

updateSchema();
