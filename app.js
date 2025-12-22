/********* PRODUCTOS *********/
const defaultProducts = [
  {
    name: "Celular Samsung",
    price: 1200,
    image: "https://via.placeholder.com/300",
    description: "Celular de gama media con excelente rendimiento",
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
        <button onclick='addToCart(${JSON.stringify(p)})'>Agregar al carrito</button>
      </div>
    `;
  });
}

renderProducts(products);

/********* BUSCAR *********/
function searchProducts() {
  const t = document.getElementById("search").value.toLowerCase();
  renderProducts(products.filter(p =>
    p.name.toLowerCase().includes(t) ||
    p.category.toLowerCase().includes(t)
  ));
}

/********* CARRITO *********/
function addToCart(p) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push(p);
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Producto agregado al carrito");
}

function loadCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const c = document.getElementById("cart");
  let total = 0;

  c.innerHTML = "";
  cart.forEach(p => {
    total += p.price;
    c.innerHTML += `
      <div class="producto">
        <h4>${p.name}</h4>
        <p>$${p.price}</p>
      </div>
    `;
  });

  document.getElementById("total").innerText = total;
}

/********* VENDER (FIXED) *********/
function addProduct() {
  const name = document.getElementById("name").value;
  const price = Number(document.getElementById("price").value);
  const image = document.getElementById("image").value;
  const description = document.getElementById("description").value;
  const category = document.getElementById("category").value;

  if (!name || !price || !description || !category) {
    alert("Completa todos los campos");
    return;
  }

  products.push({
    name,
    price,
    image: image || "https://via.placeholder.com/300",
    description,
    category
  });

  localStorage.setItem("products", JSON.stringify(products));
  alert("Producto publicado correctamente");
  location.href = "index.html";
}

/********* AUTH *********/
function register() {
  firebase.auth()
    .createUserWithEmailAndPassword(regEmail.value, regPassword.value)
    .then(() => location.href = "login.html")
    .catch(e => alert(e.message));
}

function login() {
  firebase.auth()
    .signInWithEmailAndPassword(email.value, password.value)
    .then(() => location.href = "index.html")
    .catch(e => alert(e.message));
}
/********* MODALES *********/
const overlay = document.getElementById("overlay");

function openLogin() {
  closeModal();
  overlay.style.display = "block";
  document.getElementById("loginModal").style.display = "block";
}

function openRegister() {
  closeModal();
  overlay.style.display = "block";
  document.getElementById("registerModal").style.display = "block";
}

function openSell() {
  closeModal();
  overlay.style.display = "block";
  document.getElementById("sellModal").style.display = "block";
}

function closeModal() {
  overlay.style.display = "none";
  document.querySelectorAll(".modal").forEach(m => m.style.display = "none");
}




