// PRODUCTOS BASE
const defaultProducts = [
  {
    name: "Celular Samsung",
    price: 1200,
    image: "https://via.placeholder.com/300x200"
  },
  {
    name: "Laptop Gamer",
    price: 3500,
    image: "https://via.placeholder.com/300x200"
  },
  {
    name: "Audífonos Bluetooth",
    price: 150,
    image: "https://via.placeholder.com/300x200"
  }
];

if (!localStorage.getItem("products")) {
  localStorage.setItem("products", JSON.stringify(defaultProducts));
}

// MOSTRAR PRODUCTOS
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
        <button>Comprar</button>
      </div>
    `;
  });
}

const products = JSON.parse(localStorage.getItem("products")) || [];
renderProducts(products);

// BUSCADOR
function searchProducts() {
  const text = document.getElementById("search").value.toLowerCase();
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(text)
  );
  renderProducts(filtered);
}

// VENDER
function addProduct() {
  const products = JSON.parse(localStorage.getItem("products")) || [];

  products.push({
    name: document.getElementById("name").value,
    price: document.getElementById("price").value,
    image: document.getElementById("image").value || "https://via.placeholder.com/300x200"
  });

  localStorage.setItem("products", JSON.stringify(products));
  alert("Producto publicado");
  location.href = "index.html";
}

// USUARIOS (DEMO)
function register() {
  localStorage.setItem("user", JSON.stringify({
    email: regEmail.value,
    password: regPassword.value
  }));
  alert("Cuenta creada");
  location.href = "login.html";
}

function login() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user && user.email === email.value && user.password === password.value) {
    alert("Bienvenido");
    location.href = "index.html";
  } else {
    alert("Datos incorrectos");
  }
}
