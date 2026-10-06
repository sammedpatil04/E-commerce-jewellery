const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'jewelry_store',
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

const migrationSql = `
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user';

-- Update all existing users to have a role if they don't
UPDATE users SET role = 'user' WHERE role IS NULL;

-- Set admin role for the first user or a specific one
-- Since we don't know the exact email, we can set it for all currently registered users for testing 
-- or just the one with 'admin' in name/email
UPDATE users SET role = 'admin' WHERE email LIKE '%admin%' OR name LIKE '%admin%';
`;

const runMigration = async () => {
    try {
        console.log('Running user role migration...');
        await pool.query(migrationSql);
        console.log('Migration completed successfully.');
    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        await pool.end();
    }
};

runMigration();
