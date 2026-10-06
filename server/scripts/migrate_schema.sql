-- Add new columns to products table if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'weight_grams') THEN
        ALTER TABLE products ADD COLUMN weight_grams DECIMAL(10, 3) DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'material_type') THEN
        ALTER TABLE products ADD COLUMN material_type VARCHAR(50) DEFAULT 'gold';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'diamond_carats') THEN
        ALTER TABLE products ADD COLUMN diamond_carats DECIMAL(10, 3) DEFAULT 0;
    END IF;
END $$;
