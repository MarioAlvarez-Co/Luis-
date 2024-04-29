let allProducts;

document.addEventListener('DOMContentLoaded', async () => {
  try {
    allProducts = await window.productosApi.getAllProducts();
    console.log('Todos los productos:', allProducts);
    updateTable(allProducts);
  } catch (error) {
    console.error('Error al obtener todos los productos desde la vista:', error.message);
  }

  // Agregar un evento al campo de búsqueda
  const searchBar = document.getElementById('search-bar');
  searchBar.addEventListener('input', () => {
    const searchTerm = searchBar.value.toLowerCase();
    const filteredProducts = filterProducts(allProducts, searchTerm);
    updateTable(filteredProducts);
  });
});

function filterProducts(products, searchTerm) {
  return products.filter(product =>
    product.name.toLowerCase().includes(searchTerm)
  );
}

function updateTable(products) {
  const tableBody = document.querySelector('tbody');
  tableBody.classList.add('show');
  tableBody.innerHTML = '';

  products.forEach(product => {
    const row = document.createElement('tr');{      
    }
    row.innerHTML = `
      <td>${product.id}</td>
      <td>${product.name}</td>
      <td>${product.cost}</td>
      <td>$${product.price.toLocaleString()}</td>
      <td>${product.amount}</td>
      <td>${product.expirationDate}</td>
      <td>
        <button type="button" class="btn btn-warning btn-sm edit-button" data-bs-toggle="modal" data-bs-target="#editarProductoModal" data-bs-product-id="${product.id}">
          Editar
        </button>
        <button type="button" class="btn btn-danger btn-sm btn-delete-modal" data-bs-toggle="modal" data-bs-target="#eliminarProductoModal" data-nombre-producto="${product.name}">
          Eliminar
        </button>
      </td>
    `;

    tableBody.appendChild(row);
  });

  // Agregar un evento a cada botón "Editar"
  const editarButtons = document.querySelectorAll('.edit-button');
  editarButtons.forEach(button => {
    
    button.addEventListener('click', (event) => {
      // Obtener el ID del producto a editar
      currentProductId = event.currentTarget.dataset.bsProductId;
      const found = allProducts.find(product => product.id == currentProductId);

      // Rellenar los campos del formulario de edición con los datos del producto
      document.getElementById('nombreProducto').value = found.name;
      document.getElementById('precioProducto').value = found.price;
      document.getElementById('precioCoste').value=found.cost;
      document.getElementById('agregarCantidad').value = found.amount;
      document.getElementById('fechaVencimientoEditarProducto').value = found.expirationDate;
    });
  });
  
  const deleteButtonModal = document.querySelectorAll('.btn-delete-modal');
  const deleteButton=document.querySelector('#btn-delete')
  deleteButtonModal.forEach(button => {
    button.addEventListener('click', (event) => {      
      // Obtener el ID del producto a eliminar
      const productIdToDelete = event.currentTarget.parentElement.parentElement.firstElementChild.innerText;
      const productName=allProducts.find(product=>product.id==productIdToDelete)
      document.querySelector('#nombreProductoEliminar').innerHTML=`${productName.name}`
      // Imprimir el ID del producto en un alert
      deleteButton.addEventListener('click',()=>{
        window.productosApi.deleteProduct(productIdToDelete);
        location.reload()
      })
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const checkboxSinFechaVencimiento = document.getElementById('sinFechaVencimiento');
  const fechaVencimientoInput = document.getElementById('fechaVencimientoNuevoProducto');

  // Agregar un evento de cambio al checkbox
  checkboxSinFechaVencimiento.addEventListener('change', function () {
    // Deshabilitar o habilitar el campo de fecha de vencimiento según el estado del checkbox
    fechaVencimientoInput.disabled = this.checked;
    // Limpiar el valor del campo de fecha de vencimiento si está deshabilitado
    if (this.checked) {
      fechaVencimientoInput.value = '';
    }
  });  
  // Agregar un evento al formulario de agregar nuevo producto
  const formNuevoProducto = document.getElementById('formNuevoProducto');
  formNuevoProducto.addEventListener('submit', async (event) => {
    const nombre = document.getElementById('nombreNuevoProducto').value;
    const precioCoste=parseFloat(document.getElementById('precioCosteNuevoProducto').value)
    const precio = parseFloat(document.getElementById('precioNuevoProducto').value);
    const cantidad = parseInt(document.getElementById('cantidadNuevoProducto').value);
    const fechaVencimiento = document.getElementById('fechaVencimientoNuevoProducto').value;

    try {
      // Llama a la función del proceso principal para agregar el producto
      const newProduct = await window.productosApi.addProduct(nombre, precio, precioCoste,fechaVencimiento, cantidad);

      // Realiza acciones adicionales si es necesario
      console.log('Nuevo producto agregado desde la vista:', newProduct);
    } catch (error) {
      console.error('Error al agregar el producto desde la vista:', error.message);
      // Puedes manejar el error de alguna manera en la interfaz de usuario
    }
  });
});
document.addEventListener('DOMContentLoaded', function() {
  let checkbox = document.getElementById('sinFechaVencimientoEditar');
  let fechaVencimientoInput = document.getElementById('fechaVencimientoEditarProducto');

  // Agregar un event listener al cambio del checkbox
  checkbox.addEventListener('change', function() {
    // Deshabilitar o habilitar el campo de fecha según el estado del checkbox    
    fechaVencimientoInput.value=''
    fechaVencimientoInput.disabled = checkbox.checked;

  });
});

// Agregar un evento al formulario de editar producto
const formEditarProducto = document.getElementById('formEditarProducto');
formEditarProducto.addEventListener('submit', async (event) => {  
  // Obtener el ID del producto actual
  const id = currentProductId;

  // Obtener los valores del formulario
  const nombre = document.getElementById('nombreProducto').value;
  const precio = parseFloat(document.getElementById('precioProducto').value);
  const costo = parseFloat(document.getElementById('precioCoste').value);
  const cantidad = parseInt(document.getElementById('agregarCantidad').value);  
  const fechaVencimiento = document.getElementById('fechaVencimientoEditarProducto').value;


  try {
    // Llama a la función del proceso principal para actualizar el producto
    const updatedProduct = await window.productosApi.setProduct(id, nombre, precio,costo, fechaVencimiento, cantidad);

    // Realiza acciones adicionales si es necesario
    console.log('Producto actualizado desde la vista:', updatedProduct);
  } catch (error) {
    console.error('Error al actualizar el producto desde la vista:', error.message);
    // Puedes manejar el error de alguna manera en la interfaz de usuario
  }
  // Restablecer la variable global después de usarla
  currentProductId = null;
}); 