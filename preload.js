const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('ventasApi', {
  addProduct: (name, price, expirationDate,amount) => {
    return ipcRenderer.invoke('addProduct', { name, price, expirationDate,amount });
  },
  getAllProducts :()=>ipcRenderer.invoke('getAllProducts'),
  setProduct: (name, price, expirationDate,amount)=>{
    return ipcRenderer.invoke('setProduct', { name, price, expirationDate,amount });
  }

});
