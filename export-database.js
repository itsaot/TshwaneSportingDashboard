// Database Export Script for Tshwane Sporting FC
// This script exports the database data to JSON files for easy importing

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Connect to the database using the DATABASE_URL environment variable
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Ensure the exports directory exists
const exportDir = path.join(__dirname, 'db-exports');
if (!fs.existsSync(exportDir)) {
  fs.mkdirSync(exportDir, { recursive: true });
}

// Function to export a table to JSON
async function exportTable(tableName) {
  try {
    console.log(`Exporting ${tableName}...`);
    const result = await pool.query(`SELECT * FROM "${tableName}"`);
    const filePath = path.join(exportDir, `${tableName}.json`);
    fs.writeFileSync(filePath, JSON.stringify(result.rows, null, 2));
    console.log(`Exported ${result.rows.length} records to ${filePath}`);
    return result.rows;
  } catch (err) {
    console.error(`Error exporting ${tableName}:`, err);
    return [];
  }
}

// Function to generate SQL insert statements
function generateInsertStatements(tableName, data) {
  const filePath = path.join(exportDir, `${tableName}-inserts.sql`);
  let sqlContent = '';

  data.forEach(row => {
    const columns = Object.keys(row).map(key => `"${key}"`).join(', ');
    const values = Object.values(row).map(val => {
      if (val === null) return 'NULL';
      if (typeof val === 'number') return val;
      if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
      return `'${val.toString().replace(/'/g, "''")}'`;
    }).join(', ');
    
    sqlContent += `INSERT INTO "${tableName}" (${columns}) VALUES (${values});\n`;
  });

  fs.writeFileSync(filePath, sqlContent);
  console.log(`Generated SQL insert statements for ${tableName} at ${filePath}`);
}

// Main export function
async function exportDatabase() {
  try {
    console.log('Starting database export...');
    
    // Get list of tables
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
    `);
    
    const tables = tablesResult.rows.map(row => row.table_name);
    console.log(`Found ${tables.length} tables: ${tables.join(', ')}`);
    
    // Export each table and generate insert statements
    for (const table of tables) {
      const data = await exportTable(table);
      generateInsertStatements(table, data);
    }
    
    // Create a SQL schema file
    const schemaResult = await pool.query(`
      SELECT 
        table_name,
        column_name,
        data_type,
        character_maximum_length,
        column_default,
        is_nullable
      FROM information_schema.columns
      WHERE table_schema = 'public'
      ORDER BY table_name, ordinal_position
    `);
    
    let schemaContent = '-- Database schema for Tshwane Sporting FC\n\n';
    
    let currentTable = '';
    for (const row of schemaResult.rows) {
      if (row.table_name !== currentTable) {
        if (currentTable !== '') {
          schemaContent += ');\n\n';
        }
        currentTable = row.table_name;
        schemaContent += `CREATE TABLE "${currentTable}" (\n`;
      } else {
        schemaContent += ',\n';
      }
      
      // Column definition
      schemaContent += `  "${row.column_name}" ${row.data_type}`;
      
      // Add length for character types
      if (row.character_maximum_length) {
        schemaContent += `(${row.character_maximum_length})`;
      }
      
      // Default value
      if (row.column_default) {
        schemaContent += ` DEFAULT ${row.column_default}`;
      }
      
      // Nullable
      if (row.is_nullable === 'NO') {
        schemaContent += ' NOT NULL';
      }
    }
    
    if (currentTable !== '') {
      schemaContent += ');\n';
    }
    
    fs.writeFileSync(path.join(exportDir, 'schema.sql'), schemaContent);
    console.log('Schema exported successfully');
    
    // Export completed
    console.log('Database export completed!');
    console.log(`All files saved to ${exportDir}`);
    
  } catch (err) {
    console.error('Error exporting database:', err);
  } finally {
    await pool.end();
  }
}

// Run the export
exportDatabase();