let allProducts;
let shoppingCart = []
let discount = 0;

function createProductCartItem(product, index) {
  const productCart = document.createElement('li');
  productCart.classList.add('list-group-item');
  
  productCart.innerHTML = `
    <div class="row">
      <div class="col-md-2 text-center">
        <span>${product.name}</span>
      </div>
      <div class="col-md-3">
        <div class="input-group">
          <button class="btn btn-outline-secondary" type="button" id="btn-decrementar-${index}">-</button>
          <input type="text" class="form-control text-center d-flex justify-content-center" pattern="[0-9]*" value=${product.amountCart} id="input-cantidad-${index}" min="0" required>
          <button class="btn btn-outline-secondary" type="button" id="btn-incrementar-${index}">+</button>
        </div>
      </div>
      <div class="col-md-2 d-flex justify-content-center">
        <strong id="strong-valor-unitario">$${product.price.toLocaleString()}</strong>
      </div>
      <div class="col-md-2 d-flex justify-content-center">
        <strong id="strong-total">$${(product.price * product.amountCart).toLocaleString()}</strong>
      </div>                
      <div class="col-md-3 d-flex justify-content-center">
        <button type="button" class="btn btn-danger btn-sm" id="btn-eliminar-${index}">Quitar</button>
      </div>
    </div>
  `;

  return productCart;
}

function attachButtonEvents(product, index) {
  // Agregar eventos de clic a los botones de incremento y decremento
  document.getElementById(`btn-incrementar-${index}`).addEventListener('click', (event) => {
    event.stopPropagation();
    product.amountCart++;
    updateProductSale();
  });

  document.getElementById(`btn-decrementar-${index}`).addEventListener('click', (event) => {
    event.stopPropagation();
    // Verifica que la cantidad del carrito no sea menor que 1 antes de decrementar
    if (product.amountCart > 1) {
      // Decrementa la cantidad del carrito
      product.amountCart--;
      // Actualiza la vista
      updateProductSale();
    }
  });

  document.getElementById(`input-cantidad-${index}`).addEventListener('keypress', (event) => {
    event.stopPropagation();
    if (event.key === 'Enter') {
      product.amountCart = event.target.value;
      updateProductSale();
    }
  });

  document.getElementById(`btn-eliminar-${index}`).addEventListener('click', (event) => {
    event.stopPropagation();
    // Obtén el índice del producto en el carrito
    const productIndex = shoppingCart.findIndex(productCart => productCart.id === product.id);
    if (productIndex !== -1) {
      // Elimina el producto del carrito
      shoppingCart.splice(productIndex, 1);
      // Actualiza la vista del carrito
      updateProductSale();
    }
  });
}

function updateProductSale() {
  // Actualiza la vista del carrito
  const cart = document.querySelector('#carrito-lista');
  cart.innerHTML = '';

  if (shoppingCart.length === 0) {
    cart.innerHTML = `<p style="color: grey;">Sin añadir productos</p>`;
  } else {
    shoppingCart.forEach((product, index) => {
      if (product.amountCart > product.amount) {
        const myModal = new bootstrap.Modal(document.getElementById('aviso'));
        document.getElementById('texto-aviso').innerHTML = `la cantidad  máxima de este producto es ${shoppingCart[index].amount}`;
        myModal.show();
        shoppingCart[index].amountCart = shoppingCart[index].amount;
      }

      const productCart = createProductCartItem(product, index);
      cart.appendChild(productCart);

      attachButtonEvents(product, index);
    });
  }
  discount
  updateSale();
}

function updateSale() {
  let totalValor;

  if (shoppingCart.length > 0) {
    let subtotales = shoppingCart.map(product => product.price * product.amountCart);
    totalValor = subtotales.reduce((acumulador, subtotal) => acumulador + subtotal);
  } else {
    totalValor = 0;
  }

  document.querySelector('#total').innerHTML = totalValor.toLocaleString();
}

function createProductRow(product) {
  
  
  const row = document.createElement('tr');
  row.innerHTML = `
    <td>${product.name}</td>
    <td class="text-center">$${product.price.toLocaleString()}</td>
    <td class="text-center">${product.amount}</td>
    <td>
      <button type="button" class="btn añadir-button btn-success btn-sm" data-bs-product-id="${product.id}">
        Añadir
      </button>
    </td>
  `;
  return row;
}

function updateTable(products) {
  const tableBody = document.querySelector('tbody');
  tableBody.innerHTML = '';

  products.forEach(product => {
    if(product.amount!==0){
      const row = createProductRow(product);
      tableBody.appendChild(row);

      // Agregar eventos a los nuevos botones generados
      const addButton = row.querySelector('.añadir-button');
      addButton.addEventListener('click', (event) => {
        const currentProductId = event.currentTarget.dataset.bsProductId;
        const found = allProducts.find(product => product.id == currentProductId);

        if (!shoppingCart.find(product => product.id === found.id)) {
          shoppingCart.unshift({
            ...found,
            amountCart: 1,
          });
        } else {
          const index = shoppingCart.indexOf(shoppingCart.find(product => product.id === found.id));
          shoppingCart[index].amountCart++;
        }

        updateProductSale();
      });
    }    
  });
}

function filterProducts(products, searchTerm) {
  return products.filter(product =>
    product.name.toLowerCase().includes(searchTerm)
  );
}
function createTableBill(product) {
  const row = document.createElement('tr');
  row.innerHTML = `
    <td>${product.name}</td>
    <td class="text-center">$${product.price.toLocaleString()}</td>
    <td class="text-center">${product.amountCart}</td>
    <td class="text-center">${(product.amountCart * product.price).toLocaleString()}</td>
  `;
  return row;
}


async function initialize() {
  document.querySelector('#container').classList.add('show')
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


  const addButtons = document.querySelectorAll('.añadir-button');
  addButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      currentProductId = event.currentTarget.dataset.bsProductId;
      const found = allProducts.find(product => product.id == currentProductId);

      if (!shoppingCart.find(product => product.id === found.id)) {
        shoppingCart.unshift({
          ...found,
          amountCart: 1,
        });
      } else {
        const index = shoppingCart.indexOf(shoppingCart.find(product => product.id === found.id));
        shoppingCart[index].amountCart++;
      }

      updateProductSale();
    });
  });

  const generateDiscount=document.querySelector('#btn-anadir-descuento')
  generateDiscount.addEventListener('click',()=>{
    if(shoppingCart!=0){                        
      let myModal = new bootstrap.Modal(document.getElementById('modalDescuento'));
      myModal.show();
      const addDiscount = document.getElementById('btn-aplicar-descuento');
      addDiscount.addEventListener('click', () => {    
        const descuentoInput = document.getElementById('descuentoInput');
        const valorDescuento = descuentoInput.value;        
        
        if (valorDescuento != 0 ) {
          let costs = shoppingCart.map(product => product.cost*product.amountCart);
          let subtotales = shoppingCart.map(product => product.price * product.amountCart);
          let totalValor = subtotales.reduce((acumulador, subtotal) => acumulador + subtotal);
          
          if(totalValor-valorDescuento<costs.reduce((acumulador, canntidad) => acumulador + canntidad)){
            const aviso = new bootstrap.Modal(document.getElementById('aviso'));
            document.getElementById('texto-aviso').innerHTML = `descuento por encima del precio de costo de los productos`;
            myModal.hide()
            aviso.show()  
            descuentoInput.value=0     ;         
            
          }else{
            discount = valorDescuento;
            descuentoInput.value = 0;
            document.querySelector('#discount').classList.add('show');
            document.querySelector('#discountL').classList.add('show');            
            document.querySelector('#discount').innerHTML = `${discount}`;            
          }          
        }
      })
    }else{
      const myModal = new bootstrap.Modal(document.getElementById('aviso'));
      document.getElementById('texto-aviso').innerHTML = `Debe añadir productos al carrito primero`;
      myModal.show();
    }    
  })

  
  const makeSale = document.querySelector('#btn-realizar-venta ')

  const myModa = new bootstrap.Modal(document.getElementById('make-sale'));
  const table = document.querySelector('#bill-body')
  table.innerHTML='';
  makeSale.addEventListener('click', (event) => {
    if (shoppingCart != 0) {      
      shoppingCart.forEach(product => {
        const row = createTableBill(product);
        table.append(row);
      });
      const amountBill = document.querySelector('#amount-bill')
      let subAmounts = shoppingCart.map(product => product.amountCart);
      amountBill.innerHTML = subAmounts.reduce((acumulador, canntidad) => acumulador + canntidad
      )
      const subtotalBill = document.querySelector('#subtotal-bill')
      let subTotals = shoppingCart.map(product => product.price * product.amountCart);
      subtotalBill.innerHTML = subTotals.reduce((acumulador, canntidad) => acumulador + canntidad).toLocaleString()

      const discountBill=document.querySelector('#discount-bill')
      discountBill.innerHTML=discount.toLocaleString();

      const totalBill=document.querySelector('#total-bill')
      totalBill.innerHTML=( subTotals.reduce((acumulador, canntidad) => acumulador + canntidad)- discount).toLocaleString()
      myModa.show()
      const btnSale = document.querySelector('#sale');
      btnSale.addEventListener('click', (event) => {
        window.salesApi.registerSale({shoppingCart,discount})
        location.reload()
      })
    } else {
      const myModal = new bootstrap.Modal(document.getElementById('aviso'));
      document.getElementById('texto-aviso').innerHTML = `Debe añadir productos al carrito primero `;      
      myModal.show();
    }
  })
}
document.addEventListener('DOMContentLoaded', initialize);