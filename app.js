// CARRITO
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


  document.getElementById("total").innerText = total;
}


