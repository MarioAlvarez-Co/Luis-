const sqlite3 = require('sqlite3').verbose();

class DatabaseManager {
  constructor() {
    this.db = new sqlite3.Database('./database.db', (err) => {
      if (err) {
        console.error('Error opening database:', err.message);
      } else {
        this.createTables();
      }
    });
  }

  createTables() {
    this.createProductTable(); 
    this.createDetallesVentaTable();
    this.createVentasTable();   
  }

  createProductTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        price REAL,
        cost REAL,
        registrationDate TEXT,
        expirationDate TEXT,
        amount INTEGER
      )
    `;
    this.db.run(query, (err) => {
      if (err) {
        console.error(`Error creating products table: ${err.message}`);
      }
    });
  }
  createVentasTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS sales (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        dateSale TEXT,
        subtotal REAL,
        discount REAL,
        total REAL
      )
    `;
    this.db.run(query, (err) => {
      if (err) {
        console.error(`Error creating sales table: ${err.message}`);
      }
    });
  }  
  createDetallesVentaTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS detailsSale (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        saleId INTEGER,
        nameProduct TEXT,
        productId INTEGER,
        amount INTEGER,
        price REAL,
        FOREIGN KEY (saleId) REFERENCES sales(id),
        FOREIGN KEY (productId) REFERENCES products(id)
      )
    `;
    this.db.run(query, (err) => {
      if (err) {
        console.error(`Error creating detailsSale table: ${err.message}`);
      }
    });
  }
  


  async saveProduct(product) {
    const query = `
      INSERT INTO products (name, price, cost, registrationDate, expirationDate, amount)
      VALUES (?, ?, ?, ?, ?,?)
    `;

    const params = [product.name, product.price,product.cost, product.registrationDate, product.expirationDate, product.amount];    
    try {
      const result = await new Promise((resolve, reject) => {
        this.db.run(query, params, function (err) {
          if (err) {
            reject(new Error(`Error saving product: ${err.message}`));
          } else {
            resolve(this.lastID);
          }
        });
      });

      return result;
    } catch (error) {
      throw error;
    }
  }

  async getAllProducts() {
    const query = 'SELECT * FROM products';
    try {
      const rows = await new Promise((resolve, reject) => {
        this.db.all(query, [], (err, rows) => {
          if (err) {
            reject(new Error(`Error retrieving products: ${err.message}`));
          } else {
            resolve(rows);
          }
        });
      });

      return rows;
    } catch (error) {
      throw error;
    }
  }

  async findProductById(id) {
    const query = 'SELECT * FROM products WHERE id = ?';
    try {
      const row = await new Promise((resolve, reject) => {
        this.db.get(query, [id], (err, row) => {
          if (err) {
            reject(new Error(`Error finding product: ${err.message}`));
          } else {
            resolve(row);
          }
        });
      });

      return row;
    } catch (error) {
      throw error;
    }
  }

  async updateProduct(product) {
    await this.updateProductDetails(product);
    const updatedProduct = await this.findProductById(product.id);
    return updatedProduct;
  }

  async updateProductDetails(product) {
    const query = `
      UPDATE products
      SET name = ?, price = ?, cost = ?, expirationDate = ?, amount = ?
      WHERE id = ?
    `;

    const params = [product.name, product.price,product.cost, product.expirationDate, product.amount, product.id];

    return new Promise((resolve, reject) => {
      this.db.run(query, params, function (err) {
        if (err) {
          reject(new Error(`Error updating product: ${err.message}`));
        } else {
          resolve();
        }
      });
    });
  }
  async deleteProductById(id) {
    const query = 'DELETE FROM products WHERE id = ?';

    try {
      await new Promise((resolve, reject) => {
        this.db.run(query, [id], function (err) {
          if (err) {
            reject(new Error(`Error deleting product: ${err.message}`));
          } else {
            resolve();
          }
        });
      });
    } catch (error) {
      throw error;
    }
  }  
  async createSale(sale, productsSale) {
    const insertSaleQuery = `
      INSERT INTO sales (dateSale, subtotal, discount, total)
      VALUES (?, ?, ?, ?)
    `;
  
    const insertProductQuery = `
      INSERT INTO detailsSale (saleId, nameProduct, productId, amount, price)
      VALUES (?, ?, ?, ?, ?)
    `;
  
    const updateStockQuery = `
      UPDATE products
      SET amount = amount - ?
      WHERE id = ?
    `;
  
    try {
      const self = this; // Almacenar referencia a this
  
      // Iniciar la transacción
      await new Promise((resolve, reject) => {
        self.db.run('BEGIN TRANSACTION', function (err) {
          if (err) {
            reject(new Error(`Error starting transaction: ${err.message}`));
          } else {
            resolve();
          }
        });
      });
  
      try {
        // Insertar la venta
        const saleId = await new Promise((resolve, reject) => {
          self.db.run(insertSaleQuery, [sale.dateSale, sale.subtotal, sale.discount, sale.total], function (err) {
            if (err) {
              reject(new Error(`Error creating sale: ${err.message}`));
            } else {
              resolve(this.lastID); // Devuelve el ID de la venta recién creada
            }
          });
        });
  
        // Insertar los productos de la venta y actualizar el stock
        for (const productSale of productsSale) {
          await new Promise((resolve, reject) => {
            self.db.run(insertProductQuery, [saleId, productSale.name, productSale.id, productSale.amountCart, productSale.price], function (err) {
              if (err) {
                reject(new Error(`Error adding product to sale: ${err.message}`));
              } else {
                self.db.run(updateStockQuery, [productSale.amountCart, productSale.id], function (errUpdate) {
                  if (errUpdate) {
                    reject(new Error(`Error updating product stock: ${errUpdate.message}`));
                  } else {
                    resolve();
                  }
                });
              }
            });
          });
        }
  
        // Commit la transacción si todo ha tenido éxito
        await new Promise((resolve, reject) => {
          self.db.run('COMMIT', function (err) {
            if (err) {
              reject(new Error(`Error committing transaction: ${err.message}`));
            } else {
              resolve();
            }
          });
        });
  
        return saleId;
      } catch (error) {
        // Rollback la transacción en caso de error
        await new Promise((resolve, reject) => {
          self.db.run('ROLLBACK', function (err) {
            if (err) {
              reject(new Error(`Error rolling back transaction: ${err.message}`));
            } else {
              resolve();
            }
          });
        });
        throw error;
      }
    } catch (error) {
      throw error;
    }
  }  
  async getSales() {    
    const query = `
      SELECT 
        sales.*,
        detailsSale.productId,
        detailsSale.nameProduct,
        detailsSale.amount,
        detailsSale.price
      FROM sales
      LEFT JOIN detailsSale ON sales.id = detailsSale.saleId
    `;
  
    try {
      const salesWithProducts = await new Promise((resolve, reject) => {
        this.db.all(query, [], (err, rows) => {
          if (err) {
            reject(new Error(`Error retrieving sales: ${err.message}`));
          } else {
            // Organizar los resultados en un formato más estructurado
            const organizedSales = rows.reduce((acc, row) => {
              const saleId = row.id;
  
              // Verificar si ya existe la venta en el acumulador
              if (!acc[saleId]) {
                // Si no existe, agregar la venta con los datos básicos
                acc[saleId] = {
                  id: row.id,
                  dateSale: row.dateSale,
                  subtotal: row.subtotal,
                  discount: row.discount,
                  total: row.total,
                  products: []
                };
              }
  
              // Agregar los datos del producto a la venta
              if (row.productId) {
                acc[saleId].products.push({
                  productId: row.productId,
                  nameProduct: row.nameProduct,
                  amount: row.amount,
                  price: row.price
                });
              }
  
              return acc;
            }, {});
  
            // Convertir el objeto a un array de ventas
            const result = Object.values(organizedSales);
  
            resolve(result);
          }
        });
      });
  
      return salesWithProducts;
    } catch (error) {
      throw error;
    }
  }  
}
module.exports = new DatabaseManager();
