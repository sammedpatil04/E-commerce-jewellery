const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'jewelry_store',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

const migrationSql = `
DO $$
BEGIN
    -- Add customer_name
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'customer_name') THEN
        ALTER TABLE orders ADD COLUMN customer_name VARCHAR(255);
    END IF;

    -- Add shipping_address
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'shipping_address') THEN
        ALTER TABLE orders ADD COLUMN shipping_address TEXT;
    END IF;

    -- Add contact_number
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'contact_number') THEN
        ALTER TABLE orders ADD COLUMN contact_number VARCHAR(20);
    END IF;

    -- Add email
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'email') THEN
        ALTER TABLE orders ADD COLUMN email VARCHAR(255);
    END IF;

    -- Add payment_method
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'payment_method') THEN
        ALTER TABLE orders ADD COLUMN payment_method VARCHAR(50) DEFAULT 'COD';
    END IF;

    -- Add estimated_delivery_date
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'estimated_delivery_date') THEN
        ALTER TABLE orders ADD COLUMN estimated_delivery_date DATE;
    END IF;

    -- Status is likely already there or defaults, but let's ensure we have a status if not
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'status') THEN
         ALTER TABLE orders ADD COLUMN status VARCHAR(50) DEFAULT 'Pending';
    END IF;

END $$;
`;

const runMigration = async () => {
    try {
        console.log('Running order fields migration...');
        await pool.query(migrationSql);
        console.log('Migration completed successfully.');
    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        await pool.end();
    }
};

runMigration();
