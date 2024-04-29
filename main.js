// main.js
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const Product = require('./database/models/Product');
const Sale=require('./database/models/Sales');


let mainWindow;

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadFile('./views/Ventas/Ventas.html');
  mainWindow.maximize();
}

async function initDatabase() {
  try {
    await Product.createTable();    
    const allProducts = await Product.getAll();
    return allProducts;
  } catch (error) {
    console.error('Error inicializando la base de datos:', error.message);
  }
}

async function getAllProducts() {
  try {
    await Product.createTable();
    const allProducts = await Product.getAll();
    
    return allProducts;
  } catch (error) {
    console.error('Error obteniendo todos los productos:', error.message);
    throw error;  // Puedes lanzar el error para manejarlo en otro lugar si es necesario
  }
}
async function addProduct(product) {
  try {
    const newProduct = new Product(product.name,product.price,product.cost,product.amount,product.expirationDate);
    await newProduct.save();
    return newProduct; // Puedes devolver el producto agregado si es necesario
  } catch (error) {
    console.error('Error al agregar el producto:', error.message);
    throw error; // Puedes lanzar el error para manejarlo en la vista si es necesario
  }
}
async function updateProduct(productData) {
  try {
    // Busca el producto por su ID
    const existingProduct = await Product.findById(productData.id);

    // Actualiza las propiedades del producto existente
    existingProduct.id = productData.id;
    existingProduct.name = productData.name;
    existingProduct.price = productData.price;
    existingProduct.cost=productData.cost;
    existingProduct.amount = productData.amount;
    existingProduct.expirationDate = productData.expirationDate;

    // Llama al método update para guardar los cambios en la base de datos
    await existingProduct.update();

    return existingProduct;
  } catch (error) {
    console.error('Error updating product:', error.message);
    throw error;
  }
}
async function deleteProductById(productId) {
  try {
    const productToDelete = await Product.findById(productId);    
    if (productToDelete) {
      await productToDelete.delete(productId);      
    } else {
      console.error('No se encontró el producto con el ID proporcionado.');
    }
  } catch (error) {
    console.error('Error eliminando el producto:', error.message);
  }
}
async function registerSale(sale){
  try{
     const newSale=  new Sale(sale);
     newSale.processSale();
  }catch(error){
    console.error('Error registrando ventas' , error)

  }
}

app.whenReady().then(() => {
  initDatabase();
  ipcMain.handle('addProduct', async (event, product) => {    
    try {
      const newProduct = await addProduct(product);             
      return newProduct;
    } catch (error) {
      console.error('Error al agregar el producto:', error.message);
      throw error;
    }
  });
  ipcMain.handle('getAllProducts', async () => {
    try {
      const allProducts = await getAllProducts();      
      return allProducts;
    } catch (error) {
      console.error('Error obteniendo todos los productos:', error.message);
      throw error; // Puedes lanzar el error para manejarlo en otro lugar si es necesario
    }
  });
  ipcMain.handle('setProduct', async (event, productData) => {
    try {
      const updatedProduct = await updateProduct(productData);
    } catch (error) {
      console.error('Error updating product:', error.message);
      throw error;
    }
    
  }); 
  ipcMain.handle('deleteProduct', async (event, productId) => {
    try {
      await deleteProductById(productId.id);
      return true; // Puedes devolver cualquier valor que desees indicando el éxito de la operación
    } catch (error) {
      console.error('Error eliminando el producto:', error.message);
      throw error;
    }
  });
  ipcMain.handle('registerSale',async (event,sale)=>{
    try{
       await registerSale(sale);      
    }catch(error){
      console.error('Error Registradno Ventas',error)
      throw error;
    }
  })
  ipcMain.handle('registersSales',async (event)=>{
    try{
        const sales = await Sale.getSales();     
         return sales;
    }catch(error){
      console.error('Error Registradno Ventas',error)
      throw error;
    }
  })    
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});