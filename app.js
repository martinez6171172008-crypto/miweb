// ========================================
// MINI MERCADO - APP.JS
// Todas las funcionalidades del sitio
// ========================================

document.addEventListener("DOMContentLoaded", () => {
  /* LISTA DE PALABRAS PROHIBIDAS - MODERACIÓN */
  const bannedWords = [
    'estafa', 'replica', 'falso', 'robado', 'ilegal',
    'droga', 'arma', 'hackear', 'clonar', 'piratea'
  ];

  /* VALIDACIÓN DE PRODUCTO - MODERACIÓN AUTOMÁTICA */
  function validateProduct(product) {
    // Rechazar precios irreales
    if (product.price < 1000 || product.price > 50000000) {
      return { valid: false, reason: "Precio fuera de rango permitido (1.000 - 50.000.000 COP)" };
    }
    
    // Buscar palabras prohibidas
    const text = `${product.name} ${product.description}`.toLowerCase();
    for (let word of bannedWords) {
      if (text.includes(word)) {
        return { valid: false, reason: `Contenido prohibido detectado: "${word}"` };
      }
    }
    
    // Productos tecnológicos muy baratos = sospechosos
    if (product.category === "Tecnología" && product.price < 50000) {
      return { valid: false, reason: "Precio sospechosamente bajo para productos tecnológicos" };
    }
    
    return { valid: true };
  }

  /* PRODUCTOS INICIALES */
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

  /* RENDER - Solo mostrar productos aprobados */
  function renderProducts(list) {
    const c = document.getElementById("catalogo");
    if (!c) return;
    c.innerHTML = "";
    
    // Filtrar solo productos aprobados
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

  /* BÚSQUEDA MEJORADA */
  window.searchProducts = function () {
    const t = document.getElementById("search").value.toLowerCase();
    const filtered = products.filter(p =>
      (p.name.toLowerCase().includes(t) || p.category.toLowerCase().includes(t)) &&
      (currentCategory === "Todos" || p.category === currentCategory)
    );
    renderProducts(filtered);
  };

  /* SISTEMA DE REPORTES */
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
    
    // Incrementar contador de reportes
    const productIndex = products.findIndex(p => 
      p.name === product.name && p.seller === product.seller
    );
    
    if (productIndex !== -1) {
      products[productIndex].reports = (products[productIndex].reports || 0) + 1;
      
      // Si tiene 3 o más reportes, marcar para revisión
      if (products[productIndex].reports >= 3) {
        products[productIndex].status = "revision";
        alert("⚠️ Este producto ha sido marcado para revisión por múltiples reportes.");
      } else {
        alert("✅ Reporte enviado. Gracias por ayudar a mantener Merka seguro.");
      }
      
      // Si tiene 5 o más reportes, ocultar automáticamente
      if (products[productIndex].reports >= 5) {
        products[productIndex].status = "bloqueado";
        alert("🛑 Este producto ha sido bloqueado automáticamente.");
      }
      
      localStorage.setItem("products", JSON.stringify(products));
      renderProducts(products);
    }
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

  /* WOMPI CONFIGURATION */
  const WOMPI_PUBLIC_KEY = 'pub_test_G6jNb2RNW3ficsBVl36extOr2y7NZVhh'; // Llave de prueba
  // Cuando tengas tu cuenta real, cámbiala por: pub_prod_TU_LLAVE_AQUI
  
  const SHIPPING_COST = 12000; // $12.000 COP envío estándar

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
    const cartSubtotal = document.getElementById("cartSubtotal");
    const cartShipping = document.getElementById("cartShipping");
    const cartTotal = document.getElementById("cartTotal");
    
    if (cart.length === 0) {
      cartItems.innerHTML = "<p style='text-align: center; padding: 20px; color: #6b7280;'>Tu carrito está vacío</p>";
      if (cartSubtotal) cartSubtotal.textContent = "0";
      if (cartTotal) cartTotal.textContent = "0";
      return;
    }
    
    let subtotal = 0;
    cartItems.innerHTML = "";
    
    cart.forEach((item, index) => {
      subtotal += item.price;
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
            <p class="seller-info-small">Vendedor: ${item.seller}</p>
          </div>
          <button class="remove-btn" onclick="removeFromCart(${index})">✕</button>
        </div>
      `;
    });
    
    const total = subtotal + SHIPPING_COST;
    
    const formattedSubtotal = new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 0
    }).format(subtotal);
    
    const formattedTotal = new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 0
    }).format(total);
    
    if (cartSubtotal) cartSubtotal.textContent = formattedSubtotal;
    if (cartShipping) cartShipping.textContent = new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 0
    }).format(SHIPPING_COST);
    if (cartTotal) cartTotal.textContent = formattedTotal;
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

  /* CHECKOUT CON WOMPI */
  window.proceedToCheckout = function() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    if (cart.length === 0) {
      alert("❌ Tu carrito está vacío");
      return;
    }

    const user = firebase.auth().currentUser;
    if (!user) {
      alert("❌ Debes iniciar sesión para realizar la compra");
      openLogin();
      return;
    }

    // Cerrar carrito y abrir checkout
    document.getElementById("cartModal").style.display = "none";
    document.getElementById("checkoutModal").style.display = "block";
    
    // Renderizar resumen
    renderCheckoutSummary();
  };

  function renderCheckoutSummary() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const summary = document.getElementById("checkoutSummary");
    const checkoutTotal = document.getElementById("checkoutTotal");
    
    let subtotal = 0;
    let html = '';
    
    cart.forEach(item => {
      subtotal += item.price;
      const formatted = new Intl.NumberFormat('es-CO', {
        minimumFractionDigits: 0
      }).format(item.price);
      
      html += `
        <div class="summary-item">
          <span>${item.name}</span>
          <span>${formatted}</span>
        </div>
      `;
    });
    
    const shippingFormatted = new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 0
    }).format(SHIPPING_COST);
    
    const total = subtotal + SHIPPING_COST;
    const totalFormatted = new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 0
    }).format(total);
    
    html += `
      <div class="summary-item">
        <span>Subtotal:</span>
        <span>${new Intl.NumberFormat('es-CO', { minimumFractionDigits: 0 }).format(subtotal)}</span>
      </div>
      <div class="summary-item">
        <span>Envío:</span>
        <span>${shippingFormatted}</span>
      </div>
      <div class="summary-item summary-total">
        <strong>Total:</strong>
        <strong>${totalFormatted}</strong>
      </div>
    `;
    
    summary.innerHTML = html;
    checkoutTotal.textContent = totalFormatted;
  }

  window.payWithWompi = function() {
    // Validar campos
    const name = document.getElementById("buyerName").value.trim();
    const phone = document.getElementById("buyerPhone").value.trim();
    const address = document.getElementById("buyerAddress").value.trim();
    const city = document.getElementById("buyerCity").value.trim();
    const department = document.getElementById("buyerDepartment").value;
    
    if (!name || !phone || !address || !city || !department) {
      alert("❌ Por favor completa todos los campos obligatorios");
      return;
    }

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
    const total = subtotal + SHIPPING_COST;
    
    // Generar referencia única
    const reference = 'MERKA-' + Date.now();
    
    // Guardar orden localmente antes del pago
    const orderData = {
      reference: reference,
      buyer: {
        name: name,
        phone: phone,
        email: firebase.auth().currentUser.email,
        address: address,
        city: city,
        department: department,
        notes: document.getElementById("buyerNotes").value
      },
      products: cart,
      subtotal: subtotal,
      shippingCost: SHIPPING_COST,
      total: total,
      status: 'pending',
      createdAt: Date.now()
    };
    
    localStorage.setItem('pendingOrder', JSON.stringify(orderData));
    
    // Configurar Wompi Checkout
    var checkout = new WidgetCheckout({
      currency: 'COP',
      amountInCents: total * 100, // Convertir a centavos
      reference: reference,
      publicKey: WOMPI_PUBLIC_KEY,
      redirectUrl: window.location.origin + '/payment-success.html', // Página de éxito
      taxInCents: {
        vat: 0,
        consumption: 0
      },
      customerData: {
        email: firebase.auth().currentUser.email,
        fullName: name,
        phoneNumber: phone
      }
    });

    // Abrir widget de Wompi
    checkout.open(function (result) {
      var transaction = result.transaction;
      console.log('Transacción:', transaction);
      
      if (transaction.status === 'APPROVED') {
        completePurchase(transaction, orderData);
      } else if (transaction.status === 'DECLINED') {
        alert('❌ Pago rechazado. Por favor intenta con otro método de pago.');
      } else if (transaction.status === 'ERROR') {
        alert('❌ Error en el pago. Por favor intenta nuevamente.');
      }
    });
  };

  function completePurchase(transaction, orderData) {
    // Actualizar orden con información de transacción
    orderData.transactionId = transaction.id;
    orderData.status = 'paid';
    orderData.paymentMethod = transaction.payment_method_type;
    orderData.paidAt = Date.now();
    
    // Guardar en localStorage (en producción esto iría a Firestore)
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    orders.push(orderData);
    localStorage.setItem("orders", JSON.stringify(orders));
    
    // Limpiar carrito
    localStorage.setItem("cart", JSON.stringify([]));
    localStorage.removeItem('pendingOrder');
    updateCartCount();
    
    // Cerrar modal
    closeModal();
    
    // Mostrar confirmación
    showPaymentSuccess(orderData);
  }

  function showPaymentSuccess(order) {
    const message = `
✅ ¡Pago Exitoso!

Número de orden: ${order.reference}
Total pagado: ${new Intl.NumberFormat('es-CO', { minimumFractionDigits: 0 }).format(order.total)} COP

📦 Tu pedido será enviado a:
${order.buyer.address}
${order.buyer.city}, ${order.buyer.department}

📧 Recibirás un email de confirmación con los detalles del envío.

El vendedor será notificado y procesará tu pedido pronto.
    `;
    
    alert(message);
    
    // Redirigir al inicio
    window.location.href = 'index.html';
  }

  /* VENDER CON VALIDACIÓN */
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

    // VALIDACIÓN AUTOMÁTICA - OPCIÓN B
    const newProduct = {
      name,
      price,
      image: image || "https://via.placeholder.com/300",
      category,
      description,
      seller: user.email,
      status: "pendiente", // Todos los productos empiezan como pendientes
      reports: 0,
      createdAt: Date.now()
    };

    const validation = validateProduct(newProduct);
    
    if (!validation.valid) {
      alert(`❌ Producto rechazado: ${validation.reason}\n\nPor favor, revisa la información e intenta nuevamente.`);
      return;
    }

    // Verificar límite de productos por día para usuarios nuevos
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
    
    // Limpiar formulario
    document.getElementById("name").value = "";
    document.getElementById("price").value = "";
    document.getElementById("image").value = "";
    document.getElementById("description").value = "";
    
    alert("✅ ¡Producto enviado para moderación!\n\nTu producto será revisado y publicado pronto.");
    closeModal();
  };

  /* AUTH */
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

  // Verificar estado de autenticación
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      document.getElementById("userProfile").style.display = "inline";
    } else {
      document.getElementById("userProfile").style.display = "none";
    }
  });

  /* MODALES - ARREGLADOS */
  const overlay = document.getElementById("overlay");
  const loginModal = document.getElementById("loginModal");
  const registerModal = document.getElementById("registerModal");
  const sellModal = document.getElementById("sellModal");
  const cartModal = document.getElementById("cartModal");
  const profileModal = document.getElementById("profileModal");
  const checkoutModal = document.getElementById("checkoutModal");

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
    
    // Actualizar información del perfil
    const emailEl = document.getElementById("profileEmail");
    const memberEl = document.getElementById("memberSince");
    const publishedEl = document.getElementById("productsPublished");
    const soldEl = document.getElementById("productsSold");
    
    if (emailEl) emailEl.textContent = user.email;
    
    if (memberEl && user.metadata.creationTime) {
      const creationDate = new Date(user.metadata.creationTime);
      memberEl.textContent = creationDate.toLocaleDateString('es-CO');
    }
    
    // Contar productos del usuario
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
    if (checkoutModal) checkoutModal.style.display = "none";
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
