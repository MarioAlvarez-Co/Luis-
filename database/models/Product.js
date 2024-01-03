// src/database/models/Product.js
const databaseManager = require('../databaseManager');

class Product {
  constructor(name, price, amount, expirationDate) {
    this.name = name;
    this.price = price;
    this.amount = amount;
    const currentDate = new Date();
    this.registrationDate = currentDate.toISOString().split('T')[0];
    this.expirationDate = expirationDate;
  }

  static async createTable() {
    try {
      await databaseManager.createTable();
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
      return await databaseManager.findProductById(id);
    } catch (error) {
      console.error('Error finding product by ID:', error.message);
    }
  }

  async update() {
    try {
      await databaseManager.updateProduct(this);
    } catch (error) {
      console.error('Error updating product:', error.message);
    }
  }

  async remove() {
    try {
      await databaseManager.removeProduct(this);
    } catch (error) {
      console.error('Error removing product:', error.message);
    }
  }
}

module.exports = Product;
