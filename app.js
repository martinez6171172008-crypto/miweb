document.addEventListener("DOMContentLoaded", () => {

  const bannedWords = [
    'estafa', 'replica', 'falso', 'robado', 'ilegal',
    'droga', 'arma', 'hackear', 'clonar', 'piratea'
  ];

  function validateProduct(product) {

    if (product.price < 1000 || product.price > 50000000) {
      return { valid: false, reason: "Precio fuera de rango permitido (1.000 - 50.000.000 COP)" };
    }

    const text = `${product.name} ${product.description}`.toLowerCase();
    for (let word of bannedWords) {
      if (text.includes(word)) {
        return { valid: false, reason: `Contenido prohibido detectado: "${word}"` };
      }
    }

    if (product.category === "Tecnología" && product.price < 50000) {
      return { valid: false, reason: "Precio sospechosamente bajo para productos tecnológicos" };
    }
    
    return { valid: true };
  }

  const defaultProducts = [
    {
      name: "Celular Samsung Galaxy",
      price: 1200000,
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
      description: "Celular moderno de gama media con cámara de 48MP",
      category: "Tecnología",
      seller: "tecnostore@merka.com",
      status: "aprobado",
      reports: 0
    },
    {
      name: "Laptop HP 15\"",
      price: 3500000,
      image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400",
      description: "Ideal para estudio y trabajo, 8GB RAM",
      category: "Tecnología",
      seller: "tecnostore@merka.com",
      status: "aprobado",
      reports: 0
    },
    {
      name: "Carro de juguete RC",
      price: 80000,
      image: "https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=400",
      description: "Juguete resistente para niños, control remoto",
      category: "Juguetes",
      seller: "juguetesmx@merka.com",
      status: "aprobado",
      reports: 0
    },
    {
      name: "Auriculares Bluetooth",
      price: 150000,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
      description: "Cancelación de ruido activa, 20h de batería",
      category: "Tecnología",
      seller: "audiozone@merka.com",
      status: "aprobado",
      reports: 0
    },
    {
      name: "Camiseta Deportiva",
      price: 45000,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
      description: "100% algodón premium, tallas S-XL",
      category: "Moda",
      seller: "modacol@merka.com",
      status: "aprobado",
      reports: 0
    },
    {
      name: "Zapatillas Nike Running",
      price: 289000,
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400",
      description: "Perfectas para running, suela Air Max",
      category: "Deportes",
      seller: "sportcenter@merka.com",
      status: "aprobado",
      reports: 0
    },
    {
      name: "Libro 'Cien Años de Soledad'",
      price: 45000,
      image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400",
      description: "Edición aniversario, tapa dura",
      category: "Libros",
      seller: "libreriacol@merka.com",
      status: "aprobado",
      reports: 0
    },
    {
      name: "Perfume Carolina Herrera",
      price: 320000,
      image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400",
      description: "Good Girl, 80ml, original",
      category: "Belleza",
      seller: "bellezatotal@merka.com",
      status: "aprobado",
      reports: 0
    }
  ];

  if (!localStorage.getItem("products")) {
    localStorage.setItem("products", JSON.stringify(defaultProducts));
  }
  let products = JSON.parse(localStorage.getItem("products"));
  let currentCategory = "Todos";

  function renderProducts(list) {
    const c = document.getElementById("catalogo");
    if (!c) return;
    c.innerHTML = "";

    const approvedProducts = list.filter(p => p.status === "aprobado");
    
    approvedProducts.forEach(p => {
      const formattedPrice = new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
      }).format(p.price);
      
      c.innerHTML += `
        <div class="producto">
          <img src="${p.image}">
          <h3>${p.name}</h3>
          <span class="categoria">${p.category}</span>
          <p class="descripcion">${p.description}</p>
          <p class="precio">${formattedPrice}</p>
          <p class="seller-info">Vendedor: ${p.seller || 'Anónimo'}</p>
          <div class="product-actions">
            <button onclick='addToCart(${JSON.stringify(p).replace(/'/g, "\\'")})''>Agregar al Carrito</button>
            <button class="report-btn" onclick='reportProduct(${JSON.stringify(p).replace(/'/g, "\\'")})''>⚠️ Reportar</button>
          </div>
        </div>
      `;
    });
  }
  renderProducts(products);

  window.searchProducts = function () {
    const t = document.getElementById("search").value.toLowerCase();
    const filtered = products.filter(p =>
      (p.name.toLowerCase().includes(t) || p.category.toLowerCase().includes(t)) &&
      (currentCategory === "Todos" || p.category === currentCategory)
    );
    renderProducts(filtered);
  };

  window.reportProduct = function(product) {
    const reason = prompt("¿Por qué reportas este producto?\n\n1. Precio sospechoso\n2. Descripción engañosa\n3. Producto prohibido\n4. Estafa\n5. Otro\n\nEscribe el número:");
    
    if (!reason) return;
    
    const reasons = {
      '1': 'Precio sospechoso',
      '2': 'Descripción engañosa',
      '3': 'Producto prohibido',
      '4': 'Posible estafa',
      '5': 'Otro'
    };

    const productIndex = products.findIndex(p => 
      p.name === product.name && p.seller === product.seller
    );
    
    if (productIndex !== -1) {
      products[productIndex].reports = (products[productIndex].reports || 0) + 1;

      if (products[productIndex].reports >= 3) {
        products[productIndex].status = "revision";
        alert("⚠️ Este producto ha sido marcado para revisión por múltiples reportes.");
      } else {
        alert("✅ Reporte enviado. Gracias por ayudar a mantener Merka seguro.");
      }

      if (products[productIndex].reports >= 5) {
        products[productIndex].status = "bloqueado";
        alert("🛑 Este producto ha sido bloqueado automáticamente.");
      }
      
      localStorage.setItem("products", JSON.stringify(products));
      renderProducts(products);
    }
  };

  window.filterByCategory = function(category) {
    currentCategory = category;
 
    document.querySelectorAll('.category-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    event.target.closest('.category-btn')?.classList.add('active');
  
    const searchTerm = document.getElementById("search").value.toLowerCase();
    const filtered = products.filter(p => {
      const matchesCategory = category === "Todos" || p.category === category;
      const matchesSearch = !searchTerm || 
        p.name.toLowerCase().includes(searchTerm) || 
        p.category.toLowerCase().includes(searchTerm);
      return matchesCategory && matchesSearch;
    });
    
    renderProducts(filtered);

    document.getElementById("catalogo").scrollIntoView({ behavior: 'smooth' });
  };

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
      const formattedPrice = new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
      }).format(item.price);
      
      cartItems.innerHTML += `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}">
          <div class="cart-item-info">
            <h4>${item.name}</h4>
            <p class="precio">${formattedPrice}</p>
          </div>
          <button class="remove-btn" onclick="removeFromCart(${index})">✕</button>
        </div>
      `;
    });
    
    const formattedTotal = new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 0
    }).format(total);
    
    cartTotal.textContent = formattedTotal;
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

  window.addProduct = function () {
    const name = document.getElementById("name").value;
    const price = Number(document.getElementById("price").value);
    const image = document.getElementById("image").value;
    const category = document.getElementById("category").value;
    const description = document.getElementById("description").value;
    
    if (!name || !price || !category || !description) {
      alert("❌ Completa todos los campos obligatorios");
      return;
    }

    const user = firebase.auth().currentUser;
    if (!user) {
      alert("❌ Debes iniciar sesión para publicar productos");
      openLogin();
      return;
    }

    const newProduct = {
      name,
      price,
      image: image || "https://via.placeholder.com/300",
      category,
      description,
      seller: user.email,
      status: "pendiente", 
      reports: 0,
      createdAt: Date.now()
    };

    const validation = validateProduct(newProduct);
    
    if (!validation.valid) {
      alert(`❌ Producto rechazado: ${validation.reason}\n\nPor favor, revisa la información e intenta nuevamente.`);
      return;
    }

    const userProducts = products.filter(p => p.seller === user.email);
    const today = new Date().setHours(0,0,0,0);
    const todayProducts = userProducts.filter(p => {
      const productDate = new Date(p.createdAt).setHours(0,0,0,0);
      return productDate === today;
    });

    if (todayProducts.length >= 5) {
      alert("❌ Has alcanzado el límite de 5 productos por día. Intenta mañana.");
      return;
    }
    
    products.push(newProduct);
    localStorage.setItem("products", JSON.stringify(products));
    
    document.getElementById("name").value = "";
    document.getElementById("price").value = "";
    document.getElementById("image").value = "";
    document.getElementById("description").value = "";
    
    alert("✅ ¡Producto enviado para moderación!\n\nTu producto será revisado y publicado pronto.");
    closeModal();
  };

  window.login = function () {
    firebase.auth()
      .signInWithEmailAndPassword(email.value, password.value)
      .then(() => {
        alert("¡Inicio de sesión exitoso!");
        document.getElementById("userProfile").style.display = "inline";
        closeModal();
      })
      .catch(e => alert(e.message));
  };

  window.register = function () {
    firebase.auth()
      .createUserWithEmailAndPassword(regEmail.value, regPassword.value)
      .then(() => {
        alert("¡Cuenta creada exitosamente!");
        document.getElementById("userProfile").style.display = "inline";
        closeModal();
      })
      .catch(e => alert(e.message));
  };

  window.logout = function() {
    firebase.auth().signOut().then(() => {
      document.getElementById("userProfile").style.display = "none";
      alert("Sesión cerrada");
      closeModal();
    });
  };

  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      document.getElementById("userProfile").style.display = "inline";
    } else {
      document.getElementById("userProfile").style.display = "none";
    }
  });

  const overlay = document.getElementById("overlay");
  const loginModal = document.getElementById("loginModal");
  const registerModal = document.getElementById("registerModal");
  const sellModal = document.getElementById("sellModal");
  const cartModal = document.getElementById("cartModal");
  const profileModal = document.getElementById("profileModal");

  window.openLogin = function () {
    closeModal();
    if (overlay && loginModal) {
      overlay.style.display = "block";
      loginModal.style.display = "block";
    }
  };

  window.openRegister = function () {
    closeModal();
    if (overlay && registerModal) {
      overlay.style.display = "block";
      registerModal.style.display = "block";
    }
  };

  window.openSell = function () {
    const user = firebase.auth().currentUser;
    if (!user) {
      alert("❌ Debes iniciar sesión para vender productos");
      openLogin();
      return;
    }
    closeModal();
    if (overlay && sellModal) {
      overlay.style.display = "block";
      sellModal.style.display = "block";
    }
  };

  window.openCart = function() {
    closeModal();
    if (overlay && cartModal) {
      overlay.style.display = "block";
      cartModal.style.display = "block";
      renderCart();
    }
  };

  window.openProfile = function() {
    const user = firebase.auth().currentUser;
    if (!user) {
      openLogin();
      return;
    }
    
    if (!profileModal) return;

    const emailEl = document.getElementById("profileEmail");
    const memberEl = document.getElementById("memberSince");
    const publishedEl = document.getElementById("productsPublished");
    const soldEl = document.getElementById("productsSold");
    
    if (emailEl) emailEl.textContent = user.email;
    
    if (memberEl && user.metadata.creationTime) {
      const creationDate = new Date(user.metadata.creationTime);
      memberEl.textContent = creationDate.toLocaleDateString('es-CO');
    }

    const userProducts = products.filter(p => p.seller === user.email && p.status === "aprobado");
    if (publishedEl) publishedEl.textContent = userProducts.length;
    if (soldEl) soldEl.textContent = Math.floor(userProducts.length * 0.7); // Simulado
    
    closeModal();
    if (overlay && profileModal) {
      overlay.style.display = "block";
      profileModal.style.display = "block";
    }
  };

  window.closeModal = function () {
    if (overlay) overlay.style.display = "none";
    if (loginModal) loginModal.style.display = "none";
    if (registerModal) registerModal.style.display = "none";
    if (sellModal) sellModal.style.display = "none";
    if (cartModal) cartModal.style.display = "none";
    if (profileModal) profileModal.style.display = "none";
  };


  let currentSlide = 0;
  const slides = document.querySelectorAll('.carousel-slide');
  const totalSlides = slides.length;
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

  setInterval(() => {
    nextSlide();
  }, 5000);
});
