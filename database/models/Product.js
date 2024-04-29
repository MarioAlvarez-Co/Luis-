// src/database/models/Product.js
const databaseManager = require('../databaseManager');

class Product {
  constructor(name, price,cost, amount, expirationDate) {
    this.name = name;
    this.price = price;
    this.cost=cost;
    this.amount = amount;
    const currentDate = new Date();
    this.registrationDate = currentDate.toLocaleString();
    this.expirationDate = expirationDate;
  }

  static async createTable() {
    try {
      await databaseManager.createTables();
    } catch (error) {
      console.error('Error creating table:', error.message);
    }
  }

  async save() {
    try {
      await databaseManager.saveProduct(this);
    } catch (error) {
      console.error('Error saving product:', error.message);
    }
  }

  static async getAll() {
    try {
      const products = await databaseManager.getAllProducts();
      return products;
    } catch (error) {
      console.error('Error fetching all products:', error.message);
    }
  }
  static async findById(id) {
    try {
      const productData = await databaseManager.findProductById(id);
      if (productData) {
        // Crear una instancia de Product con los datos recuperados
        return new Product(
          productData.name,
          productData.price,
          productData.cost,
          productData.amount,
          productData.expirationDate
        );
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error finding product by ID:', error.message);
      throw error;
    }
  }   
  async update() {
    try {
      await databaseManager.updateProduct(this);
    } catch (error) {
      console.error('Error updating product:', error.message);
    }
  }
  async delete(id) {
    
    try {
      if (id) {
       
        await databaseManager.deleteProductById(id);
        console.log('Producto eliminado exitosamente.');
      } else {
        console.error('El producto no tiene un ID asignado. No se puede eliminar.');
      }
    } catch (error) {
      console.error('Error eliminando producto:', error.message);
    }
  }
}
module.exports = Product;
