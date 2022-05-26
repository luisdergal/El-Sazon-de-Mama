const cards = document.getElementById("cards")
const items = document.getElementById("items")
const footer = document.getElementById("footer")
const templateCard = document.getElementById("template-card").content
const templateFooter = document.getElementById("template-footer").content
const templateCarrito = document.getElementById("template-carrito").content
const fragment = document.createDocumentFragment()
let carrito = {}

const suma = (a, b) => a + b;

const iva = (x) => x * 0.16;


document.addEventListener("DOMContentLoaded",() => {
    datosFetch()
    if(localStorage.getItem("carrito") ) {
       carrito = JSON.parse(localStorage.getItem("carrito"))
       crearCarrito()

    }
})
cards.addEventListener ("click", e => {
    agregarCarrito(e)
})



items.addEventListener("click", e => {
    btnAccion(e)
})

const datosFetch = async () => {
    try {
        const res = await fetch('../menus.json')
        const data = await res.json()
        // console.log(datos)
        crearCard(data)
    } catch (error) {
        console.log(error)
    }
}


const crearCard = data => {
    data.forEach( (producto) => {
        templateCard.querySelector("h5").textContent = producto.menu
        templateCard.querySelector("p").textContent = suma(
            parseFloat(producto.precio), iva(parseFloat(producto.precio))
          );
        templateCard.querySelector("img").setAttribute("src", producto.thumbnailUrl);
        templateCard.querySelector(".btn-dark").dataset.id = producto.id

        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    })
    cards.appendChild(fragment)
}

const agregarCarrito = e => {
    if(e.target.classList.contains("btn-dark")) {
        setCarrito(e.target.parentElement)
        Toastify({
            text: "Producto agregado al carrito correctamente.",
            duration: 700,
            close: true,
            gravity: "bottom", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "linear-gradient(to right, #00b09b, #96c93d)",
            },
          }).showToast();
    }
    e.stopPropagation()
}

const setCarrito = objeto => {
    // console.log(objeto)
    const producto = {
        id: objeto.querySelector(".btn-dark").dataset.id,
        menu: objeto.querySelector("h5").textContent,
        precio: objeto.querySelector("p").textContent,
        cantidad: 1
    }

    if (carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1
    }

    carrito[producto.id] = {...producto}
    crearCarrito()
}

const crearCarrito = () => {
    // console.log(carrito)
    items.innerHTML = ""
    Object.values(carrito).forEach((producto) => {
        templateCarrito.querySelector("th").textContent = producto.id
        templateCarrito.querySelectorAll("td")[0].textContent = producto.menu
        templateCarrito.querySelectorAll("td")[1].textContent = producto.cantidad
        templateCarrito.querySelector(".btn-info").dataset.id = producto.id
        templateCarrito.querySelector(".btn-danger").dataset.id = producto.id
        templateCarrito.querySelector("span").textContent = producto.cantidad * producto.precio;
          const clone = templateCarrito.cloneNode(true)
          fragment.appendChild(clone)
    })
    items.appendChild(fragment)

    cambiarFooter()

    localStorage.setItem("carrito", JSON.stringify(carrito))
}

const cambiarFooter = () => {
    footer.innerHTML = ""
    if(Object.keys(carrito).length === 0)
    {
        footer.innerHTML = `
        <th scope="row" colspan="5">No hay nada seleccionado aún.</th>
        `
        return 
    }

    const nCantidad = Object.values(carrito).reduce( (acc, {cantidad}) => acc + cantidad, 0 )
    const nPrecio = Object.values(carrito).reduce( (acc, {cantidad, precio}) => acc + cantidad * precio, 0)
    

    templateFooter.querySelectorAll("td")[0].textContent = nCantidad
    templateFooter.querySelector("span").textContent = nPrecio

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)

    const btnVaciar = document.getElementById("vaciar-carrito")
    btnVaciar.addEventListener("click", () => {
        carrito = {}
        crearCarrito()
        Toastify({
            text: "Productos eliminados correctamente.",
            duration: 3000,
            close: true,
            gravity: "bottom", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#C84630",
            },
          }).showToast();
    })
}

const btnAccion = e => {
    if(e.target.classList.contains("btn-info")) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad++
        carrito[e.target.dataset.id] = {...producto}
        crearCarrito()
        Toastify({
            text: "Producto agregado al carrito correctamente.",
            duration: 700,
            close: true,
            gravity: "bottom", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "linear-gradient(to right, #00b09b, #96c93d)",
            },
          }).showToast();
        
    }

    if(e.target.classList.contains("btn-danger")) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
        if (producto.cantidad === 0 ) {
            delete carrito[e.target.dataset.id]
        }
        crearCarrito()
        Toastify({
            text: "Producto eliminado correctamente.",
            duration: 3000,
            close: true,
            gravity: "bottom", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#C84630",
            },
          }).showToast();
    }
    e.stopPropagation()
}





