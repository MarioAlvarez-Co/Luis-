const sqlite3 = require('sqlite3').verbose();

class DatabaseManager {
  constructor() {
    this.db = new sqlite3.Database('./database.db', (err) => {
      if (err) {
        console.error('Error opening database:', err.message);
      } else {
        this.createTable();
      }
    });
  }

  createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        price REAL,
        registrationDate TEXT,
        expirationDate TEXT,
        cantidad INTEGER
      )
    `;

    this.db.run(query, (err) => {
      if (err) {
        console.error('Error creating table:', err.message);
      }
    });
  }

  saveProduct(product) {
    const query = `
      INSERT INTO products (name, price, registrationDate, expirationDate, cantidad)
      VALUES (?, ?, ?, ?, ?)
    `;

    const params = [product.name, product.price, product.registrationDate, product.expirationDate, product.cantidad];

    return new Promise((resolve, reject) => {
      this.db.run(query, params, function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID);
        }
      });
    });
  }

  // ... (resto del código)

  getAllProducts() {
    const query = 'SELECT * FROM products';
    return new Promise((resolve, reject) => {
      this.db.all(query, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }
}

module.exports = new DatabaseManager();
