// rendererl.js
let allProducts;

document.addEventListener('DOMContentLoaded', async () => {
  try {
    allProducts = await window.ventasApi.getAllProducts();

    // Imprime en la consola la información de todos los productos
    console.log('Todos los productos:', allProducts);

    // Hacer algo con la información, por ejemplo, actualizar la tabla
    updateTable(allProducts);
  } catch (error) {
    console.error('Error al obtener todos los productos desde la vista:', error.message);
    // Puedes manejar el error de alguna manera en la interfaz de usuario
  }
});

function updateTable(products) {
  // Aquí puedes actualizar la tabla con la información de los productos
  // Por ejemplo, puedes recorrer la lista de productos y añadir filas a la tabla
  const tableBody = document.querySelector('tbody');
  tableBody.innerHTML = ''; // Limpia el contenido actual de la tabla

  products.forEach(product => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${product.name}</td>
      <td>$${product.price.toLocaleString()}</td>
      <td>${product.amount}</td>
      <td>${product.expirationDate}</td>
      <td>
        <button type="button" class="btn btn-warning btn-sm" data-bs-toggle="modal" data-bs-target="#editarProductoModal">
          Editar
        </button>
        <button type="button" class="btn btn-danger btn-sm" data-bs-toggle="modal" data-bs-target="#eliminarProductoModal" data-nombre-producto="${product.name}">
          Eliminar
        </button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const formNuevoProducto = document.getElementById('formNuevoProducto');
  formNuevoProducto.addEventListener('submit', async (event) => {
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
