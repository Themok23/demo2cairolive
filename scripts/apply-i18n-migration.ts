import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

async function runMigration() {
  console.log('Starting i18n and exchange rates migration...');

  try {
    // Add Arabic and French columns to categories table
    await sql`ALTER TABLE categories ADD COLUMN IF NOT EXISTS name_ar VARCHAR(100)`;
    console.log('✓ Added name_ar to categories');

    await sql`ALTER TABLE categories ADD COLUMN IF NOT EXISTS description_ar TEXT`;
    console.log('✓ Added description_ar to categories');

    await sql`ALTER TABLE categories ADD COLUMN IF NOT EXISTS name_fr VARCHAR(100)`;
    console.log('✓ Added name_fr to categories');

    await sql`ALTER TABLE categories ADD COLUMN IF NOT EXISTS description_fr TEXT`;
    console.log('✓ Added description_fr to categories');

    // Add French columns to items table
    await sql`ALTER TABLE items ADD COLUMN IF NOT EXISTS name_fr VARCHAR(200)`;
    console.log('✓ Added name_fr to items');

    await sql`ALTER TABLE items ADD COLUMN IF NOT EXISTS description_fr TEXT`;
    console.log('✓ Added description_fr to items');

    // Add French columns to rewards table
    await sql`ALTER TABLE rewards ADD COLUMN IF NOT EXISTS title_fr VARCHAR(200)`;
    console.log('✓ Added title_fr to rewards');

    await sql`ALTER TABLE rewards ADD COLUMN IF NOT EXISTS description_fr TEXT`;
    console.log('✓ Added description_fr to rewards');

    // Add French column to membership_levels table
    await sql`ALTER TABLE membership_levels ADD COLUMN IF NOT EXISTS name_fr VARCHAR(100)`;
    console.log('✓ Added name_fr to membership_levels');

    // Create exchange_rates table
    await sql`
      CREATE TABLE IF NOT EXISTS exchange_rates (
        id SERIAL PRIMARY KEY,
        from_currency VARCHAR(5) NOT NULL,
        to_currency VARCHAR(5) NOT NULL,
        rate DECIMAL(10,4) NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;
    console.log('✓ Created exchange_rates table');

    // Seed initial exchange rates
    await sql`
      INSERT INTO exchange_rates (from_currency, to_currency, rate)
      VALUES
        ('EGP', 'USD', 0.0200),
        ('EGP', 'EUR', 0.0185),
        ('USD', 'EGP', 50.00),
        ('EUR', 'EGP', 54.05)
      ON CONFLICT DO NOTHING
    `;
    console.log('✓ Seeded initial exchange rates');

    console.log('\nMigration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
