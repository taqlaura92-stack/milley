// ✅ REESTRUCTURACIÓN DE CÓDIGO JavaScript

// ====================================================================
// --- 1. CONFIGURACIÓN Y CONSTANTES ---
// ====================================================================
const COLORES_PASTELES = [
  "#FFD1DC", // Rosa claro
  "#FFDFD3", // Melocotón muy claro
  "#E2F0CB", // Verde menta claro
  "#B5EAD7", // Turquesa pastel
  "#C7CEEA", // Lavanda suave
  "#F1E1FF", // Lavanda muy suave
  "#E0BBE4", // Frambuesa pastel
  "#95B8D1", // Azul cielo suave
  "#D6EADF", // Verde perla
  "#F8B195", // Coral pastel
  "#F67280", // Rosa salmón suave
  "#C06C84"  // Ciruela pastel
];

// ====================================================================
// --- 2. FUNCIONES DE UTILIDAD GENERAL ---
// ====================================================================

/**
 * Carga un componente HTML desde una URL.
 */
function cargarComponente(url, selector) {
  return fetch(url)
    .then(response => {
      if (!response.ok) throw new Error(`No se pudo cargar ${url}`);
      return response.text();
    })
    .then(html => {
      const contenedor = document.querySelector(selector);
      if (contenedor) {
        contenedor.innerHTML = html;
        if (selector === '#navbar-container') {
          setupNavbarLogic();
        }
      } else {
        console.warn(`⚠️ No se encontró el contenedor '${selector}'`);
      }
    })
    .catch(err => console.error(err));
}

/**
 * Lanza confeti con colores pasteles.
 */
function lanzarConfetiPasteles(cantidad = 100) {
  for (let i = 0; i < cantidad; i++) {
    const confeti = document.createElement("div");
    confeti.classList.add("confeti");
    confeti.style.left = Math.random() * 100 + "vw";
    confeti.style.top = "-10px";
    confeti.style.backgroundColor = COLORES_PASTELES[Math.floor(Math.random() * COLORES_PASTELES.length)];
    confeti.style.animationDuration = `${Math.random() * 3 + 2}s`;
    document.body.appendChild(confeti);
    setTimeout(() => confeti.remove(), 4000);
  }
}

/**
 * Lanza emojis desde un elemento.
 */
function lanzarHuellasYHuesos(elementoOrigen) {
  if (!elementoOrigen || typeof gsap === 'undefined') return;
  const rect = elementoOrigen.getBoundingClientRect();
  const emojis = ["🐾", "🦴"];
  for (let i = 0; i < 15; i++) {
    const emoji = document.createElement("div");
    emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    emoji.style.cssText = `
      position: fixed;
      left: ${rect.left + Math.random() * rect.width}px;
      top: ${rect.top + Math.random() * rect.height}px;
      font-size: ${20 + Math.random() * 15}px;
      pointer-events: none;
      user-select: none;
      z-index: 10000;
      color: #FF69B4;
    `;
    document.body.appendChild(emoji);

    gsap.to(emoji, {
      x: (Math.random() - 0.5) * 300,
      y: -(Math.random() * 150 + 100),
      rotation: Math.random() * 360,
      scale: Math.random() * 0.7 + 0.5,
      duration: 2 + Math.random() * 1.5,
      ease: "power2.out",
      onComplete: () => emoji.remove()
    });
  }
}

/**
 * Scroll suave usando GSAP o fallback.
 */
function smoothScroll(targetId, navElement) {
  const targetElement = document.querySelector(targetId);
  if (!targetElement) return;

  const offsetY = navElement?.offsetHeight || 0;

  if (typeof gsap !== 'undefined' && gsap.ScrollToPlugin) {
    gsap.to(window, {
      duration: 1.2,
      scrollTo: { y: targetElement, offsetY },
      ease: "power2.inOut"
    });
  } else {
    window.scrollTo({
      top: targetElement.offsetTop - offsetY,
      behavior: 'smooth'
    });
  }
}


// ====================================================================
// --- 3. INICIALIZACIÓN DE COMPONENTES ---
// ====================================================================

function inicializarUniverso() {
  const canvas = document.getElementById('universo');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h;

  const resize = () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  };
  window.addEventListener('resize', resize);
  resize();

  class Particula {
    constructor() {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.vx = (Math.random() - 0.5) * 0.2;
      this.vy = (Math.random() - 0.5) * 0.2;
      this.size = Math.random() * 20 + 5;
      this.color = COLORES_PASTELES[Math.floor(Math.random() * COLORES_PASTELES.length)] + '80';
    }
    mover() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > w) this.vx *= -1;
      if (this.y < 0 || this.y > h) this.vy *= -1;
    }
    dibujar() {
      const grad = ctx.createRadialGradient(this.x, this.y, this.size * 0.1, this.x, this.y, this.size);
      grad.addColorStop(0, 'rgba(255,255,255,0.9)');
      grad.addColorStop(0.8, this.color);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    }
  }

  const particulas = Array.from({ length: 120 }, () => new Particula());

  const mouse = { x: null, y: null, radius: 120 };
  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  function conectar() {
    for (let a = 0; a < particulas.length; a++) {
      for (let b = a + 1; b < particulas.length; b++) {
        const dx = particulas[a].x - particulas[b].x;
        const dy = particulas[a].y - particulas[b].y;
        const distancia = Math.sqrt(dx * dx + dy * dy);
        if (distancia < 120) {
          const opacidad = 1 - distancia / 120;
          ctx.strokeStyle = `rgba(224, 187, 228, ${opacidad})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particulas[a].x, particulas[a].y);
          ctx.lineTo(particulas[b].x, particulas[b].y);
          ctx.stroke();
        }
      }
    }
  }

  function reaccionMouse() {
    if (mouse.x === null || mouse.y === null) return;
    particulas.forEach(p => {
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const distancia = Math.sqrt(dx * dx + dy * dy);
      if (distancia < mouse.radius) {
        const fuerza = (mouse.radius - distancia) / mouse.radius;
        const angulo = Math.atan2(dy, dx);
        p.vx += Math.cos(angulo) * fuerza * 0.5;
        p.vy += Math.sin(angulo) * fuerza * 0.5;
      }
    });
  }

  function animar() {
    ctx.clearRect(0, 0, w, h);
    particulas.forEach(p => { p.mover(); p.dibujar(); });
    conectar();
    reaccionMouse();
    requestAnimationFrame(animar);
  }

  animar();
}

function inicializarBannerCarrusel() {
  const carruselInner = document.querySelector('.banner-carrusel-inner');
  const slides = document.querySelectorAll('.banner-slide');
  const indicadores = document.querySelectorAll('.banner-indicador');
  const btnPrev = document.querySelector('.banner-btn-prev');
  const btnNext = document.querySelector('.banner-btn-next');

  if (!carruselInner || slides.length === 0) return;

  let currentIndex = 0;
  const totalSlides = slides.length;
  let intervalID = null;

  function goToSlide(index) {
    const newIndex = (index + totalSlides) % totalSlides;
    carruselInner.style.transform = `translateX(-${newIndex * 100}%)`;
    currentIndex = newIndex;
    indicadores.forEach((ind, i) => ind.classList.toggle('activo', i === currentIndex));
  }

  function startAutoPlay() {
    stopAutoPlay();
    intervalID = setInterval(() => goToSlide(currentIndex + 1), 6000);
  }

  function stopAutoPlay() {
    if (intervalID) clearInterval(intervalID);
  }

  btnPrev?.addEventListener('click', () => {
    goToSlide(currentIndex - 1);
    stopAutoPlay();
    startAutoPlay();
    lanzarHuellasYHuesos(btnPrev);
  });

  btnNext?.addEventListener('click', () => {
    goToSlide(currentIndex + 1);
    stopAutoPlay();
    startAutoPlay();
    lanzarHuellasYHuesos(btnNext);
  });

  indicadores.forEach((ind, i) => ind.addEventListener('click', () => {
    goToSlide(i);
    stopAutoPlay();
    startAutoPlay();
  }));

  const carrusel = document.querySelector('.banner-carrusel');
  carrusel?.addEventListener('mouseenter', stopAutoPlay);
  carrusel?.addEventListener('mouseleave', startAutoPlay);

  goToSlide(0);
  startAutoPlay();
}

function setupSmoothScroll() {
  document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      smoothScroll(targetId, document.querySelector('nav'));
    });
  });
}

function initBlogConfetti() {
  document.querySelectorAll(".leer-mas").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      lanzarConfetiPasteles(50);
      const rect = btn.getBoundingClientRect();
      const emojis = ["🐾", "🐶", "🦴"];
      for (let i = 0; i < 25; i++) {
        const conf = document.createElement("div");
        conf.classList.add("confetti");
        conf.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        conf.style.cssText = `
          position: fixed;
          left: ${rect.left + rect.width / 2}px;
          top: ${rect.top + rect.height / 2}px;
          font-size: ${12 + Math.random() * 20}px;
          pointer-events: none;
          user-select: none;
        `;
        document.body.appendChild(conf);
        gsap.to(conf, {
          x: (Math.random() - 0.5) * 300,
          y: -(Math.random() * 300 + 100),
          rotation: Math.random() * 720,
          scale: Math.random() * 0.7 + 0.3,
          duration: 2 + Math.random(),
          ease: "power3.out",
          onComplete: () => conf.remove()
        });
      }
      setTimeout(() => window.location.href = btn.getAttribute('href'), 500);
    });
  });
}
// ====================================================================
// --- 10. INICIALIZACIÓN PRINCIPAL (ACTUALIZADA) ---
// ====================================================================

document.addEventListener('DOMContentLoaded', () => {
    const pokemonListElement = document.getElementById('pokemon-list');
    const searchInput = document.getElementById('pokemon-search-input');
    const modal = document.getElementById('pokemon-detail-modal');
    const modalContent = document.getElementById('modal-body-content');
    const closeBtn = document.querySelector('.close-btn');
    const listaCarrito = document.getElementById('lista-carrito');
    const totalElement = document.getElementById('total');
    const vaciarCarritoBtn = document.getElementById('vaciar-carrito');
    const comprarBtn = document.getElementById('comprar-btn');
    const TOP_POKEMON_IDS = [1, 4, 7, 25, 6, 9, 3, 143, 150, 149];
    let allPokemonData = [];
    let cart = [];

    const POKEMON_PRICE = 9.99;
    const STOCK_MIN = 5;
    const STOCK_MAX = 20;
    let stock = {};

    // Inicializar stock en localStorage
    const initStock = () => {
      let stockData = JSON.parse(localStorage.getItem('pokemonStock')) || {};
      allPokemonData.forEach(p => {
        if (!stockData[p.id]) {
          stockData[p.id] = Math.floor(Math.random() * (STOCK_MAX - STOCK_MIN + 1)) + STOCK_MIN;
        }
      });
      localStorage.setItem('pokemonStock', JSON.stringify(stockData));
      return stockData;
    };

    const renderPokemonCards = (pokemonArray) => {
      pokemonListElement.innerHTML = '';
      if (pokemonArray.length === 0) {
        pokemonListElement.innerHTML = '<p class="no-results">No se encontraron resultados.</p>';
        return;
      }
      pokemonArray.forEach(pokemon => {
        const card = document.createElement('figure');
        card.classList.add('cuento');
        card.setAttribute('data-id', pokemon.id);
        const imageUrl = pokemon.sprites.other['official-artwork'].front_default;
        const types = pokemon.types.map(t => t.type.name).join(', ');
        const stockDisponible = stock[pokemon.id] ?? 0;

        card.innerHTML = `
          <img src="${imageUrl}" alt="${pokemon.name}" />
          <figcaption>
            <h3>#${pokemon.id} - ${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h3>
            <p>Tipo: ${types}</p>
            <p><strong>Precio: $${POKEMON_PRICE.toFixed(2)}</strong></p>
            <p><strong>Stock: ${stockDisponible}</strong></p>
            <div class="card-actions">
              <button class="btn-detail">Ver Detalles</button>
              <button class="btn-add-cart" data-id="${pokemon.id}" ${stockDisponible <= 0 ? 'disabled' : ''}>Añadir al Carrito</button>
            </div>
          </figcaption>
        `;
        pokemonListElement.appendChild(card);
      });
    };

    const renderCart = () => {
      listaCarrito.innerHTML = '';
      let totalPrice = 0;
      
      if (cart.length === 0) {
        listaCarrito.innerHTML = '<li style="text-align: center;">El carrito está vacío.</li>';
      } else {
        cart.forEach(item => {
          const li = document.createElement('li');
          li.setAttribute('data-id', item.id);
          li.innerHTML = `
            <img src="${item.image_url}" alt="${item.name}" class="cart-item-image">
            <div class="item-info">
              <span class="item-name">${item.name}</span>
              <span class="item-price">$${item.price.toFixed(2)} c/u</span>
            </div>
            <div class="item-controls">
              <button class="btn-quantity" data-action="minus">-</button>
              <span>${item.quantity}</span>
              <button class="btn-quantity" data-action="plus">+</button>
              <button class="remove-item-btn"><i class="fas fa-trash-alt"></i></button>
            </div>
          `;
          listaCarrito.appendChild(li);
          totalPrice += item.price * item.quantity;
        });
      }
      totalElement.textContent = totalPrice.toFixed(2);
    };

    const showPokemonDetails = async (pokemonId) => {
      const data = allPokemonData.find(p => p.id == pokemonId);
      if (!data) {
        alert('No se pudo encontrar la información del Pokémon.');
        return;
      }
      const imageUrl = data.sprites.other['official-artwork'].front_default;
      const types = data.types.map(t => t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1)).join(', ');
      const abilities = data.abilities.map(a => a.ability.name.replace('-', ' ')).join(', ');
      const stats = data.stats.map(s => {
        const statName = s.stat.name.replace('-', ' ').toUpperCase();
        return `
          <div class="stat-item">
            <span class="stat-name">${statName}:</span>
            <span class="stat-value">${s.base_stat}</span>
            <div class="stat-bar"><div style="width: ${s.base_stat > 100 ? 100 : s.base_stat}%;"></div></div>
          </div>
        `;
      }).join('');
      
      modalContent.innerHTML = `
        <div class="modal-header">
          <img src="${imageUrl}" alt="${data.name}" class="pokemon-image">
          <h2 class="pokemon-name">${data.name.charAt(0).toUpperCase() + data.name.slice(1)}</h2>
          <p class="pokemon-id">ID: #${data.id}</p>
        </div>
        <div class="modal-body">
          <p><strong>Tipo(s):</strong> ${types}</p>
          <p><strong>Habilidades:</strong> ${abilities}</p>
          <div class="stats-container">
            <h3>Estadísticas Base:</h3>
            ${stats}
          </div>
          <div class="buy-section">
            <p><strong>Precio:</strong> $${POKEMON_PRICE.toFixed(2)}</p>
            <button id="buy-now-btn" class="btn-add-cart" data-id="${pokemonId}">Comprar</button>
          </div>
        </div>
      `;
      modal.style.display = 'block';

      document.getElementById('buy-now-btn').addEventListener('click', () => {
        addToCart(pokemonId);
        modal.style.display = 'none';
      });
    };
    
    const addToCart = (pokemonId) => {
      const stockDisponible = stock[pokemonId];
      if (stockDisponible <= 0) {
        alert("No hay stock disponible para este Pokémon.");
        return;
      }

      const existingItem = cart.find(item => item.id == pokemonId);
      if (existingItem) {
        if (existingItem.quantity < stockDisponible) {
          existingItem.quantity++;
        } else {
          alert("No puedes añadir más, stock limitado.");
        }
      } else {
        const pokemonToAdd = allPokemonData.find(p => p.id == pokemonId);
        if (pokemonToAdd) {
          cart.push({
            id: pokemonToAdd.id,
            name: pokemonToAdd.name.charAt(0).toUpperCase() + pokemonToAdd.name.slice(1),
            price: POKEMON_PRICE,
            quantity: 1,
            image_url: pokemonToAdd.sprites.front_default
          });
        }
      }
      renderCart();
    };

    // Buscador
  

    // Eventos del catálogo
    pokemonListElement.addEventListener('click', (e) => {
      if (e.target.classList.contains('btn-detail')) {
        const card = e.target.closest('.cuento');
        const pokemonId = card.getAttribute('data-id');
        showPokemonDetails(pokemonId);
      }
      if (e.target.classList.contains('btn-add-cart')) {
        const pokemonId = e.target.getAttribute('data-id');
        addToCart(pokemonId);
        alert(`${allPokemonData.find(p => p.id == pokemonId).name.charAt(0).toUpperCase() + allPokemonData.find(p => p.id == pokemonId).name.slice(1)} ha sido añadido al carrito.`);
      }
    });

    // Eventos del carrito
    listaCarrito.addEventListener('click', (e) => {
      const li = e.target.closest('li');
      if (!li) return;

      const pokemonId = li.getAttribute('data-id');
      const itemIndex = cart.findIndex(item => item.id == pokemonId);

      if (e.target.classList.contains('btn-quantity')) {
        const action = e.target.getAttribute('data-action');
        if (action === 'plus') {
          if (cart[itemIndex].quantity < stock[pokemonId]) {
            cart[itemIndex].quantity++;
          } else {
            alert("Stock máximo alcanzado.");
          }
        } else if (action === 'minus') {
          if (cart[itemIndex].quantity > 1) {
            cart[itemIndex].quantity--;
          }
        }
        renderCart();
      } else if (e.target.closest('.remove-item-btn')) {
        cart.splice(itemIndex, 1);
        renderCart();
      }
    });
    
    vaciarCarritoBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        alert('El carrito ya está vacío.');
        return;
      }
      cart = [];
      renderCart();
    });

    // 🧾 Generar boleta PDF
    const generarBoleta = () => {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();

      doc.setFontSize(18);
      doc.text("Boleta de Compra - Pokémon Store", 20, 20);

      doc.setFontSize(12);
      let y = 40;
      let totalFinal = 0;

      cart.forEach(item => {
        const subtotal = (item.price * item.quantity).toFixed(2);
        totalFinal += item.price * item.quantity;
        doc.text(`${item.name} - Cant: ${item.quantity} - $${item.price.toFixed(2)} c/u - Subtotal: $${subtotal}`, 20, y);
        y += 10;
      });

      doc.text(`---------------------------------`, 20, y);
      y += 10;
      doc.setFontSize(14);
      doc.text(`Total: $${totalFinal.toFixed(2)}`, 20, y);

      doc.save("boleta_pokemon.pdf");
    };

    comprarBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        alert('No tienes productos en el carrito para comprar.');
        return;
      }

      // Descontar stock
      cart.forEach(item => {
        stock[item.id] -= item.quantity;
      });
      localStorage.setItem('pokemonStock', JSON.stringify(stock));

      generarBoleta(); // Descargar PDF
      alert('¡Gracias por tu compra! Tu pedido ha sido procesado.');

      cart = [];
      renderCart();
      renderPokemonCards(allPokemonData.filter(p => TOP_POKEMON_IDS.includes(p.id)));
    });

    // Cerrar modal
    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });
const fetchAllPokemon = async () => {
  try {
    // Primero obtenemos la lista básica de Pokémon
    const listResponse = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
    const listData = await listResponse.json();

    // Ahora usamos tu función de Netlify para obtener cada Pokémon uno por uno
    const pokemonPromises = listData.results.map(async (pokemon, index) => {
      const id = index + 1;
      const functionUrl = `/.netlify/functions/getData?id=${id}`;
      const response = await fetch(functionUrl);
      if (!response.ok) throw new Error(`Error al cargar Pokémon ID ${id}`);
      return await response.json();
    });

    allPokemonData = await Promise.all(pokemonPromises);
    stock = initStock();
    renderPokemonCards(allPokemonData.filter(p => TOP_POKEMON_IDS.includes(p.id)));
  } catch (error) {
    console.error("Error al cargar Pokémon usando la función serverless:", error);
    alert("No se pudieron cargar los Pokémon. Revisa la consola.");
  }
};

    fetchAllPokemon();
  });

function animarTituloArcoiris() {
  const h1 = document.getElementById("titulo-arcoiris");
  if (!h1 || typeof gsap === 'undefined') return;
  const texto = h1.textContent;
  h1.innerHTML = "";
  texto.split("").forEach((letra, i) => {
    const span = document.createElement("span");
    if (letra === " ") {
      span.classList.add("space");
      span.textContent = "\u00A0";
    } else {
      span.textContent = letra;
      span.style.color = COLORES_PASTELES[i % COLORES_PASTELES.length];
    }
    h1.appendChild(span);
    gsap.fromTo(span, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: i * 0.08 });
  });
}

function setupScrollAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  gsap.utils.toArray("figure.cuento").forEach((el, i) => {
    gsap.from(el, { opacity: 0, y: 80, duration: 1.2, scrollTrigger: { trigger: el, start: "top 85%" }, delay: i * 0.2 });
  });

  gsap.utils.toArray(".post-card, .video-card").forEach((el, i) => {
    gsap.from(el, { opacity: 0, y: 80, scale: 0.8, duration: 1.2, delay: i * 0.2, ease: "back.out(1.7)", scrollTrigger: { trigger: el, start: "top 90%" } });
  });

  ScrollTrigger.refresh();
}


// ====================================================================
// --- 4. FORMULARIOS Y DATOS ---
// ====================================================================

function setupContactForm() {
  const formulario = document.getElementById("formularioContacto");
  if (!formulario) return;

  formulario.addEventListener("submit", function(e) {
    e.preventDefault();
    const nombre = document.getElementById("nombre");
    const email = document.getElementById("email");
    const telefono = document.getElementById("telefono");
    const edad = document.getElementById("edad");
    const gustos = document.getElementById("gustos");
    const errorNombre = document.getElementById("errorNombre");
    const errorEmail = document.getElementById("errorEmail");
    const errorTelefono = document.getElementById("errorTelefono");
    const errorEdad = document.getElementById("errorEdad");
    const errorGustos = document.getElementById("errorGustos");

    let valido = true;

    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{2,30}$/.test(nombre.value.trim())) {
      errorNombre.textContent = "Nombre no válido.";
      valido = false;
    } else errorNombre.textContent = "";

    if (!/^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(email.value.trim())) {
      errorEmail.textContent = "Correo no válido.";
      valido = false;
    } else errorEmail.textContent = "";

    if (telefono.value.trim() && !/^\+?[\d\s]{7,15}$/.test(telefono.value.trim())) {
      errorTelefono.textContent = "Número no válido.";
      valido = false;
    } else errorTelefono.textContent = "";

    const edadNum = parseInt(edad.value.trim());
    if (isNaN(edadNum) || edadNum < 1 || edadNum > 12) {
      errorEdad.textContent = "Edad debe ser entre 1 y 12.";
      valido = false;
    } else errorEdad.textContent = "";

    if (gustos.value.trim().length < 5) {
      errorGustos.textContent = "Mínimo 5 caracteres.";
      valido = false;
    } else errorGustos.textContent = "";

    if (valido) {
      lanzarConfetiPasteles(80);
      alert("🎉 ¡Mensaje enviado con éxito!");
      formulario.reset();
    }
  });
}

window.suscribirse = function(event) {
  event.preventDefault();
  const email = document.getElementById('newsletter-email').value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    alert(email ? "Correo no válido." : "Ingresa tu correo.");
    return false;
  }
  lanzarConfetiPasteles(75);
  alert(`🎉 ¡Gracias por suscribirte con ${email}!`);
  document.getElementById('newsletter-email').value = '';
  return false;
};

window.votar = function(cuentoId, tipo) {
  let votos = JSON.parse(localStorage.getItem(`votos_${cuentoId}`)) || { likes: 0, dislikes: 0 };
  if (tipo === 'like') votos.likes++;
  else if (tipo === 'dislike') votos.dislikes++;
  localStorage.setItem(`votos_${cuentoId}`, JSON.stringify(votos));
  const el = document.getElementById(`votos-${cuentoId}`);
  if (el) el.textContent = `Likes: ${votos.likes} | Dislikes: ${votos.dislikes}`;
};

window.agregarComentario = function(cuentoId) {
  const textarea = document.getElementById(`comentario-${cuentoId}`);
  const comentario = textarea.value.trim();
  if (comentario) {
    let comentarios = JSON.parse(localStorage.getItem(`comentarios_${cuentoId}`)) || [];
    comentarios.push(comentario);
    localStorage.setItem(`comentarios_${cuentoId}`, JSON.stringify(comentarios));
    const lista = document.getElementById(`comentarios-${cuentoId}`);
    if (lista) {
      const p = document.createElement('p');
      p.textContent = comentario;
      lista.appendChild(p);
      textarea.value = '';
    }
  }
};

function setupCommentForm() {
  const commentForm = document.getElementById('comment-form');
  const commentsGrid = document.getElementById('comments-grid');
  let comments = JSON.parse(localStorage.getItem('comments')) || [];

  if (!commentForm || !commentsGrid) return;

  renderComments();

  commentForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('comment-name').value.trim();
    const description = document.getElementById('comment-description').value.trim();
    const imageUrl = document.getElementById('comment-image-url').value.trim();

    const loadingMessage = document.createElement('div');
    loadingMessage.textContent = '🌟 Creando magia... ¡generando imagen!';
    commentsGrid.prepend(loadingMessage);

    if (imageUrl === '') {
      try {
        let pokemonUrl;
        const pokemonIdOrName = name.toLowerCase().trim();
        const url = `https://pokeapi.co/api/v2/pokemon/${pokemonIdOrName}`;
        if (pokemonIdOrName) {
          const response = await fetch(url);
          if (response.ok) {
            const data = await response.json();
            pokemonUrl = data.sprites.front_default;
            alert(`¡Pokémon encontrado: ${data.name}!`);
          } else {
            alert("Pokémon no encontrado. Usando imagen aleatoria.");
            pokemonUrl = await fetchRandomPokemonImage();
          }
        } else {
          alert("Usando imagen aleatoria.");
          pokemonUrl = await fetchRandomPokemonImage();
        }

        loadingMessage.remove();
        addComment(name, description, pokemonUrl);
      } catch (error) {
        loadingMessage.remove();
        alert("Error al cargar Pokémon. Usando imagen de respaldo.");
        console.error("Error PokeAPI:", error);
        addComment(name, description, 'https://via.placeholder.com/150');
      }
    } else {
      loadingMessage.remove();
      addComment(name, description, imageUrl);
    }
  });

  async function fetchRandomPokemonImage() {
    const randomId = Math.floor(Math.random() * 898) + 1;
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
      const data = await response.json();
      return data.sprites.front_default;
    } catch (error) {
      console.error("Error al obtener Pokémon aleatorio:", error);
      return 'https://via.placeholder.com/150';
    }
  }

  function addComment(name, description, imageUrl) {
    const newComment = {
      name,
      description,
      imageUrl,
      date: new Date().toLocaleDateString('es-ES')
    };
    comments.unshift(newComment);
    localStorage.setItem('comments', JSON.stringify(comments));
    renderComments();
    commentForm.reset();
  }

  function renderComments() {
    commentsGrid.innerHTML = '';
    comments.forEach((comment, index) => createCommentCard(comment, index));
  }

  function createCommentCard(comment, index) {
    const commentCard = document.createElement('div');
    commentCard.classList.add('comment-card');

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-button');
    deleteButton.innerHTML = '&times;';
    deleteButton.addEventListener('click', () => deleteComment(index));

    commentCard.innerHTML = `
      <h3>${comment.name}</h3>
      <p>${comment.description}</p>
      <img src="${comment.imageUrl}" alt="Comentario" style="width:100%;border-radius:8px;">
      <span class="comment-date">${comment.date}</span>
    `;
    commentCard.prepend(deleteButton);
    commentsGrid.appendChild(commentCard);
  }

  function deleteComment(index) {
    comments.splice(index, 1);
    localStorage.setItem('comments', JSON.stringify(comments));
    renderComments();
  }
}

// ====================================================================
// --- 5. FUNCIONES ESPECÍFICAS DEL BLOG ---
// ====================================================================
function inicializarBlog() {
  const gallery = document.getElementById('gallery');
  const board = document.getElementById('board');
  const cuentos = document.getElementById('cuentos');
  const progress = document.getElementById('progress');

  if (!gallery || !board || !cuentos || !progress) {
    console.warn("⚠️ No se encontraron todos los elementos del blog. Inicialización cancelada.");
    return;
  }

  const images = [
    'img/puzzle1.png',
    'img/puzzle2.jpg',
    'img/puzzle3.jpg',
    'img/puzzle5.jpg',
    'img/puzzle6.jpg',
  ];

  const cuentoImages = [
    'img/lamagia.png',
    'img/dalmatascarro.png',
    'img/kikirikik.jpg',
    'img/PERRITOSEN EL COLE.jpg',
    'img/LLAVE.jpg',
    'img/tios.jpg',
  ];

  const cuentosData = [
    'img/lamagia.png',
    'img/dalmatascarro.png',
    'img/kikirikik.jpg',
    'img/PERRITOSEN EL COLE.jpg',
    'img/LLAVE.jpg',
    'img/tios.jpg',
  ];

  let unlocked = [];
  let dragged;

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  function createPuzzle(index) {
    const pieces = Array.from({ length: 9 }, (_, i) => i);
    shuffle(pieces);
    board.innerHTML = '';
    board.dataset.index = index;

    const imageSrc = images[index];

    pieces.forEach((n, i) => {
      const div = document.createElement('div');
      div.className = 'puzzle-piece';
      div.draggable = true;
      div.dataset.index = i;
      div.dataset.value = n;

      const x = (n % 3) * -100;
      const y = Math.floor(n / 3) * -100;
      div.style.backgroundImage = `url(${imageSrc})`;
      div.style.backgroundSize = '300px 300px';
      div.style.backgroundPosition = `${x}px ${y}px`;

      div.addEventListener('dragstart', handleDragStart);
      div.addEventListener('dragover', e => e.preventDefault());
      div.addEventListener('drop', handleDrop);

      board.appendChild(div);
    });
  }

  function handleDragStart(e) {
    dragged = e.target;
  }

  function handleDrop(e) {
    const target = e.target;
    if (target.classList.contains('puzzle-piece') && target !== dragged) {
      const draggedClone = dragged.cloneNode(true);
      const targetClone = target.cloneNode(true);

      board.replaceChild(draggedClone, target);
      board.replaceChild(targetClone, dragged);

      addDragEvents();
      checkSolved();
    }
  }

  function addDragEvents() {
    const pieces = document.querySelectorAll('.puzzle-piece');
    pieces.forEach(p => {
      p.addEventListener('dragstart', handleDragStart);
      p.addEventListener('dragover', e => e.preventDefault());
      p.addEventListener('drop', handleDrop);
    });
  }

  function checkSolved() {
    const current = Array.from(board.children).map(p => parseInt(p.dataset.value));
    const solved = [...current].sort((a, b) => a - b);
    const isSolved = current.every((v, i) => v === solved[i]);
    const imgIndex = parseInt(board.dataset.index);

    if (isSolved && !unlocked.includes(imgIndex)) {
      unlocked.push(imgIndex);
      renderCuentos();
      alert('¡Puzzle completado! Has desbloqueado un cuento.');
    }
  }

  function renderCuentos() {
    cuentos.innerHTML = '';
    cuentosData.forEach((title, i) => {
      const div = document.createElement('div');
      div.className = 'cuento-card';
      const img = document.createElement('img');
      img.src = cuentoImages[i];
      const h4 = document.createElement('h4');
      h4.textContent = title;

      div.appendChild(img);
      div.appendChild(h4);

      if (unlocked.includes(i)) {
        div.classList.add('unlocked');
        div.addEventListener('click', () => {
          // ✅ CAMBIO CLAVE: Usa window.open() para abrir en una nueva pestaña
          window.open(`cuentos.html?cuento=${i}`, '_blank');
        });
      } else {
        div.classList.add('locked');
      }
      cuentos.appendChild(div);
    });

    const pct = Math.floor((unlocked.length / cuentosData.length) * 100);
    progress.style.width = pct + '%';
    document.getElementById('unlockedCount').textContent = unlocked.length;
    document.getElementById('totalCount').textContent = cuentosData.length;
  }

  function renderGallery() {
    images.forEach((src, i) => {
      const div = document.createElement('div');
      div.className = 'gallery-item';
      div.innerHTML = `<img src="${src}" alt="Imagen ${i + 1}" width="80"><br>Imagen ${i + 1}`;
      div.addEventListener('click', () => {
        document.querySelectorAll('.gallery-item').forEach(item => item.classList.remove('selected'));
        div.classList.add('selected');
        createPuzzle(i);
      });
      gallery.appendChild(div);
    });
  }

  renderGallery();
  renderCuentos();
}
// ====================================================================
// --- 6. FUNCIONES AUXILIARES (DEFINIDAS AQUÍ) ---
// ====================================================================

function setupNavbarLogic() {
  console.log("🔧 Navbar cargado");
}

function inicializarPuzzle() {
  console.log("🧩 Puzzle inicializado");
}

function activarEmojisEnLeerMas() {
  console.log("🐾 Emojis activados en 'Leer más'");
}

function animarBannerConGSAP() {
  const bannerTitle = document.querySelector(".banner-title");
  const bannerSubtitle = document.querySelector(".banner-subtitle");
  const bannerDescription = document.querySelector(".banner-description");
  const ctaButton = document.querySelector(".cta-button");
  const scrollIndicator = document.querySelector(".scroll-indicator");

  if (bannerTitle && bannerSubtitle && bannerDescription && ctaButton && scrollIndicator && typeof gsap !== 'undefined') {
    gsap.timeline()
      .from(bannerSubtitle, { opacity: 0, y: 30, duration: 1, ease: "power2.out" })
      .from(bannerTitle, { opacity: 0, y: 30, duration: 1, ease: "power2.out" }, "-=0.7")
      .from(bannerDescription, { opacity: 0, y: 30, duration: 1, ease: "power2.out" }, "-=0.7")
      .from(ctaButton, { opacity: 0, y: 30, duration: 1, ease: "power2.out" }, "-=0.7")
      .from(scrollIndicator, { opacity: 0, duration: 1, ease: "power2.out" }, "-=0.5");
  }
}

// Cambio de logo
const watermark = document.getElementById('watermark');
const images = [
  "img/LogoVerdad.PNG",
  "img/Logo2.PNG",
  "img/logo4.PNG"
];
let index = 0;
setInterval(() => {
  if(watermark) { // Asegura que el elemento exista antes de intentar cambiar la fuente
    index = (index + 1) % images.length;
    watermark.src = images[index];
  }
}, 5000);

// ====================================================================
// --- 7. CONTROL DE VIDEO CON SCROLL ---
// ====================================================================

let player;
let scrollListenerAttached = false;

function onYouTubeIframeAPIReady() {
  player = new YT.Player('videoPlayer', {
    events: {
      'onReady': onPlayerReady
    }
  });
}

function onPlayerReady(event) {
  playVideoOnScroll();
  if (!scrollListenerAttached) {
    window.addEventListener('scroll', playVideoOnScroll);
    scrollListenerAttached = true;
  }
}

function playVideoOnScroll() {
  if (!player || !player.getPlayerState) return;

  const video = document.getElementById('videoPlayer');
  if (!video) return;

  const rect = video.getBoundingClientRect();
  const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

  if (isVisible) {
    if (player.getPlayerState() !== YT.PlayerState.PLAYING) {
      player.playVideo();
    }
    if (player.isMuted()) {
      player.unMute();
    }
  } else {
    if (player.getPlayerState() === YT.PlayerState.PLAYING) {
      player.pauseVideo();
    }
    if (!player.isMuted()) {
      player.mute();
    }
  }
}

// ====================================================================
// --- 9. FUNCIONES ESPECÍFICAS DE APRENDE ---
// ====================================================================

function inicializarAprende() {
  // === CONFIGURACIÓN ===
  let pokemonActual = null;
  let puntos = 0;
  let pistaCount = 0;
  const pokemonIds = Array.from({ length: 150 }, (_, i) => i + 1);

  // === CARGAR POKÉMON ALEATORIO ===
  async function cargarPokemon() {
    const id = pokemonIds[Math.floor(Math.random() * pokemonIds.length)];
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;

    try {
      const resp = await fetch(url);
      const data = await resp.json();
      pokemonActual = data;
      document.getElementById("img-pokemon").src = data.sprites.other['official-artwork'].front_default;
      document.getElementById("img-pokemon").alt = data.name;
      crearPalabraConEspacios(data.name);
      crearLetrasDesordenadas(data.name);
      pistaCount = 0;
      document.getElementById("pistas-count").textContent = 0;
      document.getElementById("pistas-usadas").innerHTML = '<p><em>No has usado ninguna pista.</em></p>';
      document.getElementById("resultado-pokemon").textContent = "";
      document.getElementById("resultado-pokemon").className = "resultado";
    } catch (error) {
      console.error("Error cargando Pokémon:", error);
    }
  }

  // === CREAR PALABRA CON ESPACIOS ===
  function crearPalabraConEspacios(nombre) {
    const container = document.getElementById("palabra");
    container.innerHTML = "";
    for (let i = 0; i < nombre.length; i++) {
      const slot = document.createElement("div");
      slot.className = "letter-slot empty";
      slot.dataset.index = i;
      container.appendChild(slot);
    }
  }

  // === CREAR LETRAS DESORDENADAS ===
  function crearLetrasDesordenadas(nombre) {
    const letras = nombre.split('');
    const desordenadas = letras.sort(() => 0.5 - Math.random());
    const container = document.getElementById("letras");
    container.innerHTML = "";

    desordenadas.forEach((letra, i) => {
      const span = document.createElement("span");
      span.className = "letra";
      span.textContent = letra.toUpperCase();
      span.dataset.letter = letra.toLowerCase();

      span.onclick = () => {
        const nextSlot = document.querySelector(".letter-slot.empty");
        if (!nextSlot) return;
        const expectedLetter = pokemonActual.name[nextSlot.dataset.index];
        if (letra.toLowerCase() === expectedLetter.toLowerCase()) {
          colocarLetra(letra.toLowerCase());
        } else {
          span.classList.add("invalid");
          nextSlot.classList.add("shake");
          setTimeout(() => {
            span.classList.remove("invalid");
            nextSlot.classList.remove("shake");
          }, 500);
        }
      };

      span.draggable = true;
      span.addEventListener("dragstart", (e) => {
        const nextSlot = document.querySelector(".letter-slot.empty");
        if (!nextSlot) return;
        const expectedLetter = pokemonActual.name[nextSlot.dataset.index];
        if (letra.toLowerCase() !== expectedLetter.toLowerCase()) {
          e.preventDefault();
          span.classList.add("invalid");
          nextSlot.classList.add("shake");
          setTimeout(() => {
            span.classList.remove("invalid");
            nextSlot.classList.remove("shake");
          }, 500);
        } else {
          e.dataTransfer.setData("text", letra.toLowerCase());
          span.classList.add("dragging");
        }
      });
      span.addEventListener("dragend", () => {
        span.classList.remove("dragging");
      });

      container.appendChild(span);
    });
  }

  // === COLOCAR LETRA ===
  function colocarLetra(letra) {
    const nextSlot = document.querySelector(".letter-slot.empty");
    if (!nextSlot) return;

    nextSlot.textContent = letra.toUpperCase();
    nextSlot.classList.remove("empty");
    nextSlot.classList.add("filled", "correct");
    nextSlot.dataset.letter = letra;

    const letras = document.querySelectorAll(".letra");
    for (let l of letras) {
      if (l.dataset.letter === letra) {
        l.style.opacity = "0.4";
        l.onclick = null;
        l.draggable = false;
        break;
      }
    }
    const slots = document.querySelectorAll(".letter-slot");
    const palabraFormada = Array.from(slots).map(s => s.dataset.letter || "").join("");
    if (palabraFormada.length === pokemonActual.name.length) {
      const nombreCorrecto = pokemonActual.name.toLowerCase();
      if (palabraFormada === nombreCorrecto) {
        document.getElementById("resultado-pokemon").textContent = "¡Correcto! 🎉";
        document.getElementById("resultado-pokemon").className = "resultado correcto";
      }
    }
  }

  // === SOLTAR LETRA EN ESPACIO ===
  document.getElementById("palabra").addEventListener("dragover", e => e.preventDefault());
  document.getElementById("palabra").addEventListener("drop", (e) => {
    e.preventDefault();
    const letra = e.dataTransfer.getData("text");
    if (letra) colocarLetra(letra);
  });

  // === VERIFICAR RESPUESTA (BOTÓN ENVIAR) ===
  window.verificarRespuesta = function() {
    const slots = document.querySelectorAll(".letter-slot");
    const palabraFormada = Array.from(slots).map(s => s.dataset.letter || "").join("");
    const nombreCorrecto = pokemonActual.name.toLowerCase();

    if (palabraFormada.length === 0) {
      alert("🔍 Por favor, coloca al menos una letra.");
      return;
    }
    if (palabraFormada === nombreCorrecto) {
      puntos += 1;
      document.getElementById("puntos").textContent = puntos;
      document.getElementById("resultado-pokemon").textContent = "¡Correcto! +1 punto 🎉";
      document.getElementById("resultado-pokemon").className = "resultado correcto";
      confetti({
        particleCount: 100,
        spread: 180,
        origin: { y: 0.6 }
      });
      agregarAPokemonResuelto(pokemonActual.name);
      setTimeout(cargarPokemon, 1500);
    } else {
      document.getElementById("resultado-pokemon").textContent = "❌ Nombre incompleto o incorrecto. Sigue intentando.";
      document.getElementById("resultado-pokemon").className = "resultado incorrecto";
    }
  };

  // === VOZ MÁS ARMÓNICA ===
  window.leerNombre = function() {
    if (!'speechSynthesis' in window) return;
    const utterance = new SpeechSynthesisUtterance(pokemonActual.name);
    utterance.lang = 'es-ES';
    utterance.rate = 0.8;
    utterance.pitch = 1.2;
    utterance.volume = 1;
    const voices = speechSynthesis.getVoices();
    const femaleVoice = voices.find(v => v.name.includes("Google español") || v.lang === 'es-ES');
    if (femaleVoice) utterance.voice = femaleVoice;
    speechSynthesis.speak(utterance);
  };
  window.speechSynthesis.onvoiceschanged = () => {};

  // === PISTAS PROGRESIVAS (con formato claro) ===
  window.mostrarPista = function() {
    if (!pokemonActual) return;
    const nombre = pokemonActual.name;
    const div = document.getElementById("pistas-usadas");
    let p = document.createElement("p");
    if (pistaCount === 0) {
      p.innerHTML = `<strong>1ª pista:</strong> Tiene <strong>${nombre.length}</strong> letras.`;
      p.className = "primera";
    } else if (pistaCount === 1) {
      p.innerHTML = `<strong>2ª pista:</strong> Empieza con la letra <strong>"${nombre[0].toUpperCase()}"</strong>.`;
      p.className = "segunda";
    } else if (pistaCount === 2) {
      p.innerHTML = `<strong>3ª pista:</strong> El nombre es: <strong>${nombre.charAt(0).toUpperCase() + nombre.slice(1)}</strong>.`;
      p.className = "tercera";
    } else {
      alert("📌 Ya usaste todas las pistas.");
      return;
    }
    div.appendChild(p);
    pistaCount++;
    document.getElementById("pistas-count").textContent = pistaCount;
  };

  // === AGREGAR A LISTA DE RESUELTOS ===
  function agregarAPokemonResuelto(nombre) {
    const lista = document.getElementById("lista-resueltos");
    const item = document.createElement("li");
    item.textContent = nombre.charAt(0).toUpperCase() + nombre.slice(1);
    lista.appendChild(item);
  }

  // === INICIALIZAR ===
  cargarPokemon();
}

// ====================================================================
// --- INICIALIZACIÓN DE SERVICIOS ---
// ====================================================================
function inicializarServicios() {
  console.log("✅ Inicializando página de servicios...");

  const carousel = document.querySelector('.carousel-wrapper');
      const heroTitle = document.querySelector('.hero-section h1');
      const allCards = document.querySelectorAll('.flip-card-container');
      const modal = document.getElementById('serviceModal');
      const modalCloseBtn = document.querySelector('.modal-close-btn');
      const modalTitle = document.getElementById('modalTitle');
      const modalImage = document.getElementById('modalImage');
      const modalDescription = document.getElementById('modalDescription');
      
      const isMobile = window.innerWidth <= 768;

      // ---- Parámetros del carrusel
      const numCards = allCards.length;
      const cardArc = 290 / numCards;
      const radius = 420;
      let carouselRotationTween;

      // ---- Colocación de tarjetas en el anillo 3D
      allCards.forEach((card, index) => {
        gsap.set(card, {
          transform: `rotateY(${index * cardArc}deg) translateZ(${radius}px)`,
          transformOrigin: "50% 50%",
          opacity: 0
        });
      });

      // ---- Eventos de clic para los botones de voltear la tarjeta
      const flipButtons = document.querySelectorAll('.flip-btn');
      flipButtons.forEach(button => {
        button.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const cardContainer = button.closest('.flip-card-container');
          const inner = cardContainer.querySelector('.flip-inner');
          inner.classList.toggle('is-flipped');
          cardContainer.style.zIndex = inner.classList.contains('is-flipped') ? '1000' : '';
        });
      });

      // ---- Eventos de clic para los botones que abren el modal
      const modalButtons = document.querySelectorAll('.modal-btn');
      modalButtons.forEach(button => {
        button.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const modalData = button.dataset;

          modalTitle.textContent = modalData.title;
          modalImage.src = modalData.image;
          modalImage.alt = modalData.title;
          modalDescription.textContent = modalData.content;

          modal.classList.add('is-visible');
          modal.setAttribute('aria-hidden','false');
          modal.focus();
        });
      });

      // ---- Cerrar modal
      const closeModal = () => {
        modal.classList.remove('is-visible');
        modal.setAttribute('aria-hidden','true');
      };
      modalCloseBtn.addEventListener('click', closeModal);
      window.addEventListener('click', (ev) => { if (ev.target === modal) closeModal(); });
      window.addEventListener('keydown', (ev) => { if (ev.key === 'Escape' && modal.classList.contains('is-visible')) closeModal(); });

      // ---- Animaciones de entrada
      const tl = gsap.timeline();
      
      // Estado inicial del carrusel con GSAP y rotación para mostrar el eje
      gsap.set(carousel, { rotationX: 0, rotationY: 0 });

      tl.from(heroTitle, { y: -50, opacity: 0, duration: 1 });
      tl.to(carousel, { opacity: 1, duration: 0.8 }, "-=0.5");
      tl.to(allCards, { opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out" }, "-=0.5");

      // ---- Rotación infinita del carrusel (solo en escritorio)
      if (!isMobile) {
        carouselRotationTween = gsap.to(carousel, {
          rotationY: "+=360",
          duration: 60,
          repeat: -1,
          ease: "none"
        });
        // Pausar/reanudar en hover
        carousel.addEventListener('mouseenter', () => carouselRotationTween.pause());
        carousel.addEventListener('mouseleave', () => carouselRotationTween.play());
      }
      else
      {
        
      }
    };

// ====================================================================
// --- 10. INICIALIZACIÓN PRINCIPAL ---
// ====================================================================


document.addEventListener("DOMContentLoaded", () => {
  inicializarUniverso();
  animarTituloArcoiris();
  setTimeout(() => lanzarConfetiPasteles(100), 500);

  cargarComponente('navbar.html', '#navbar-container').then(setupSmoothScroll);

  if (!window.location.pathname.includes('contacto.html')) {
    cargarComponente('footer.html', '#footer-container').then(() => {
      const form = document.getElementById('newsletter-form');
      form?.addEventListener('submit', window.suscribirse);
    });
  }

  const path = window.location.pathname;
  if (path.endsWith('index.html') || path === '/' || path === '') {
    cargarComponente('banner.html', '#banner-container').then(() => {
      inicializarBannerCarrusel();
      animarBannerConGSAP();
    });
  }

  if (path.includes('about.html')) {
    inicializarBannerCarrusel();
  }


  if (path.includes('blog.html')) {
    inicializarBlog();
    initBlogConfetti();
  }
  if (path.includes('cuentos.html')) {
    initBlogConfetti();
  }

  if (path.includes('pokecomp.html')) {
    inicializarTiendaPokemon();
  }
  
  if (path.includes('aprende.html')) {
    inicializarAprende();
  }

  if (path.includes('servicios.html')) {
    inicializarServicios()
  }

  // ✅ CORRECCIÓN: Llamar a estas funciones solo en las páginas correctas.
  if (path.includes('comentario.html')) {
    setupContactForm();
    setupCommentForm();
  }

  setupScrollAnimations();
  
  const visitasElement = document.getElementById("visitas");
  if (visitasElement) {
    let visitas = localStorage.getItem("visitasMilley") || 0;
    visitas++;
    localStorage.setItem("visitasMilley", visitas);
    visitasElement.textContent = visitas;
  }

  document.querySelectorAll('figure.cuento[data-url]').forEach(figure => {
    figure.style.cursor = 'pointer';
    figure.addEventListener('click', function(e) {
      if (['BUTTON', 'TEXTAREA'].includes(e.target.tagName)) return;
      const url = this.getAttribute('data-url');
      if (url) window.open(url, '_blank');
    });
  });

  document.addEventListener('click', function(e) {
    const ctaButton = e.target.closest('.cta-button');
    if (ctaButton) {
      e.preventDefault();
      lanzarConfetiPasteles(60);
      lanzarHuellasYHuesos(ctaButton);
      const targetId = ctaButton.getAttribute('href');
      smoothScroll(targetId, document.querySelector('nav'));
    }
  });
});
// --- Nuevas funciones para los juegos de matemáticas ---
