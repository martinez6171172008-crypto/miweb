/********* PRODUCTOS *********/
const defaultProducts = [
  { name: "Celular", price: 1200, image: "https://via.placeholder.com/300" },
  { name: "Laptop", price: 3500, image: "https://via.placeholder.com/300" }
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
        <p>$${p.price}</p>
        <button onclick='addToCart(${JSON.stringify(p)})'>Comprar</button>
      </div>`;
  });
}

renderProducts(products);

/********* BUSCAR *********/
function searchProducts() {
  const t = search.value.toLowerCase();
  renderProducts(products.filter(p => p.name.toLowerCase().includes(t)));
}

/********* CARRITO *********/
function addToCart(p) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push(p);
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Agregado al carrito");
}

/********* VENDER *********/
function addProduct() {
  products.push({
    name: name.value,
    price: price.value,
    image: image.value || "https://via.placeholder.com/300"
  });
  localStorage.setItem("products", JSON.stringify(products));
  alert("Producto publicado");
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
