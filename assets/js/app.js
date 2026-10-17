/**
 * Aplicación Web "La Que No Falla"
 * Sistema de Catálogo, Carrito Interactivo, Calculadora y Checkout por WhatsApp
 */

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

// Estado global de la aplicación
const AppState = {
  cart: [],
  initCart() {
    try {
      const saved = localStorage.getItem('lqnf_cart');
      if (saved) {
        this.cart = JSON.parse(saved);
      }
    } catch (e) {
      console.warn('No se pudo cargar el carrito:', e);
      this.cart = [];
    }
  },
  saveCart() {
    try {
      localStorage.setItem('lqnf_cart', JSON.stringify(this.cart));
    } catch (e) {
      console.warn('No se pudo guardar el carrito:', e);
    }
    updateCartUI();
  },
  addItem(item) {
    const existing = this.cart.find(i => i.id === item.id);
    if (existing) {
      existing.qty += (item.qty || 1);
    } else {
      this.cart.push({
        id: item.id,
        name: item.name,
        price: item.price,
        qty: item.qty || 1,
        image: item.image || 'assets/images/logo-dark.png'
      });
    }
    this.saveCart();
    showToast(`¡Agregaste ${item.name} al pedido! 🍕`);
  },
  updateQty(id, delta) {
    const item = this.cart.find(i => i.id === id);
    if (item) {
      item.qty += delta;
      if (item.qty <= 0) {
        this.cart = this.cart.filter(i => i.id !== id);
      }
      this.saveCart();
    }
  },
  removeItem(id) {
    this.cart = this.cart.filter(i => i.id !== id);
    this.saveCart();
  },
  clearCart() {
    this.cart = [];
    this.saveCart();
  },
  getTotal() {
    return this.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  },
  getItemCount() {
    return this.cart.reduce((sum, item) => sum + item.qty, 0);
  }
};

function initApp() {
  AppState.initCart();
  renderProducts();
  renderCombos();
  renderUpcoming();
  renderFaqs();
  updateCartUI();
  setupEventListeners();
  setupCalculator();
}

// Formateador de precios
function formatCurrency(amount) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0
  }).format(amount);
}

// Renderizar las pre-pizzas individuales
function renderProducts() {
  const container = document.getElementById('products-grid');
  if (!container) return;

  container.innerHTML = CONFIG.products.map(p => `
    <article class="bg-zinc-900/90 rounded-2xl overflow-hidden border border-zinc-800 hover:border-[#ff2d55]/60 transition-all duration-300 shadow-xl flex flex-col group glow-card">
      <div class="relative overflow-hidden aspect-[4/3] bg-zinc-950">
        <img 
          id="img-${p.id}"
          src="${p.image}" 
          alt="${p.name}" 
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-70"></div>
        
        <span class="absolute top-3 left-3 bg-[#ff2d55] text-white text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-lg">
          ${p.badge}
        </span>

        <!-- Botón para alternar foto horneada / real del taller -->
        <button 
          onclick="toggleProductPhoto('${p.id}', '${p.image}', '${p.realImage}')"
          class="absolute top-3 right-3 bg-zinc-950/80 hover:bg-zinc-900 text-zinc-300 hover:text-white text-xs px-2.5 py-1 rounded-lg border border-zinc-700/60 backdrop-blur-md transition flex items-center gap-1.5"
          title="Ver cómo viene la prepizza lista"
        >
          <i class="fa-solid fa-camera-rotate text-amber-400"></i>
          <span class="text-[11px] font-medium" id="toggle-label-${p.id}">Ver real</span>
        </button>

        <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-amber-200 bg-zinc-950/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-zinc-800">
          <span><i class="fa-solid fa-bread-slice mr-1 text-[#ff2d55]"></i> Harina con Masa Madre</span>
          <span><i class="fa-solid fa-clock mr-1 text-amber-400"></i> Horno: 10 min</span>
        </div>
      </div>
      
      <div class="p-6 flex-1 flex flex-col justify-between">
        <div>
          <div class="flex items-start justify-between gap-2 mb-2">
            <h3 class="font-serif text-2xl font-bold text-zinc-100 group-hover:text-amber-400 transition-colors">
              ${p.name}
            </h3>
          </div>
          <p class="text-xs font-semibold text-[#ff2d55] mb-3 tracking-wide">
            <i class="fa-solid fa-fire mr-1 text-amber-400"></i> ${p.highlight}
          </p>
          <p class="text-zinc-300 text-sm leading-relaxed mb-6">
            ${p.description}
          </p>
        </div>

        <div class="pt-4 border-t border-zinc-800 flex items-center justify-between">
          <div>
            <span class="text-[11px] text-zinc-400 uppercase tracking-wider block font-medium">Precio por unidad</span>
            <span class="text-2xl font-black text-amber-400 font-mono">${formatCurrency(p.price)}</span>
          </div>
          <button 
            onclick="handleAddToCart('${p.id}')"
            class="inline-flex items-center gap-2 bg-gradient-to-r from-[#ff2d55] to-rose-600 hover:from-rose-500 hover:to-rose-600 text-white font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-rose-950/50 transform active:scale-95 transition-all text-sm"
          >
            <i class="fa-solid fa-plus"></i> Sumar al Pedido
          </button>
        </div>
      </div>
    </article>
  `).join('');
}

// Alternar entre foto gourmet y foto real del folleto
function toggleProductPhoto(productId, gourmetSrc, realSrc) {
  const imgEl = document.getElementById(`img-${productId}`);
  const labelEl = document.getElementById(`toggle-label-${productId}`);
  if (!imgEl || !labelEl) return;

  if (imgEl.src.includes(realSrc)) {
    imgEl.src = gourmetSrc;
    labelEl.textContent = "Ver real";
  } else {
    imgEl.src = realSrc;
    labelEl.textContent = "Ver horneada";
  }
}

// Renderizar combos y promociones
function renderCombos() {
  const container = document.getElementById('combos-grid');
  if (!container) return;

  container.innerHTML = CONFIG.combos.map(c => `
    <article class="relative bg-zinc-900/90 rounded-2xl p-6 border ${c.popular ? 'border-[#ff2d55] ring-2 ring-[#ff2d55]/30' : 'border-zinc-800'} hover:border-amber-400/60 transition-all shadow-xl flex flex-col justify-between glow-card">
      ${c.popular ? `
        <div class="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#ff2d55] to-amber-500 text-white text-[11px] font-black uppercase tracking-widest px-4 py-1 rounded-full shadow-lg">
          ${c.badge}
        </div>
      ` : ''}

      <div>
        <div class="flex justify-between items-start mb-3">
          <span class="text-xs font-bold uppercase tracking-wider ${c.popular ? 'bg-rose-950/60 text-rose-300 border border-rose-800/60' : 'bg-zinc-800 text-zinc-300'} px-2.5 py-1 rounded-md">
            ${c.badge}
          </span>
          ${c.originalPrice ? `
            <span class="text-xs line-through text-zinc-500 font-mono font-semibold">
              ${formatCurrency(c.originalPrice)}
            </span>
          ` : ''}
        </div>

        <h3 class="font-serif text-2xl font-bold text-zinc-100 mb-1">
          ${c.name}
        </h3>
        <p class="text-amber-400 text-sm font-semibold mb-3">
          ${c.subtitle}
        </p>
        <p class="text-zinc-300 text-sm mb-5 leading-relaxed">
          ${c.description}
        </p>

        <div class="bg-zinc-950/70 rounded-xl p-3 border border-zinc-800 mb-6 space-y-2">
          <span class="text-[11px] font-semibold uppercase text-zinc-400 block tracking-wide">Incluye en tu pack:</span>
          ${c.itemsIncluded.map(item => `
            <div class="text-xs text-zinc-200 flex items-center gap-2">
              <i class="fa-solid fa-circle-check text-emerald-400 text-[11px]"></i>
              <span>${item}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="pt-4 border-t border-zinc-800 flex items-center justify-between">
        <div>
          <span class="text-[11px] text-zinc-400 uppercase tracking-wider block font-medium">Total Promo</span>
          <span class="text-2xl font-black text-amber-400 font-mono">${formatCurrency(c.price)}</span>
        </div>
        <button 
          onclick="handleAddComboToCart('${c.id}')"
          class="inline-flex items-center gap-2 ${c.popular ? 'bg-gradient-to-r from-[#ff2d55] to-rose-600 hover:from-rose-500 hover:to-rose-600 text-white font-black shadow-lg shadow-rose-950/50' : 'bg-zinc-800 hover:bg-zinc-700 text-white font-bold'} px-4 py-2.5 rounded-xl shadow transition-all text-sm active:scale-95"
        >
          <i class="fa-solid fa-cart-plus"></i> Pedir Combo
        </button>
      </div>
    </article>
  `).join('');
}

// Renderizar próximos lanzamientos
function renderUpcoming() {
  const container = document.getElementById('upcoming-grid');
  if (!container) return;

  container.innerHTML = CONFIG.upcoming.map(u => `
    <div class="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 transition flex flex-col justify-between">
      <div>
        <div class="inline-block text-[10px] font-black uppercase tracking-wider text-[#ff2d55] bg-rose-950/50 border border-rose-800/40 px-2.5 py-0.5 rounded-full mb-3">
          ${u.tag}
        </div>
        <h4 class="font-serif text-lg font-bold text-zinc-200 mb-2">${u.name}</h4>
        <p class="text-zinc-400 text-xs leading-relaxed">${u.desc}</p>
      </div>
    </div>
  `).join('');
}

// Renderizar FAQs
function renderFaqs() {
  const container = document.getElementById('faqs-container');
  if (!container) return;

  container.innerHTML = CONFIG.faqs.map((faq, index) => `
    <div class="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900/60 hover:border-zinc-700 transition">
      <button 
        onclick="toggleFaq(${index})" 
        class="w-full text-left px-5 py-4 flex items-center justify-between gap-4 font-semibold text-zinc-200 hover:text-amber-400 transition-colors"
      >
        <span class="flex items-center gap-3">
          <i class="fa-regular fa-circle-question text-[#ff2d55]"></i>
          ${faq.q}
        </span>
        <i id="faq-icon-${index}" class="fa-solid fa-chevron-down text-xs text-zinc-400 transition-transform duration-300"></i>
      </button>
      <div id="faq-content-${index}" class="hidden px-5 pb-5 pt-1 text-sm text-zinc-300 leading-relaxed border-t border-zinc-800/60">
        ${faq.a}
      </div>
    </div>
  `).join('');
}

function toggleFaq(index) {
  const content = document.getElementById(`faq-content-${index}`);
  const icon = document.getElementById(`faq-icon-${index}`);
  if (!content || !icon) return;

  const isHidden = content.classList.contains('hidden');
  content.classList.toggle('hidden');
  if (isHidden) {
    icon.classList.add('rotate-180');
  } else {
    icon.classList.remove('rotate-180');
  }
}

// Handlers de compra
function handleAddToCart(id) {
  const product = CONFIG.products.find(p => p.id === id);
  if (!product) return;
  AppState.addItem({
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.image,
    qty: 1
  });
}

function handleAddComboToCart(id) {
  const combo = CONFIG.combos.find(c => c.id === id);
  if (!combo) return;
  AppState.addItem({
    id: combo.id,
    name: combo.name,
    price: combo.price,
    image: 'assets/images/hero.jpg',
    qty: 1
  });
}

// Actualizar la interfaz del carrito
function updateCartUI() {
  const count = AppState.getItemCount();
  const total = AppState.getTotal();

  // Badges en header y floating button
  const cartBadges = document.querySelectorAll('.cart-badge');
  cartBadges.forEach(badge => {
    badge.textContent = count;
    if (count > 0) {
      badge.classList.remove('hidden');
    } else {
      badge.classList.add('hidden');
    }
  });

  const cartFloats = document.querySelectorAll('.cart-float-btn');
  cartFloats.forEach(btn => {
    if (count > 0) {
      btn.classList.remove('translate-y-28', 'opacity-0', 'pointer-events-none');
      btn.classList.add('translate-y-0', 'opacity-100');
    } else {
      btn.classList.add('translate-y-28', 'opacity-0', 'pointer-events-none');
      btn.classList.remove('translate-y-0', 'opacity-100');
    }
  });

  const cartTotalPreview = document.getElementById('cart-float-total');
  if (cartTotalPreview) {
    cartTotalPreview.textContent = formatCurrency(total);
  }

  // Renderizar items dentro del modal de carrito
  const cartItemsList = document.getElementById('cart-items-list');
  const cartEmptyState = document.getElementById('cart-empty-state');
  const cartFilledState = document.getElementById('cart-filled-state');
  const cartSubtotalEl = document.getElementById('cart-subtotal');

  if (cartItemsList) {
    if (AppState.cart.length === 0) {
      if (cartEmptyState) cartEmptyState.classList.remove('hidden');
      if (cartFilledState) cartFilledState.classList.add('hidden');
      cartItemsList.innerHTML = '';
    } else {
      if (cartEmptyState) cartEmptyState.classList.add('hidden');
      if (cartFilledState) cartFilledState.classList.remove('hidden');
      if (cartSubtotalEl) cartSubtotalEl.textContent = formatCurrency(total);

      cartItemsList.innerHTML = AppState.cart.map(item => `
        <div class="flex items-center gap-3 p-3 bg-zinc-900/90 rounded-xl border border-zinc-800">
          <img src="${item.image}" alt="${item.name}" class="w-14 h-14 object-cover rounded-lg border border-zinc-700/60" />
          <div class="flex-1 min-w-0">
            <h4 class="text-sm font-semibold text-zinc-100 truncate">${item.name}</h4>
            <span class="text-xs text-amber-400 font-mono font-bold">${formatCurrency(item.price)} c/u</span>
          </div>
          <div class="flex items-center gap-2 bg-zinc-950 px-2 py-1 rounded-lg border border-zinc-800">
            <button onclick="AppState.updateQty('${item.id}', -1)" class="w-6 h-6 flex items-center justify-center text-zinc-400 hover:text-white rounded hover:bg-zinc-800 transition">
              <i class="fa-solid fa-minus text-[10px]"></i>
            </button>
            <span class="text-sm font-bold text-zinc-100 min-w-[1.2rem] text-center font-mono">${item.qty}</span>
            <button onclick="AppState.updateQty('${item.id}', 1)" class="w-6 h-6 flex items-center justify-center text-zinc-400 hover:text-white rounded hover:bg-zinc-800 transition">
              <i class="fa-solid fa-plus text-[10px]"></i>
            </button>
          </div>
          <button onclick="AppState.removeItem('${item.id}')" class="text-zinc-500 hover:text-rose-400 p-1 transition" title="Eliminar">
            <i class="fa-regular fa-trash-can text-sm"></i>
          </button>
        </div>
      `).join('');
    }
  }
}

// Abrir y cerrar el modal del carrito
function toggleCartModal(open) {
  const modal = document.getElementById('cart-modal');
  const backdrop = document.getElementById('cart-backdrop');
  const drawer = document.getElementById('cart-drawer');
  if (!modal || !backdrop || !drawer) return;

  if (open) {
    modal.classList.remove('hidden');
    setTimeout(() => {
      backdrop.classList.remove('opacity-0');
      drawer.classList.remove('translate-x-full');
    }, 10);
    document.body.style.overflow = 'hidden';
  } else {
    backdrop.classList.add('opacity-0');
    drawer.classList.add('translate-x-full');
    setTimeout(() => {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
    }, 320);
  }
}

// Enviar pedido por WhatsApp oficial
function submitOrderViaWhatsApp(event) {
  event.preventDefault();
  if (AppState.cart.length === 0) {
    alert('Tu carrito está vacío. Sumá alguna pre-pizza para ordenar.');
    return;
  }

  const nameInput = document.getElementById('order-name');
  const deliveryTypeInput = document.querySelector('input[name="delivery-type"]:checked');
  const addressInput = document.getElementById('order-address');
  const notesInput = document.getElementById('order-notes');
  const paymentInput = document.querySelector('input[name="payment-method"]:checked');

  const customerName = nameInput ? nameInput.value.trim() : 'Cliente';
  const deliveryType = deliveryTypeInput ? deliveryTypeInput.value : 'Retiro en punto coordinado';
  const address = addressInput ? addressInput.value.trim() : '';
  const notes = notesInput ? notesInput.value.trim() : '';
  const paymentMethod = paymentInput ? paymentInput.value : 'A convenir';

  if (!customerName) {
    alert('Por favor, ingresá tu nombre para registrar el pedido.');
    return;
  }

  if (deliveryType === 'Envío a Domicilio' && !address) {
    alert('Por favor, ingresá tu dirección para coordinar el envío.');
    return;
  }

  // Estructura limpia y vendedora para el mensaje
  let message = `🍕 *NUEVO PEDIDO - LA QUE NO FALLA* 🍕\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `👤 *Cliente:* ${customerName}\n`;
  message += `📦 *Modalidad:* ${deliveryType}\n`;
  if (deliveryType === 'Envío a Domicilio' && address) {
    message += `📍 *Dirección:* ${address}\n`;
  }
  message += `💳 *Método de Pago:* ${paymentMethod}\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `📋 *DETALLE DEL PEDIDO:*\n`;

  AppState.cart.forEach(item => {
    message += `▪️ *${item.qty}x* ${item.name} (${formatCurrency(item.price * item.qty)})\n`;
  });

  message += `━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `💰 *TOTAL A ABONAR: ${formatCurrency(AppState.getTotal())}*\n`;

  if (notes) {
    message += `\n📝 *Aclaraciones / Fecha:* ${notes}\n`;
  }

  message += `\n¡Hola! Acabo de hacer este pedido desde la web oficial. ¿Me confirman disponibilidad y horario para coordinar? ¡Muchas gracias! 🙌`;

  const encodedMsg = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${CONFIG.brand.whatsappNumber}?text=${encodedMsg}`;

  // Abrir WhatsApp en pestaña nueva
  window.open(whatsappUrl, '_blank');
  showToast('¡Redirigiendo a WhatsApp para confirmar! 🚀');
}

// Calculadora de pizzas para juntadas y reuniones
function setupCalculator() {
  const adultsInput = document.getElementById('calc-adults');
  const kidsInput = document.getElementById('calc-kids');
  const appetiteSelect = document.getElementById('calc-appetite');
  const resultContainer = document.getElementById('calc-result');
  const btnApplyToCart = document.getElementById('calc-apply-btn');

  if (!adultsInput || !kidsInput || !appetiteSelect || !resultContainer) return;

  function calculate() {
    const adults = Math.max(0, parseInt(adultsInput.value) || 0);
    const kids = Math.max(0, parseInt(kidsInput.value) || 0);
    const appetite = appetiteSelect.value;

    const portionsPerAdult = (appetite === 'buendiente') ? 4 : 3;
    const portionsPerKid = 2;
    const totalPortions = (adults * portionsPerAdult) + (kids * portionsPerKid);
    
    // Una pre-pizza rinde 8 porciones
    const totalPizzas = Math.max(1, Math.ceil(totalPortions / 8));
    const tomatoPizzas = Math.ceil(totalPizzas / 2);
    const fugazzaPizzas = Math.floor(totalPizzas / 2);

    resultContainer.innerHTML = `
      <div class="text-center p-4 bg-zinc-950/90 rounded-xl border border-zinc-800">
        <span class="text-xs uppercase font-bold text-[#ff2d55] tracking-wider block mb-1">
          Estimado para ${adults + kids} personas (~${totalPortions} porciones)
        </span>
        <div class="text-4xl font-serif font-black text-white mb-2">
          ${totalPizzas} <span class="text-xl font-sans font-bold text-amber-400">pre-pizzas</span>
        </div>
        <p class="text-xs text-zinc-300">
          Sugerencia de la casa: <strong class="text-white">${tomatoPizzas} de Tomate</strong> y <strong class="text-white">${fugazzaPizzas} Fugazza</strong>.
        </p>
      </div>
    `;

    if (btnApplyToCart) {
      btnApplyToCart.classList.remove('hidden');
      btnApplyToCart.onclick = () => {
        if (totalPizzas === 4) {
          handleAddComboToCart('combo-juntada');
        } else if (totalPizzas === 6) {
          handleAddComboToCart('combo-stock');
        } else {
          if (tomatoPizzas > 0) {
            AppState.addItem({
              id: 'prepizza-tomate',
              name: 'Pre-pizza de Tomate 🍅',
              price: CONFIG.brand.singlePrice,
              image: 'assets/images/tomate.jpg',
              qty: tomatoPizzas
            });
          }
          if (fugazzaPizzas > 0) {
            AppState.addItem({
              id: 'prepizza-fugazza',
              name: 'Pre-pizza Fugazza 🧅',
              price: CONFIG.brand.singlePrice,
              image: 'assets/images/cebolla.jpg',
              qty: fugazzaPizzas
            });
          }
        }
        toggleCartModal(true);
      };
    }
  }

  adultsInput.addEventListener('input', calculate);
  kidsInput.addEventListener('input', calculate);
  appetiteSelect.addEventListener('change', calculate);
  calculate();
}

// Canal Mayorista directo
function openWholesaleWhatsApp() {
  const message = `¡Hola! Me comunico desde la web de *${CONFIG.brand.name}*. Quiero solicitar la *Lista de Precios Mayorista* y condiciones para comercios/eventos. ¡Gracias!`;
  const url = `https://wa.me/${CONFIG.brand.whatsappNumber}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}

// Modal del Folleto
function toggleFlyerModal(open) {
  const modal = document.getElementById('flyer-modal');
  if (!modal) return;
  if (open) {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  } else {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }
}

// Notificaciones Toast flotantes
function showToast(text) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'bg-zinc-900 text-zinc-100 border border-[#ff2d55]/60 shadow-2xl px-4 py-3 rounded-xl flex items-center gap-3 text-sm animate-bounce-in';
  toast.innerHTML = `
    <i class="fa-solid fa-circle-check text-emerald-400 text-base"></i>
    <span class="font-medium">${text}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('opacity-0', 'transition-opacity', 'duration-300');
    setTimeout(() => toast.remove(), 300);
  }, 2800);
}

// Event Listeners generales
function setupEventListeners() {
  const deliveryRadios = document.querySelectorAll('input[name="delivery-type"]');
  const addressField = document.getElementById('address-field-container');

  deliveryRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      if (addressField) {
        if (e.target.value === 'Envío a Domicilio') {
          addressField.classList.remove('hidden');
        } else {
          addressField.classList.add('hidden');
        }
      }
    });
  });

  const wholesaleBtns = document.querySelectorAll('.wholesale-btn');
  wholesaleBtns.forEach(b => b.addEventListener('click', openWholesaleWhatsApp));
}
