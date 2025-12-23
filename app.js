// ========================================
// MINI MERCADO - APP.JS
// Todas las funcionalidades del sitio
// ========================================

document.addEventListener("DOMContentLoaded", () => {
  /* PRODUCTOS INICIALES */
  const defaultProducts = [
    {
      name: "Celular Samsung",
      price: 1200,
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
      description: "Celular moderno de gama media",
      category: "Tecnológico"
    },
    {
      name: "Laptop HP",
      price: 3500,
      image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400",
      description: "Ideal para estudio y trabajo",
      category: "Tecnológico"
    },
    {
      name: "Carro de juguete",
      price: 80,
      image: "https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=400",
      description: "Juguete resistente para niños",
      category: "Juguete"
    },
    {
      name: "Auriculares Bluetooth",
      price: 150,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
      description: "Cancelación de ruido activa",
      category: "Tecnológico"
    },
    {
      name: "Camiseta Premium",
      price: 45,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
      description: "100% algodón premium",
      category: "Ropa"
    },
    {
      name: "Zapatillas Deportivas",
      price: 89,
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400",
      description: "Perfectas para running",
      category: "Ropa"
    },
    {
      name: "Pizza Artesanal",
      price: 18,
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400",
      description: "Masa artesanal con ingredientes frescos",
      category: "Comida"
    },
    {
      name: "Hamburguesa Gourmet",
      price: 15,
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",
      description: "Carne 100% premium",
      category: "Comida"
    }
  ];

  if (!localStorage.getItem("products")) {
    localStorage.setItem("products", JSON.stringify(defaultProducts));
  }
  let products = JSON.parse(localStorage.getItem("products"));
  let currentCategory = "Todos";

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
          <button onclick='addToCart(${JSON.stringify(p)})'>Agregar al Carrito</button>
        </div>
      `;
    });
  }
  renderProducts(products);

  /* BÚSQUEDA MEJORADA */
  window.searchProducts = function () {
    const t = document.getElementById("search").value.toLowerCase();
    const filtered = products.filter(p =>
      (p.name.toLowerCase().includes(t) || p.category.toLowerCase().includes(t)) &&
      (currentCategory === "Todos" || p.category === currentCategory)
    );
    renderProducts(filtered);
  };

  /* FILTRAR POR CATEGORÍA */
  window.filterByCategory = function(category) {
    currentCategory = category;
    
    // Actualizar botones activos
    document.querySelectorAll('.category-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    event.target.closest('.category-btn')?.classList.add('active');
    
    // Filtrar productos
    const searchTerm = document.getElementById("search").value.toLowerCase();
    const filtered = products.filter(p => {
      const matchesCategory = category === "Todos" || p.category === category;
      const matchesSearch = !searchTerm || 
        p.name.toLowerCase().includes(searchTerm) || 
        p.category.toLowerCase().includes(searchTerm);
      return matchesCategory && matchesSearch;
    });
    
    renderProducts(filtered);
    
    // Scroll al catálogo
    document.getElementById("catalogo").scrollIntoView({ behavior: 'smooth' });
  };

  /* CARRITO */
  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    document.getElementById("cartCount").textContent = cart.length;
  }
  updateCartCount();

  window.addToCart = function (p) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(p);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    alert("Producto agregado al carrito");
  };

  window.removeFromCart = function(index) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    renderCart();
  };

  window.openCart = function() {
    closeModal();
    overlay.style.display = "block";
    cartModal.style.display = "block";
    renderCart();
  };

  function renderCart() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartItems = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");
    
    if (cart.length === 0) {
      cartItems.innerHTML = "<p style='text-align: center; padding: 20px;'>Tu carrito está vacío</p>";
      cartTotal.textContent = "0";
      return;
    }
    
    let total = 0;
    cartItems.innerHTML = "";
    
    cart.forEach((item, index) => {
      total += item.price;
      cartItems.innerHTML += `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}">
          <div class="cart-item-info">
            <h4>${item.name}</h4>
            <p class="precio">$${item.price}</p>
          </div>
          <button class="remove-btn" onclick="removeFromCart(${index})">✕</button>
        </div>
      `;
    });
    
    cartTotal.textContent = total;
  }

  window.checkout = function() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) {
      alert("Tu carrito está vacío");
      return;
    }
    alert("¡Gracias por tu compra! Total: $" + cart.reduce((sum, item) => sum + item.price, 0));
    localStorage.setItem("cart", JSON.stringify([]));
    updateCartCount();
    closeModal();
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
    
    // Limpiar formulario
    document.getElementById("name").value = "";
    document.getElementById("price").value = "";
    document.getElementById("image").value = "";
    document.getElementById("description").value = "";
    
    alert("¡Producto publicado exitosamente!");
    closeModal();
  };

  /* AUTH */
  window.login = function () {
    firebase.auth()
      .signInWithEmailAndPassword(email.value, password.value)
      .then(() => {
        alert("¡Inicio de sesión exitoso!");
        closeModal();
      })
      .catch(e => alert(e.message));
  };

  window.register = function () {
    firebase.auth()
      .createUserWithEmailAndPassword(regEmail.value, regPassword.value)
      .then(() => {
        alert("¡Cuenta creada exitosamente!");
        closeModal();
      })
      .catch(e => alert(e.message));
  };

  /* MODALES */
  const overlay = document.getElementById("overlay");
  const loginModal = document.getElementById("loginModal");
  const registerModal = document.getElementById("registerModal");
  const sellModal = document.getElementById("sellModal");
  const cartModal = document.getElementById("cartModal");

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
    cartModal.style.display = "none";
  };

  /* CARRUSEL */
  let currentSlide = 0;
  const slides = document.querySelectorAll('.carousel-slide');
  const totalSlides = slides.length;

  // Crear indicadores
  const indicatorsContainer = document.getElementById('carouselIndicators');
  for (let i = 0; i < totalSlides; i++) {
    const indicator = document.createElement('button');
    indicator.classList.add('indicator');
    if (i === 0) indicator.classList.add('active');
    indicator.onclick = () => goToSlide(i);
    indicatorsContainer.appendChild(indicator);
  }

  function showSlide(n) {
    slides.forEach(slide => slide.classList.remove('active'));
    document.querySelectorAll('.indicator').forEach(ind => ind.classList.remove('active'));
    
    currentSlide = (n + totalSlides) % totalSlides;
    slides[currentSlide].classList.add('active');
    document.querySelectorAll('.indicator')[currentSlide].classList.add('active');
  }

  window.nextSlide = function() {
    showSlide(currentSlide + 1);
  };

  window.prevSlide = function() {
    showSlide(currentSlide - 1);
  };

  function goToSlide(n) {
    showSlide(n);
  }

  // Auto-avance del carrusel
  setInterval(() => {
    nextSlide();
  }, 5000);
});

