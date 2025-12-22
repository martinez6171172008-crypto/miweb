document.addEventListener("DOMContentLoaded", () => {

/* PRODUCTOS INICIALES */
const defaultProducts = [
  {
    name: "Celular Samsung",
    price: 1200,
    image: "https://via.placeholder.com/300",
    description: "Celular moderno de gama media",
    category: "Tecnológico"
  },
  {
    name: "Laptop HP",
    price: 3500,
    image: "https://via.placeholder.com/300",
    description: "Ideal para estudio y trabajo",
    category: "Tecnológico"
  },
  {
    name: "Carro de juguete",
    price: 80,
    image: "https://via.placeholder.com/300",
    description: "Juguete resistente para niños",
    category: "Juguete"
  }
];

if (!localStorage.getItem("products")) {
  localStorage.setItem("products", JSON.stringify(defaultProducts));
}

let products = JSON.parse(localStorage.getItem("products"));

/* RENDER */
function renderProducts(list) {
  const c = document.getElementById("catalogo");
  if (!c) return;

  c.innerHTML = "";
  list.forEach(p => {
    c.innerHTML += `
      <div class="producto">
        <img src="${p.image}">
        <h3>${p.name}</h3>
        <span class="categoria">${p.category}</span>
        <p class="descripcion">${p.description}</p>
        <p class="precio">$${p.price}</p>
        <button onclick='addToCart(${JSON.stringify(p)})'>Agregar</button>
      </div>
    `;
  });
}

renderProducts(products);

/* BUSCAR */
window.searchProducts = function () {
  const t = document.getElementById("search").value.toLowerCase();
  renderProducts(products.filter(p =>
    p.name.toLowerCase().includes(t) ||
    p.category.toLowerCase().includes(t)
  ));
};

/* CARRITO */
window.addToCart = function (p) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push(p);
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Producto agregado al carrito");
};

/* VENDER */
window.addProduct = function () {
  const name = document.getElementById("name").value;
  const price = Number(document.getElementById("price").value);
  const image = document.getElementById("image").value;
  const category = document.getElementById("category").value;
  const description = document.getElementById("description").value;

  if (!name || !price || !category || !description) {
    alert("Completa todos los campos");
    return;
  }

  products.push({
    name,
    price,
    image: image || "https://via.placeholder.com/300",
    category,
    description
  });

  localStorage.setItem("products", JSON.stringify(products));
  renderProducts(products);
  closeModal();
};

/* AUTH */
window.login = function () {
  firebase.auth()
    .signInWithEmailAndPassword(email.value, password.value)
    .then(closeModal)
    .catch(e => alert(e.message));
};

window.register = function () {
  firebase.auth()
    .createUserWithEmailAndPassword(regEmail.value, regPassword.value)
    .then(closeModal)
    .catch(e => alert(e.message));
};

/* MODALES */
const overlay = document.getElementById("overlay");
const loginModal = document.getElementById("loginModal");
const registerModal = document.getElementById("registerModal");
const sellModal = document.getElementById("sellModal");

window.openLogin = function () {
  closeModal();
  overlay.style.display = "block";
  loginModal.style.display = "block";
};

window.openRegister = function () {
  closeModal();
  overlay.style.display = "block";
  registerModal.style.display = "block";
};

window.openSell = function () {
  closeModal();
  overlay.style.display = "block";
  sellModal.style.display = "block";
};

window.closeModal = function () {
  overlay.style.display = "none";
  loginModal.style.display = "none";
  registerModal.style.display = "none";
  sellModal.style.display = "none";
};

});






