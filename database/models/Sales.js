// -*- coding: utf-8 -*-
const databaseManager = require('../databaseManager');

class Sales {
  constructor(sale) {
    const currentDate = new Date();
    this.currentDate = currentDate.toLocaleString();
    this.shoppingCart = sale.shoppingCart;
    this.discount = sale.discount;        
  }  

  async processSale() {
    try {            
      // Crear objeto de venta
      const saleData = {
        dateSale: this.currentDate,
        subtotal: this.calculateSubtotal(),
        discount: this.discount,
        total: this.calculateTotal()
      };
      
      // Crear la venta en la base de datos usando el databaseManager directamente
      await databaseManager.createSale(saleData, this.shoppingCart);                  
    } catch (error) {
      throw error;
    }
  }

  calculateSubtotal() {
     const subtotals = this.shoppingCart.map(item => item.price * item.amountCart);
     const subtotal = subtotals.reduce((accumulator, item) => accumulator + item, 0);
     return subtotal;
  }

  calculateTotal() {
    return this.calculateSubtotal() - this.discount;
  }
   static async getSales(){
    return await databaseManager.getSales()
  }
}

module.exports = Sales;
