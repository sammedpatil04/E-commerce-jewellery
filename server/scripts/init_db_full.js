const { pool } = require('../src/config/db');
const bcrypt = require('bcrypt');

async function initializeDatabase() {
  const client = await pool.connect();
  try {
    console.log('--- Initializing Divine Jewels Database ---');

    await client.query('BEGIN');

    // 1. Create tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        token VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL DEFAULT 0,
        image_url TEXT,
        category_id INT REFERENCES categories(id) ON DELETE CASCADE,
        is_featured BOOLEAN DEFAULT FALSE,
        weight_grams DECIMAL(10, 3) DEFAULT 0,
        material_type VARCHAR(50) DEFAULT 'gold',
        diamond_carats DECIMAL(10, 3) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
        status VARCHAR(50) DEFAULT 'pending',
        customer_name VARCHAR(255),
        shipping_address TEXT,
        contact_number VARCHAR(20),
        email VARCHAR(255),
        payment_method VARCHAR(50) DEFAULT 'COD',
        estimated_delivery_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INT REFERENCES orders(id) ON DELETE CASCADE,
        product_id INT REFERENCES products(id) ON DELETE SET NULL,
        quantity INT NOT NULL DEFAULT 1,
        price DECIMAL(10, 2) NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS contact_messages (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Tables created or already exist.');

    // 2. Insert Categories
    const categories = [
      { name: 'Necklaces', slug: 'necklaces' },
      { name: 'Rings', slug: 'rings' },
      { name: 'Earrings', slug: 'earrings' },
      { name: 'Diamond', slug: 'diamond' },
      { name: 'Bangles', slug: 'bangles' },
      { name: 'Anklets', slug: 'anklets' },
      { name: 'Pendants', slug: 'pendants' },
      { name: 'Bracelets', slug: 'bracelets' }
    ];

    for (const cat of categories) {
      await client.query(`
        INSERT INTO categories (name, slug)
        VALUES ($1, $2)
        ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
      `, [cat.name, cat.slug]);
    }
    console.log('Categories seeded.');

    // 3. Insert Admin User
    const adminEmail = 'admin@divinejewels.com';
    const adminSalt = await bcrypt.genSalt(10);
    const adminHashedPw = await bcrypt.hash('admin', adminSalt);
    const adminToken = require('crypto').randomBytes(16).toString('hex');

    await client.query(`
      INSERT INTO users (name, email, password, role, token)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (email) DO UPDATE SET password = EXCLUDED.password, role = 'admin';
    `, ['Admin User', adminEmail, adminHashedPw, 'admin', adminToken]);

    // Sample Customer
    const custEmail = 'customer@example.com';
    const custHashedPw = await bcrypt.hash('customer123', adminSalt);
    await client.query(`
      INSERT INTO users (name, email, password, role, token)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (email) DO NOTHING;
    `, ['Priya Sharma', custEmail, custHashedPw, 'user', adminToken]);
    console.log('Users seeded (Admin: admin@divinejewels.com / admin).');

    // 4. Insert Products with realistic weights and materials
    const productsData = [
      {
        name: 'Royal Gold Necklace',
        description: '22k Gold Necklace with intricate royal design',
        price: 125000.00,
        image_url: 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?auto=format&fit=crop&w=600&q=80',
        category_slug: 'necklaces',
        is_featured: true,
        weight_grams: 15.5,
        material_type: 'gold',
        diamond_carats: 0
      },
      {
        name: 'Diamond Stud Earrings',
        description: 'Solitaire diamond studs, 0.5 carat each in 18k white gold',
        price: 85000.00,
        image_url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80',
        category_slug: 'diamond',
        is_featured: true,
        weight_grams: 4.0,
        material_type: 'diamond',
        diamond_carats: 1.0
      },
      {
        name: 'Sapphire Gold Ring',
        description: '18k Gold Ring with Blue Sapphire centerpiece',
        price: 45000.00,
        image_url: 'https://images.unsplash.com/photo-1605100804763-ebea2401a863?auto=format&fit=crop&w=600&q=80',
        category_slug: 'rings',
        is_featured: false,
        weight_grams: 3.5,
        material_type: 'gold',
        diamond_carats: 0
      },
      {
        name: 'Ruby Pendant Chain',
        description: 'Elegant gold chain with natural Burmese Ruby pendant',
        price: 35000.00,
        image_url: 'https://images.unsplash.com/photo-1602751584552-8ba43d4c3123?auto=format&fit=crop&w=600&q=80',
        category_slug: 'necklaces',
        is_featured: false,
        weight_grams: 8.2,
        material_type: 'gold',
        diamond_carats: 0
      },
      {
        name: 'Platinum Wedding Band',
        description: 'Simple and timeless pure platinum band',
        price: 55000.00,
        image_url: 'https://images.unsplash.com/photo-1603561591411-cd76bca969aa?auto=format&fit=crop&w=600&q=80',
        category_slug: 'rings',
        is_featured: false,
        weight_grams: 5.0,
        material_type: 'platinum',
        diamond_carats: 0
      },
      {
        name: 'Emerald Drop Earrings',
        description: '22k Gold earrings with lush Colombian Emerald drops',
        price: 62000.00,
        image_url: 'https://images.unsplash.com/photo-1596944924616-00f3f29948dd?auto=format&fit=crop&w=600&q=80',
        category_slug: 'earrings',
        is_featured: false,
        weight_grams: 6.0,
        material_type: 'gold',
        diamond_carats: 0
      },
      {
        name: 'Diamond Tennis Bracelet',
        description: 'Classic diamond tennis bracelet in 18k white gold',
        price: 150000.00,
        image_url: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=600&q=80',
        category_slug: 'diamond',
        is_featured: true,
        weight_grams: 12.0,
        material_type: 'diamond',
        diamond_carats: 3.5
      },
      {
        name: 'Traditional Jhumka',
        description: 'Gold Jhumka earrings crafted in heritage temple style',
        price: 78000.00,
        image_url: 'https://images.unsplash.com/photo-1617038224538-276365d6363d?auto=format&fit=crop&w=600&q=80',
        category_slug: 'earrings',
        is_featured: false,
        weight_grams: 10.5,
        material_type: 'gold',
        diamond_carats: 0
      },
      {
        name: 'Gold Temple Bangle',
        description: 'Handcrafted temple jewelry style bangle in pure 22k gold',
        price: 65000.00,
        image_url: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500',
        category_slug: 'bangles',
        is_featured: false,
        weight_grams: 8.5,
        material_type: 'gold',
        diamond_carats: 0
      },
      {
        name: 'Diamond Cuff Bangle',
        description: 'Modern diamond cuff bangle in 18k gold with VS clarity diamonds',
        price: 110000.00,
        image_url: 'https://images.unsplash.com/photo-1603561591411-cd76bca969aa?w=500',
        category_slug: 'bangles',
        is_featured: true,
        weight_grams: 10.0,
        material_type: 'diamond',
        diamond_carats: 1.5
      },
      {
        name: 'Silver Payal',
        description: 'Sterling 925 silver traditional anklets with ringing bells',
        price: 4500.00,
        image_url: 'https://images.unsplash.com/photo-1602751584552-8ba43d4c3123?w=500',
        category_slug: 'anklets',
        is_featured: false,
        weight_grams: 35.0,
        material_type: 'silver',
        diamond_carats: 0
      },
      {
        name: 'Om Pendant',
        description: 'Gold sacred Om pendant studded with brilliant micro diamonds',
        price: 18000.00,
        image_url: 'https://images.unsplash.com/photo-1602751584552-8ba43d4c3123?w=500',
        category_slug: 'pendants',
        is_featured: false,
        weight_grams: 2.5,
        material_type: 'gold',
        diamond_carats: 0.1
      },
      {
        name: 'Charm Bracelet',
        description: '18k gold charm bracelet with handcrafted good-luck charms',
        price: 55000.00,
        image_url: 'https://images.unsplash.com/photo-1603561591411-cd76bca969aa?w=500',
        category_slug: 'bracelets',
        is_featured: true,
        weight_grams: 7.2,
        material_type: 'gold',
        diamond_carats: 0
      },
      {
        name: 'Choker Necklace Set',
        description: 'Bridal choker set with matching chandelier earrings in 22k gold',
        price: 180000.00,
        image_url: 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?w=500',
        category_slug: 'necklaces',
        is_featured: true,
        weight_grams: 24.0,
        material_type: 'gold',
        diamond_carats: 0
      },
      {
        name: 'Couple Band Rings',
        description: 'Set of two matching platinum bands with comfort fit',
        price: 90000.00,
        image_url: 'https://images.unsplash.com/photo-1603561591411-cd76bca969aa?w=500',
        category_slug: 'rings',
        is_featured: false,
        weight_grams: 9.0,
        material_type: 'platinum',
        diamond_carats: 0.05
      }
    ];

    for (const p of productsData) {
      await client.query(`
        INSERT INTO products (name, description, price, image_url, category_id, is_featured, weight_grams, material_type, diamond_carats)
        SELECT $1, $2, $3, $4, c.id, $5, $6, $7, $8
        FROM categories c WHERE c.slug = $9
        ON CONFLICT DO NOTHING;
      `, [p.name, p.description, p.price, p.image_url, p.is_featured, p.weight_grams, p.material_type, p.diamond_carats, p.category_slug]);
    }
    console.log('Products seeded.');

    // 5. Seed sample orders if none exist
    const ordersCheck = await client.query('SELECT COUNT(*) FROM orders');
    if (parseInt(ordersCheck.rows[0].count) === 0) {
      const userRes = await client.query('SELECT id FROM users WHERE email = $1', [custEmail]);
      const custId = userRes.rows[0]?.id;
      const prodRes = await client.query('SELECT id, price FROM products LIMIT 3');

      if (custId && prodRes.rows.length > 0) {
        const order1 = await client.query(`
          INSERT INTO orders (user_id, total_amount, status, customer_name, shipping_address, contact_number, email, payment_method, estimated_delivery_date)
          VALUES ($1, $2, 'completed', 'Priya Sharma', '404 Marine Drive, Mumbai', '9876543210', 'customer@example.com', 'COD', CURRENT_DATE + INTERVAL '5 days')
          RETURNING id;
        `, [custId, prodRes.rows[0].price]);

        await client.query(`
          INSERT INTO order_items (order_id, product_id, quantity, price)
          VALUES ($1, $2, 1, $3);
        `, [order1.rows[0].id, prodRes.rows[0].id, prodRes.rows[0].price]);

        const order2 = await client.query(`
          INSERT INTO orders (user_id, total_amount, status, customer_name, shipping_address, contact_number, email, payment_method, estimated_delivery_date)
          VALUES ($1, $2, 'pending', 'Priya Sharma', '404 Marine Drive, Mumbai', '9876543210', 'customer@example.com', 'COD', CURRENT_DATE + INTERVAL '7 days')
          RETURNING id;
        `, [custId, prodRes.rows[1].price]);

        await client.query(`
          INSERT INTO order_items (order_id, product_id, quantity, price)
          VALUES ($1, $2, 1, $3);
        `, [order2.rows[0].id, prodRes.rows[1].id, prodRes.rows[1].price]);

        console.log('Sample orders seeded.');
      }
    }

    // 6. Seed sample feedback message
    const msgCheck = await client.query('SELECT COUNT(*) FROM contact_messages');
    if (parseInt(msgCheck.rows[0].count) === 0) {
      await client.query(`
        INSERT INTO contact_messages (name, email, message)
        VALUES ('Aarav Patel', 'aarav@example.com', 'Absolutely stunning jewellery! The gold bangle was crafted with remarkable precision.');
      `);
      console.log('Sample feedback seeded.');
    }

    await client.query('COMMIT');
    console.log('Database initialization completed successfully!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Database initialization failed:', err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

initializeDatabase();
