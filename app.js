/********* CARRITO *********/
function loadCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const c = document.getElementById("cart");
  let total = 0;

  c.innerHTML = "";
  cart.forEach(p => {
    total += Number(p.price);
    c.innerHTML += `
      <div class="producto">
        <h4>${p.name}</h4>
        <p>$${p.price}</p>
      </div>
    `;
  });

  document.getElementById("total").innerText = total;
}

/********* LOGOUT *********/
function logout() {
  firebase.auth().signOut().then(() => location.href = "login.html");
}

