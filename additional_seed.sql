-- Add new categories
INSERT INTO categories (name, slug) VALUES 
('Bangles', 'bangles'),
('Anklets', 'anklets'),
('Pendants', 'pendants'),
('Bracelets', 'bracelets')
ON CONFLICT (slug) DO NOTHING;

-- Add new products
INSERT INTO products (name, description, price, image_url, category_id, is_featured) VALUES
-- Bangles (Category ID assumed 5 based on insertion order, but we should use subqueries in production. For simplicity I'll hardcode assuming sequential ID or use existing IDs)
-- Actually, let's use a safer approach getting IDs
('Gold Temple Bangle', 'Handcrafted temple jewelry style bangle', 65000.00, 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500', (SELECT id FROM categories WHERE slug='bangles'), FALSE),
('Diamond Cuff Bangle', 'Modern diamond cuff bangle in 18k gold', 110000.00, 'https://images.unsplash.com/photo-1603561591411-cd76bca969aa?w=500', (SELECT id FROM categories WHERE slug='bangles'), TRUE),
('Traditional Kundan Bangle', 'Antique finish Kundan bangle', 45000.00, 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?w=500', (SELECT id FROM categories WHERE slug='bangles'), FALSE),
('Rose Gold Slim Bangle', 'Minimalist rose gold bangle', 32000.00, 'https://images.unsplash.com/photo-1617038224538-276365d6363d?w=500', (SELECT id FROM categories WHERE slug='bangles'), FALSE),

-- Anklets (Category ID 6)
('Silver Payal', 'Sterling silver traditional anklets', 4500.00, 'https://images.unsplash.com/photo-1602751584552-8ba43d4c3123?w=500', (SELECT id FROM categories WHERE slug='anklets'), FALSE),
('Gold Bead Anklet', 'Delicate gold chain anklet with beads', 28000.00, 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500', (SELECT id FROM categories WHERE slug='anklets'), FALSE),
('Bridal Heavy Anklet', 'Heavy silver anklet for bridal wear', 15000.00, 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500', (SELECT id FROM categories WHERE slug='anklets'), FALSE),
('Crystal Charm Anklet', 'Stylish anklet with crystal charms', 1200.00, 'https://images.unsplash.com/photo-1605100804763-ebea2401a863?w=500', (SELECT id FROM categories WHERE slug='anklets'), FALSE),

-- Pendants (Category ID 7)
('Om Pendant', 'Gold Om pendant with small diamonds', 18000.00, 'https://images.unsplash.com/photo-1602751584552-8ba43d4c3123?w=500', (SELECT id FROM categories WHERE slug='pendants'), FALSE),
('Heart Shaped Diamond Pendant', 'Romantic heart pendant with solitaire', 42000.00, 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500', (SELECT id FROM categories WHERE slug='pendants'), TRUE),
('Ganesha Gold Pendant', 'Lord Ganesha intricate gold pendant', 22000.00, 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?w=500', (SELECT id FROM categories WHERE slug='pendants'), FALSE),
('Pearl Drop Pendant', 'Freshwater pearl drop in gold setting', 12000.00, 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500', (SELECT id FROM categories WHERE slug='pendants'), FALSE),

-- Bracelets (Category ID 8)
('Mens Gold Chain Bracelet', 'Thick gold chain bracelet for men', 85000.00, 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500', (SELECT id FROM categories WHERE slug='bracelets'), FALSE),
('Charm Bracelet', 'Gold bracelet with multiple charms', 55000.00, 'https://images.unsplash.com/photo-1603561591411-cd76bca969aa?w=500', (SELECT id FROM categories WHERE slug='bracelets'), TRUE),
('Leather and Gold Bracelet', 'Modern leather bracelet with gold clasp', 15000.00, 'https://images.unsplash.com/photo-1617038224538-276365d6363d?w=500', (SELECT id FROM categories WHERE slug='bracelets'), FALSE),
('Evil Eye Bracelet', 'Protective evil eye bracelet in gold', 18000.00, 'https://images.unsplash.com/photo-1605100804763-ebea2401a863?w=500', (SELECT id FROM categories WHERE slug='bracelets'), FALSE),

-- More Necklaces (Category ID 1)
('Choker Necklace Set', 'Bridal choker set with earrings', 180000.00, 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?w=500', (SELECT id FROM categories WHERE slug='necklaces'), TRUE),
('Layered Gold Chain', 'Trendy layered gold chains', 45000.00, 'https://images.unsplash.com/photo-1602751584552-8ba43d4c3123?w=500', (SELECT id FROM categories WHERE slug='necklaces'), FALSE),

-- More Rings (Category ID 2)
('Couple Band Rings', 'Set of two matching platinum bands', 90000.00, 'https://images.unsplash.com/photo-1603561591411-cd76bca969aa?w=500', (SELECT id FROM categories WHERE slug='rings'), FALSE),
('Cocktail Ring', 'Large statement ring with gemstones', 55000.00, 'https://images.unsplash.com/photo-1605100804763-ebea2401a863?w=500', (SELECT id FROM categories WHERE slug='rings'), FALSE);
