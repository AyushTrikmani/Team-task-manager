const fs = require('fs');
const path = require('path');
const pool = require('./config/db');

const run = async () => {
  const files = ['schema.sql', 'migration_public_ids.sql'];

  for (const file of files) {
    const sql = fs.readFileSync(path.join(__dirname, file), 'utf8');
    await pool.query(sql);
    console.log(`Applied ${file}`);
  }

  await pool.end();
};

run().catch(async (err) => {
  console.error(err);
  await pool.end();
  process.exit(1);
});
