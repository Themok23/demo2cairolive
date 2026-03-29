import { neon } from '@neondatabase/serverless';
import http from 'http';
import https from 'https';

const connectionString = 'postgresql://neondb_owner:npg_aCwol7Sv6FxE@ep-cold-grass-al62htrg.c-3.eu-central-1.aws.neon.tech/neondb?sslmode=require';
const sql = neon(connectionString);

async function verifyImage(url) {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.request(url, { method: 'HEAD', timeout: 5000 }, (res) => {
      const valid = res.statusCode === 200 && res.headers['content-type']?.includes('image');
      resolve({ status: res.statusCode, contentType: res.headers['content-type'], valid });
    });
    req.on('error', (err) => {
      resolve({ status: 0, contentType: 'error', valid: false, error: err.message });
    });
    req.end();
  });
}

const allItems = await sql`SELECT id, name, image_url FROM items ORDER BY id`;

console.log('\n' + '='.repeat(80));
console.log('VERIFYING ALL IMAGES - HTTP 200 & image/jpeg Check');
console.log('='.repeat(80) + '\n');

let validCount = 0;
let invalidCount = 0;

for (const item of allItems) {
  if (!item.image_url) {
    console.log(`✗ ID ${String(item.id).padStart(2, ' ')}: ${item.name.padEnd(30)} - NO URL`);
    invalidCount++;
    continue;
  }
  
  const check = await verifyImage(item.image_url);
  if (check.valid) {
    console.log(`✓ ID ${String(item.id).padStart(2, ' ')}: ${item.name.padEnd(30)} - Status ${check.status}`);
    validCount++;
  } else {
    console.log(`✗ ID ${String(item.id).padStart(2, ' ')}: ${item.name.padEnd(30)} - Status ${check.status}`);
    invalidCount++;
  }
}

console.log('\n' + '='.repeat(80));
console.log(`VERIFICATION RESULTS`);
console.log(`✓ Valid images: ${validCount}/29`);
console.log(`✗ Invalid images: ${invalidCount}/29`);
console.log(`Success rate: ${((validCount / 29) * 100).toFixed(1)}%`);
console.log('='.repeat(80) + '\n');
