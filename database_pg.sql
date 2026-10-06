-- Seed Data: Product Images and Products

-- 1. Update image URLs for products already in the database
WITH image_data(name, image_url) AS (
    VALUES
    ('Royal Gold Necklace',
     'https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Sites-Tanishq-product-catalog/default/dw6b408571/images/hi-res/51W1D1NGPAA00_1.jpg?sw=640&sh=640'),

    ('Diamond Stud Earrings',
     'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80'),

    ('Sapphire Gold Ring',
     'https://images.unsplash.com/photo-1605100804763-ebea2401a863?auto=format&fit=crop&w=600&q=80'),

    ('Ruby Pendant Chain',
     'https://images.unsplash.com/photo-1602751584552-8ba43d4c3123?auto=format&fit=crop&w=600&q=80'),

    ('Platinum Wedding Band',
     'https://images.unsplash.com/photo-1603561591411-cd76bca969aa?auto=format&fit=crop&w=600&q=80'),

    ('Emerald Drop Earrings',
     'https://images.unsplash.com/photo-1596944924616-00f3f29948dd?auto=format&fit=crop&w=600&q=80'),

    ('Diamond Tennis Bracelet',
     'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=600&q=80'),

    ('Traditional Jhumka',
     'https://images.unsplash.com/photo-1617038224538-276365d6363d?auto=format&fit=crop&w=600&q=80')
)
UPDATE products AS p
SET image_url = i.image_url
FROM image_data AS i
WHERE p.name = i.name;


-- 2. Insert products that do not already exist
WITH product_data(name, description, price, image_url, category_slug, is_featured) AS (
    VALUES
    ('Royal Gold Necklace', '22k Gold Necklace with intricate design', 125000.00,
     'https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Sites-Tanishq-product-catalog/default/dw6b408571/images/hi-res/51W1D1NGPAA00_1.jpg?sw=640&sh=640',
     'necklaces', TRUE),

    ('Diamond Stud Earrings', 'Solitaire diamond studs, 0.5 carat each', 85000.00,
     'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80',
     'diamond', TRUE),

    ('Sapphire Gold Ring', '18k Gold Ring with Blue Sapphire', 45000.00,
     'https://images.unsplash.com/photo-1605100804763-ebea2401a863?auto=format&fit=crop&w=600&q=80',
     'rings', FALSE),

    ('Ruby Pendant Chain', 'Elegant gold chain with Ruby pendant', 35000.00,
     'https://images.unsplash.com/photo-1602751584552-8ba43d4c3123?auto=format&fit=crop&w=600&q=80',
     'necklaces', FALSE),

    ('Platinum Wedding Band', 'Simple and elegant platinum band', 55000.00,
     'https://images.unsplash.com/photo-1603561591411-cd76bca969aa?auto=format&fit=crop&w=600&q=80',
     'rings', FALSE),

    ('Emerald Drop Earrings', 'Gold earrings with Emerald drops', 62000.00,
     'https://images.unsplash.com/photo-1596944924616-00f3f29948dd?auto=format&fit=crop&w=600&q=80',
     'earrings', FALSE),

    ('Diamond Tennis Bracelet', 'Classic diamond tennis bracelet', 150000.00,
     'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=600&q=80',
     'diamond', TRUE),

    ('Traditional Jhumka', 'Gold Jhumka earrings traditional style', 78000.00,
     'https://images.unsplash.com/photo-1617038224538-276365d6363d?auto=format&fit=crop&w=600&q=80',
     'earrings', FALSE)
)
INSERT INTO products (
    name, description, price, image_url, category_id, is_featured
)
SELECT
    d.name,
    d.description,
    d.price,
    d.image_url,
    c.id,
    d.is_featured
FROM product_data AS d
JOIN categories AS c ON c.slug = d.category_slug
WHERE NOT EXISTS (
    SELECT 1
    FROM products AS p
    WHERE p.name = d.name
);


-- 3. Verify the product image URLs
SELECT name, image_url
FROM products
ORDER BY id;