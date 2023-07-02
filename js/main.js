import { Joyeria } from './joyeria.js';

let productos = [];
let carrito = [];

function init() {
  fetch("../js/productos.json")
    .then(response => response.json())
    .then(data => {
      productos = data;
      carrito = chequearCarritoEnStorage();
      imprimirProductosEnHTML(productos);
    })
    .catch(error => {
      console.error("Error al cargar los productos:", error);
    });
}
function chequearCarritoEnStorage() {
  const contenidoEnStorage = localStorage.getItem("carritoEnStorage");

  if (contenidoEnStorage) {
    const array = JSON.parse(contenidoEnStorage).map((objeto) => {
      const joya = new Joyeria(objeto, objeto.cantidad);
      joya.actualizarPrecioTotal();
      return joya;
    });

    imprimirTabla(array);

    return array;
  }

  return [];
}

function guardarCarritoEnStorage() {
  localStorage.setItem("carritoEnStorage", JSON.stringify(carrito));
}

function imprimirProductosEnHTML(array) {
  const contenedor = document.getElementById("contenedor");
  contenedor.innerHTML = "";

  for (const joya of array) {
    const card = document.createElement("div");
    card.innerHTML = `
      <br>
      <div class="col">
        <div class="card h-100">
          <img src="${joya.img}" class="card-img-top grow" alt="joyamagnolia">
          <div class="card-body">
            <h3 class="card-title">${joya.titulo}</h3>
            <p class="card-text"> CLP $${joya.precio}</p>
          </div>
          <button id="agregar${joya.id}" data-id="${joya.id}" type="button" class="btn btn-dark producto-agregar">Agregar</button>
        </div>
      </div>
    `;

    contenedor.appendChild(card);

    const boton = document.getElementById(`agregar${joya.id}`);
    boton.addEventListener("click", () => agregarAlCarrito(joya.id));
  }
  actualizarBotonesAgregar();
}
let botonesAgregar = document.querySelectorAll('.producto-agregar');
botonesAgregar.forEach((boton) => {
  boton.addEventListener("click", () => {
    const idProducto = boton.getAttribute("data-id");
    agregarbtnCarrito(idProducto);
  });
});
function actualizarBotonesAgregar() {
  botonesAgregar = document.querySelectorAll(".producto-agregar");

  botonesAgregar.forEach(boton => {
      boton.addEventListener("click", agregarbtnCarrito);
  });
}
function agregarbtnCarrito(e) {

  Toastify({
      text: "Producto agregado exitosamente",
      duration: 3000,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "linear-gradient(to right, #4b33a8, #785ce9)",
        borderRadius: "2rem",
        textTransform: "uppercase",
        fontSize: ".75rem"
      },
      offset: {
          x: '1.5rem', // horizontal axis - can be a number or a string indicating unity. eg: '2em'
          y: '1.5rem' // vertical axis - can be a number or a string indicating unity. eg: '2em'
        },
      onClick: function(){} // Callback after click
    }).showToast();
  }

function agregarAlCarrito(idProducto) {
  const joyaCarrito = carrito.find((elemento) => elemento.id === idProducto);

  if (joyaCarrito) {
    const index = carrito.findIndex((elemento) => elemento.id === joyaCarrito.id);
    carrito[index].sumarUnidad();
    carrito[index].actualizarPrecioTotal();
  } else {
    carrito.push(new Joyeria(productos.find((joya) => joya.id === idProducto), 1));
  }

  guardarCarritoEnStorage();
  imprimirTabla(carrito);
}

function eliminarDelCarrito(id) {
  const index = carrito.findIndex((joya) => joya.id === id);

  if (index !== -1) {
    if (carrito[index].cantidad > 1) {
      carrito[index].restarUnidad();
      carrito[index].actualizarPrecioTotal();
    } else {
      carrito.splice(index, 1);
    }

    guardarCarritoEnStorage();
    imprimirTabla(carrito);
  }
}

function eliminarCarrito() {
  carrito = [];
  localStorage.removeItem("carritoEnStorage");

  document.getElementById("carrito").innerHTML = "";
  document.getElementById("acciones-carrito").innerHTML = "";
}

function obtenerPrecioTotal(array) {
  return array.reduce((total, elemento) => total + elemento.precioTotal, 0);
}

function imprimirTabla(array) {
  const precioTotal = obtenerPrecioTotal(array);
  const contenedor = document.getElementById("carrito");
  contenedor.innerHTML = "";

  const tabla = document.createElement("div");
  tabla.innerHTML = `
    <table id="tablaCarrito" class="table table-striped">
      <thead>
        <tr>
          <th>Item</th>
          <th>Cantidad</th>
          <th>Precio (CLP)</th>
          <th>Acción</th>
        </tr>
      </thead>
      <tbody id="bodyTabla">
      </tbody>
    </table>
  `;

  contenedor.appendChild(tabla);

  const bodyTabla = document.getElementById("bodyTabla");

  for (const joya of array) {
    const datos = document.createElement("tr");
    datos.innerHTML = `
      <td>${joya.titulo}</td>
      <td>${joya.cantidad}</td>
      <td>$${joya.precioTotal}</td>
      <td><button id="eliminar${joya.id}" class="btn btn-dark">Eliminar</button></td>
    `;

    bodyTabla.appendChild(datos);

    const botonEliminar = document.getElementById(`eliminar${joya.id}`);
    botonEliminar.addEventListener("click", () => eliminarDelCarrito(joya.id));
  }

  const accionesCarrito = document.getElementById("acciones-carrito");
  accionesCarrito.innerHTML = `
    <h5>Precio Total: CLP $${precioTotal}</h5>
    <button id="vaciarCarrito" class="btn btn-dark">Vaciar Carrito</button>
    <button id="pagarCarrito" class="btn btn-dark">Pagar Carrito</button>
  `;

  const botonPagarCarrito = document.getElementById("pagarCarrito");
  botonPagarCarrito.addEventListener("click", mostrarMensaje);
  const botonVaciarCarrito = document.getElementById("vaciarCarrito");
botonVaciarCarrito.addEventListener("click", eliminarCarrito);
}

function mostrarMensaje() {
  Swal.fire({
    title: '¿Confirmar Compra?',
    text: "¿Desea confirmar su compra?",
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Comprar'
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire(
        'Felicitaciones',
        'Seras dirigido a la pagina de compra',
        'success'
      )
    }
  })
  }
function filtrarBusqueda(e) {
  e.preventDefault();

  const ingreso = document.getElementById("busqueda").value.toLowerCase();
  const arrayFiltrado = productos.filter((elemento) => elemento.tipo.toLowerCase().includes(ingreso));

  imprimirProductosEnHTML(arrayFiltrado);
}

// Eventos
const btnFiltrar = document.getElementById("btnFiltrar");
btnFiltrar.addEventListener("click", filtrarBusqueda);

init();
chequearCarritoEnStorage();





