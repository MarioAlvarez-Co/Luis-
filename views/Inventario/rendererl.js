// rendererl.js
document.addEventListener('DOMContentLoaded', () => {
  const formNuevoProducto = document.getElementById('formNuevoProducto');
  formNuevoProducto.addEventListener('submit', async (event) => {
    event.preventDefault();

    const nombre = document.getElementById('nombreNuevoProducto').value;
    const precio = parseFloat(document.getElementById('precioNuevoProducto').value);
    const cantidad = parseInt(document.getElementById('cantidadNuevoProducto').value);
    const fechaVencimiento = document.getElementById('fechaVencimientoNuevoProducto').value;

    try {
      // Llama a la función del proceso principal para agregar el producto
      const newProduct = await window.ventasApi.addProduct(nombre, precio, fechaVencimiento, cantidad);

      // Realiza acciones adicionales si es necesario
      console.log('Nuevo producto agregado desde la vista:', newProduct);
    } catch (error) {
      console.error('Error al agregar el producto desde la vista:', error.message);
      // Puedes manejar el error de alguna manera en la interfaz de usuario
    }
  });
});
