// USUARIOS
function register() {
  localStorage.setItem("user", JSON.stringify({
    email: document.getElementById("regEmail").value,
    password: document.getElementById("regPassword").value
  }));
  alert("Cuenta creada");
  location.href = "login.html";
}

function login() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (
    user &&
    user.email === document.getElementById("email").value &&
    user.password === document.getElementById("password").value
  ) {
    alert("Bienvenido");
    localStorage.setItem("logged", "true");
    location.href = "index.html";
  } else {
    alert("Datos incorrectos");
  }
}

// PRODUCTOS
function addProduct() {
  const products = JSON.parse(localStorage.getItem("products")) || [];
  products.push({
    name: document.getElementById("name").value,
    price: document.getElementById("price").value
  });
  localStorage.setItem("products", JSON.stringify(products));
  alert("Producto publicado");
  location.href = "index.html";
}

// MOSTRAR CATÁLOGO
const catalogo = document.getElementById("catalogo");
if (catalogo) {
  const products = JSON.parse(localStorage.getItem("products")) || [];
  products.forEach(p => {
    catalogo.innerHTML += `
      <div class="producto">
        <h3>${p.name}</h3>
        <p>$${p.price}</p>
        <button>Comprar</button>
      </div>
    `;
  });
}
