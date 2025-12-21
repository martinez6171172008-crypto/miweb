/************ PRODUCTOS BASE ************/
const defaultProducts = [
  {
    name: "Celular Samsung",
    price: 1200,
    image: "https://via.placeholder.com/300x200",
    seller: "admin@demo.com"
  },
  {
    name: "Laptop Gamer",
    price: 3500,
    image: "https://via.placeholder.com/300x200",
    seller: "admin@demo.com"
  },
  {
    name: "Audífonos Bluetooth",
    price: 150,
    image: "https://via.placeholder.com/300x200",
    seller: "admin@demo.com"
  }
];

// Inicializar productos si no existen
if (!localStorage.getItem("products")) {
  localStorage.setItem("products", JSON.stringify(defaultProducts));
}

/************ RENDER PRODUCTS (ESTE ES EL QUE PEDÍAS) ************/
function renderProducts(list) {
  const catalogo = document.getElementById("catalogo");
  if (!catalogo) return;

  catalogo.innerHTML = "";

  list.forEach(p => {
    catalogo.innerHTML += `
      <div class="producto">
        <img src="${p.image}">
        <h3>${p.name}</h3>
        <div class="precio">$${p.price}</div>

        <button onclick='addToCart(${JSON.stringify(p)})'>
          Comprar
        </button>
      </div>
    `;
  });
}

/************ MOSTRAR CATÁLOGO ************/
let products = JSON.parse(localStorage.getItem("products")) || [];
renderProducts(products);

/************ BUSCADOR ************/
function searchProducts() {
  const text = document.getElementById("search").value.toLowerCase();
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(text)
  );
  renderProducts(filtered);
}

/************ CARRITO ************/
function addToCart(product) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push(product);
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Producto agregado al carrito");
}

function loadCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const container = document.getElementById("cart");
  let total = 0;

  if (!container) return;

  container.innerHTML = "";

  cart.forEach(p => {
    total += Number(p.price);
    container.innerHTML += `
      <div class="producto">
        <h3>${p.name}</h3>
        <div class="precio">$${p.price}</div>
      </div>
    `;
  });

  document.getElementById("total").innerText = total;
}

/************ VENDER PRODUCTOS ************/
function addProduct() {
  const user = JSON.parse(localStorage.getItem("authUser"));
  if (!user) {
    alert("Debes iniciar sesión");
    return;
  }

  const products = JSON.parse(localStorage.getItem("products")) || [];

  products.push({
    name: name.value,
    price: price.value,
    image: image.value || "https://via.placeholder.com/300x200",
    seller: user.email
  });

  localStorage.setItem("products", JSON.stringify(products));
  alert("Producto publicado");
  location.href = "index.html";
}

/************ LOGIN DEMO (SI NO USAS FIREBASE AÚN) ************/
function register() {
  localStorage.setItem("authUser", JSON.stringify({
    email: regEmail.value
  }));
  alert("Cuenta creada");
  location.href = "login.html";
}

function login() {
  localStorage.setItem("authUser", JSON.stringify({
    email: email.value
  }));
  alert("Bienvenido");
  location.href = "index.html";
}
