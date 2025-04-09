// Database Import Script for Tshwane Sporting FC
// This script imports the database data from JSON files

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Connect to the database using the DATABASE_URL environment variable
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Path to the exported data
const importDir = path.join(__dirname, 'db-exports');

// Ask user for confirmation
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function confirmImport() {
  return new Promise((resolve) => {
    rl.question('This will OVERWRITE existing data in your database. Are you sure? (yes/no): ', (answer) => {
      resolve(answer.toLowerCase() === 'yes');
    });
  });
}

// Function to import a schema
async function importSchema() {
  try {
    console.log('Importing database schema...');
    
    // Read schema file
    const schemaPath = path.join(importDir, 'schema.sql');
    if (!fs.existsSync(schemaPath)) {
      console.log('Schema file not found, skipping schema import');
      return;
    }
    
    const schemaContent = fs.readFileSync(schemaPath, 'utf8');
    
    // Execute schema SQL
    await pool.query(schemaContent);
    console.log('Schema imported successfully');
  } catch (err) {
    console.error('Error importing schema:', err);
  }
}

// Function to import data from SQL inserts
async function importTableFromSql(tableName) {
  try {
    const insertPath = path.join(importDir, `${tableName}-inserts.sql`);
    if (!fs.existsSync(insertPath)) {
      console.log(`No insert statements found for ${tableName}, skipping`);
      return;
    }
    
    console.log(`Importing data for ${tableName} from SQL inserts...`);
    
    // Read the SQL file
    const sqlContent = fs.readFileSync(insertPath, 'utf8');
    const statements = sqlContent.split(';\n').filter(stmt => stmt.trim());
    
    // Execute each statement
    for (const stmt of statements) {
      await pool.query(stmt);
    }
    
    console.log(`Imported ${statements.length} records into ${tableName}`);
  } catch (err) {
    console.error(`Error importing ${tableName} from SQL:`, err);
  }
}

// Function to import data from JSON
async function importTableFromJson(tableName) {
  try {
    const jsonPath = path.join(importDir, `${tableName}.json`);
    if (!fs.existsSync(jsonPath)) {
      console.log(`No JSON data found for ${tableName}, skipping`);
      return;
    }
    
    console.log(`Importing data for ${tableName} from JSON...`);
    
    // Read JSON data
    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    if (!data.length) {
      console.log(`No records found for ${tableName}, skipping`);
      return;
    }
    
    // Clear existing data
    await pool.query(`DELETE FROM "${tableName}"`);
    
    // Insert each record
    for (const record of data) {
      const columns = Object.keys(record).map(key => `"${key}"`).join(', ');
      const placeholders = Object.keys(record).map((_, i) => `$${i + 1}`).join(', ');
      const values = Object.values(record);
      
      const query = `INSERT INTO "${tableName}" (${columns}) VALUES (${placeholders})`;
      await pool.query(query, values);
    }
    
    console.log(`Imported ${data.length} records into ${tableName}`);
  } catch (err) {
    console.error(`Error importing ${tableName} from JSON:`, err);
  }
}

// Main import function
async function importDatabase() {
  try {
    console.log('Starting database import...');
    
    // Confirm import
    const confirmed = await confirmImport();
    if (!confirmed) {
      console.log('Import canceled');
      process.exit(0);
    }
    
    // Check if import directory exists
    if (!fs.existsSync(importDir)) {
      console.error(`Import directory ${importDir} not found`);
      process.exit(1);
    }
    
    // Import schema
    await importSchema();
    
    // Get list of available tables
    const tables = fs.readdirSync(importDir)
      .filter(file => file.endsWith('.json'))
      .map(file => file.replace('.json', ''));
    
    console.log(`Found data for ${tables.length} tables: ${tables.join(', ')}`);
    
    // Import each table
    for (const table of tables) {
      // Try to import from SQL first, then fallback to JSON
      await importTableFromSql(table);
    }
    
    // Import completed
    console.log('Database import completed!');
    
  } catch (err) {
    console.error('Error importing database:', err);
  } finally {
    await pool.end();
    rl.close();
  }
}

// Run the import
importDatabase();