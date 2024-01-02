const helloButton = document.getElementById('helloButton');

helloButton.addEventListener('click', () => {
  window.electronAPI.sayHello();
});

const { ipcRenderer } = require('electron');

ipcRenderer.on('display-hello', () => {
  alert('Hola Mundo');
});
