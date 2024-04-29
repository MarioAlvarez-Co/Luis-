const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('productosApi', {
  addProduct: (name, price,cost, expirationDate, amount) => {
    return ipcRenderer.invoke('addProduct', { name, price, cost, expirationDate, amount });
  },
  getAllProducts :()=>ipcRenderer.invoke('getAllProducts'),
  setProduct: (id,name, price,cost, expirationDate, amount) =>{
   return ipcRenderer.invoke('setProduct', { id, name, price, cost, expirationDate,amount })
  },
  deleteProduct:(id)=>{
    return ipcRenderer.invoke('deleteProduct',{id})
  }  
});
contextBridge.exposeInMainWorld('salesApi',{
  registerSale:(sale)=>{
    return ipcRenderer.invoke('registerSale',sale)

  },
  registersSales:()=>ipcRenderer.invoke('registersSales')  
  

})