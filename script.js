const items = document.getElementById("items")
const templateCard = document.getElementById("template-card").content
const fragment = document.createDocumentFragment()
let carrito = {}

const suma = (a, b) => a + b;

const iva = (x) => x * 0.16;

document.addEventListener("DOMContentLoaded",() => {
    datosFetch()
})
items.addEventListener ("click", e => {
    agregarCarrito(e)
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
          ) + " $" + " IVA Incluido";
        templateCard.querySelector("img").setAttribute("src", producto.thumbnailUrl);
        templateCard.querySelector(".btn-dark").dataset.id = producto.id

        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)
}

const agregarCarrito = e => {
    // console.log(e.target)
    // console.log(e.target.classList.contains("btn-dark"))
    if(e.target.classList.contains("btn-dark")) {
        setCarrito(e.target.parentElement)
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

    console.log(producto)
}