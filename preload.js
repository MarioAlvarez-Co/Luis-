// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('ventasApi', {
  addProduct: (name, price, expirationDate,amount) => {
    return ipcRenderer.invoke('addProduct', { name, price, expirationDate,amount });
  },
});
