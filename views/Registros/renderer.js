document.addEventListener("DOMContentLoaded", async () => {
  const ventas = await window.salesApi.registersSales();
  const tablaVentas = document.getElementById("tabla-registro-ventas");
  ventas.reverse();

  let lastDate = null; // Variable para almacenar la última fecha

  // Mostrar las ventas en la tabla
  ventas.forEach((venta) => {
    const fechaVenta = formatearFecha(venta.dateSale);
    
    // Verificar si hay cambio de día
    if (lastDate !== fechaVenta) {
      const filaCambioDia = `
        <tr class="cambio-dia">
          <td colspan="4" style="color:red">Ventas de : ${fechaVenta}</td>
        </tr>
      `;
      tablaVentas.innerHTML += filaCambioDia;
      lastDate = fechaVenta;
    }

    const filaVenta = `
      <tr>
        <td>${venta.id}</td>
        <td>${venta.dateSale}</td>
        <td>$${venta.total.toLocaleString()}</td>
        <td>
          <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#detallesVentaModal"
            onclick="mostrarDetalles(${venta.id})">
            Ver Detalles
          </button>
        </td>
      </tr>
    `;
    tablaVentas.innerHTML += filaVenta;
  });
  // Función para mostrar los detalles de la venta
  window.mostrarDetalles = function (ventaId) {
    // Obtener la venta correspondiente
    const ventaSeleccionada = ventas.find((venta) => venta.id === ventaId);

    // Actualizar la información de la venta en la modal
    document.getElementById("detalle-id-venta").textContent = ventaSeleccionada.id;
    document.getElementById("detalle-fecha-venta").textContent = ventaSeleccionada.dateSale;
    document.getElementById("detalle-total-venta").textContent = `$${ventaSeleccionada.total.toLocaleString()}`;

    // Limpiar la tabla de productos antes de agregar los nuevos detalles
    const detalleProductosVenta = document.getElementById("detalle-productos-venta");
    detalleProductosVenta.innerHTML = "";

    // Mostrar los detalles de los productos en la tabla
    ventaSeleccionada.products.forEach((producto) => {      
      const filaProducto = `
        <tr class="text-center">
          <td>${producto.productId}</td>
          <td>${producto.nameProduct}</td>
          <td>$${producto.price.toLocaleString()}</td>
          <td>${producto.amount}</td>
          <td>$${(producto.price * producto.amount).toLocaleString()}</td>
        </tr>
      `;
      detalleProductosVenta.innerHTML += filaProducto;
    });

    // Abre la modal
    detallesVentaModal.hide()
    const detallesVentaModal = new bootstrap.Modal(document.getElementById("detallesVentaModal"));
    detallesVentaModal.show();
  };
  // Agregar un evento al botón "Producido del Día"
  const producidoDiaButton = document.querySelector('#producidoDia-btn');
  producidoDiaButton.addEventListener('click', () => {
    // Calcular el total de ventas del día
    
     let currentDate= new Date();
     currentDate=formatearFecha(currentDate.toLocaleDateString())
     
      const ventasDia = ventas.filter(venta => formatearFecha(venta.dateSale) === currentDate);
      
      const producidoDia = ventasDia.map((ventas)=>ventas.total)
        
      
      
      
    document.getElementById("totalVentasDia").textContent = `$ ${producidoDia.reduce((acumulator,item)=>acumulator+item).toLocaleString()}`;
  });
});

function calcularTotalVentasDia() {

  
}
function formatearFecha(fechaHoraString){
  const [fechaParte, horaParte] = fechaHoraString.split(', ');

  const [dia, mes, anio] = fechaParte.split('/');
  
  const fechaFormateada = `${anio}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;

return fechaFormateada;
}