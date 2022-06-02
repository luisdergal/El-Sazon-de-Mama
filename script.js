const cards = document.getElementById("cards");
const items = document.getElementById("items");
const footer = document.getElementById("footer");
const templateCard = document.getElementById("template-card").content;
const templateFooter = document.getElementById("template-footer").content;
const templateCarrito = document.getElementById("template-carrito").content;
const fragment = document.createDocumentFragment();
let carrito = {};

/// OPERACIONES PARA DAR RESULTADOS
const suma = (a, b) => a + b;

const iva = (x) => x * 0.16;

///// FETCH 
document.addEventListener("DOMContentLoaded", () => {
  datosFetch();
  if (localStorage.getItem("carrito")) {
    carrito = JSON.parse(localStorage.getItem("carrito"));
    crearCarrito();
  }
});
cards.addEventListener("click", (e) => {
  agregarCarrito(e);
});

items.addEventListener("click", (e) => {
  btnAccion(e);
});

const datosFetch = async () => {
  try {
    const res = await fetch("../menus.json");
    const data = await res.json();
    // console.log(datos)
    crearCard(data);
  } catch (error) {
    console.log(error);
  }
};

///// CREACIÓN DE CARDS EN BOOSTRAP
const crearCard = (data) => {
  data.forEach((producto) => {
    templateCard.querySelector("h5").textContent = producto.menu;
    templateCard.querySelector("p").textContent = suma(
      parseFloat(producto.precio),
      iva(parseFloat(producto.precio))
    );
    templateCard
      .querySelector("img")
      .setAttribute("src", producto.thumbnailUrl);
    templateCard.querySelector(".btn-dark").dataset.id = producto.id;

    const clone = templateCard.cloneNode(true);
    fragment.appendChild(clone);
  });
  cards.appendChild(fragment);
};

//// BOTÓN AGREGAR AL CARRITO
const agregarCarrito = (e) => {
  if (e.target.classList.contains("btn-dark")) {
    setCarrito(e.target.parentElement);
    Toastify({
      text: "Producto agregado al carrito correctamente.",
      duration: 700,
      close: true,
      gravity: "bottom",
      position: "right", 
      stopOnFocus: true, 
      style: {
        background: "linear-gradient(to right, #00b09b, #96c93d)",
      },
    }).showToast();
  }
  e.stopPropagation();
};

const setCarrito = (objeto) => {
  const producto = {
    id: objeto.querySelector(".btn-dark").dataset.id,
    menu: objeto.querySelector("h5").textContent,
    precio: objeto.querySelector("p").textContent,
    cantidad: 1,
  };

  if (carrito.hasOwnProperty(producto.id)) {
    producto.cantidad = carrito[producto.id].cantidad + 1;
  }

  carrito[producto.id] = { ...producto };
  crearCarrito();
};

const crearCarrito = () => {
  items.innerHTML = "";
  Object.values(carrito).forEach((producto) => {
    templateCarrito.querySelector("th").textContent = producto.id;
    templateCarrito.querySelectorAll("td")[0].textContent = producto.menu;
    templateCarrito.querySelectorAll("td")[1].textContent = producto.cantidad;
    templateCarrito.querySelector(".btn-primary").dataset.id = producto.id;
    templateCarrito.querySelector(".btn-danger").dataset.id = producto.id;
    templateCarrito.querySelector("span").textContent =
      (producto.cantidad * producto.precio).toFixed(2);
    const clone = templateCarrito.cloneNode(true);
    fragment.appendChild(clone);
  });
  items.appendChild(fragment);

  cambiarFooter();

  ///// AGREGAR INFO AL LOCAL STORAGE
  localStorage.setItem("carrito", JSON.stringify(carrito));
};



///// Interacción de elecciones de usuario

const cambiarFooter = () => {
  footer.innerHTML = "";
  if (Object.keys(carrito).length === 0) {
    footer.innerHTML = `
        <th scope="row" colspan="5"><span style="font-weight: lighter;">No hay menú seleccionado ¡PIDE ALGO DELICIOSO YA! </span> </th>
        `;
    return;
  }

  //// TOTAL USANDO LIBRERÍAS


  const nCantidad = Object.values(carrito).reduce(
    (acc, { cantidad }) => acc + cantidad,
    0
  );
  const nPrecio = Object.values(carrito).reduce(
    (acc, { cantidad, precio }) => acc + cantidad * precio,
    0
  );

  templateFooter.querySelectorAll("td")[0].textContent = nCantidad;
  templateFooter.querySelector("span").textContent = nPrecio.toFixed(2);

  const clone = templateFooter.cloneNode(true);
  fragment.appendChild(clone);
  footer.appendChild(fragment);

  const btnVaciar = document.getElementById("vaciar-carrito");
  btnVaciar.addEventListener("click", () => {
    carrito = {};
    crearCarrito();
    Toastify({
      text: "Se han eliminado todas las opciones.",
      duration: 3000,
      close: true,
      gravity: "bottom", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "#C84630",
      },
    }).showToast();
  });
};

//// BOTÓN CONFIRMAR PEDIDO.

const btnConfirmar = document.getElementById("btnConfirmar");

btnConfirmar.addEventListener("click", () => {
  if (Object.keys(carrito).length === 0) {
    Swal.fire({
      title: "¡Error!",
      text: "No hay nada seleccionado en el carrito.",
      imageUrl: "https://i.giphy.com/media/PTUK1MSNWmjt5p7VbL/giphy.webp",
      imageWidth: 400,
      imageHeight: 200,
      imageAlt: "Custom image",
    });
  } else
    Swal.fire({
      title: "¿Confirmar pedido? uwu",
      showCancelButton: true,
      confirmButtonText: "Confirmar.",
      cancelButtonText: "Falta algo.",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "¡LISTO! <3",
          text: "TU PEDIDO HA SIDO CONFIRMADO Y ESTÁ SIENDO PREPARADO.",
          imageUrl: "https://i.giphy.com/media/dAzkOoCgoFHtCAdFhe/giphy.webp",
          imageWidth: 400,
          imageHeight: 200,
          imageAlt: "Custom image",
        });
      }
    });
});

const btnAccion = (e) => {
  if (e.target.classList.contains("btn-primary")) {
    const producto = carrito[e.target.dataset.id];
    producto.cantidad++;
    carrito[e.target.dataset.id] = { ...producto };
    crearCarrito();
    Toastify({
      text: "Producto agregado al carrito correctamente.",
      duration: 700,
      close: true,
      gravity: "bottom", 
      position: "right", 
      stopOnFocus: true, 
      style: {
        background: "linear-gradient(to right, #00b09b, #96c93d)",
      },
    }).showToast();
  }

  if (e.target.classList.contains("btn-danger")) {
    const producto = carrito[e.target.dataset.id];
    producto.cantidad--;
    //// OPERADOR TERNARIO
    producto.cantidad === 0
      ? delete carrito[e.target.dataset.id]
      : crearCarrito();
    Toastify({
      text: "Producto eliminado correctamente.",
      duration: 3000,
      close: true,
      gravity: "bottom", 
      position: "right", 
      stopOnFocus: true, 
      style: {
        background: "#C84630",
      },
    }).showToast();
  }
  e.stopPropagation();
};
