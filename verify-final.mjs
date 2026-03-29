import { neon } from '@neondatabase/serverless';

const connectionString = 'postgresql://neondb_owner:npg_aCwol7Sv6FxE@ep-cold-grass-al62htrg.c-3.eu-central-1.aws.neon.tech/neondb?sslmode=require';
const sql = neon(connectionString);

const allItems = await sql`SELECT id, name, image_url FROM items ORDER BY id`;

console.log('\n' + '='.repeat(80));
console.log('FINAL DATABASE VERIFICATION - All 29 Items');
console.log('='.repeat(80) + '\n');

allItems.forEach(item => {
  console.log(`ID ${String(item.id).padStart(2, ' ')}: ${item.name.padEnd(30)} `);
  console.log(`            ${item.image_url}`);
  console.log('');
});

console.log('='.repeat(80));
console.log(`Total items in database: ${allItems.length}`);
console.log(`Items with image_url: ${allItems.filter(i => i.image_url).length}`);
console.log('='.repeat(80));
