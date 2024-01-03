// main.js
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const Product = require('./database/models/Product');

let mainWindow;

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadFile('./views/Inventario/Inventario.html');
  mainWindow.maximize();
}

async function initDatabase() {
  try {
    await Product.createTable();
    const allProducts = await Product.getAll();
    console.log('Todos los productos:', allProducts);
  } catch (error) {
    console.error('Error inicializando la base de datos:', error.message);
  }
}

async function getAllProducts() {
  try {
    await Product.createTable();
    const allProducts = await Product.getAll();
    console.log('productos' ,allProducts) 
    return allProducts;
  } catch (error) {
    console.error('Error obteniendo todos los productos:', error.message);
    throw error;  // Puedes lanzar el error para manejarlo en otro lugar si es necesario
  }
}
async function addProduct(product) {
  try {
    const newProduct = new Product(product.name, product.price,product.amount,product.expirationDate);
    await newProduct.save();
    return newProduct; // Puedes devolver el producto agregado si es necesario
  } catch (error) {
    console.error('Error al agregar el producto:', error.message);
    throw error; // Puedes lanzar el error para manejarlo en la vista si es necesario
  }
}


app.whenReady().then(() => {
  initDatabase();
  ipcMain.handle('addProduct', async (event, product) => {    
    try {
      const newProduct = await addProduct(product);
      console.log(newProduct)
      return newProduct;
    } catch (error) {
      console.error('Error al agregar el producto:', error.message);
      throw error;
    }
  });
  ipcMain.handle('getAllProducts', async () => {
    try {
      const allProducts = await Product.getAll(); // Asegúrate de tener un método llamado getAllProducts en tu clase Product o donde sea que esté definido
      return allProducts;
    } catch (error) {
      console.error('Error obteniendo productos en el proceso principal:', error.message);
      throw error; // Puedes lanzar el error para manejarlo en la vista si es necesario
    }
  });
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});