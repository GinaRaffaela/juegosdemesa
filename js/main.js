/**
 * =========================================================================
 *   LAGARTO ARCANO - MAIN JS (INICIALIZACIÓN, NAVBAR DINÁMICA & SEGURIDAD)
 *   Lógica central compartida en todo el proyecto
 * =========================================================================
 */

// 1. Detección de Nivel de Directorio para Rutas Relativas
const isSubdirectory = window.location.pathname.includes('/cliente/') || window.location.pathname.includes('/admin/');
const relPath = isSubdirectory ? '../' : './';

// 2. Datos Iniciales por Defecto (Pre-poblar localStorage si está vacío)
const defaultProducts = [
    // Categoría: Estrategia
    {
        id: "est-catan",
        nombre: "Catan",
        categoria: "estrategia",
        descripcion: "Funda tus pueblos, traza rutas comerciales clave y compite astutamente por el control de los valiosos recursos de la isla de Catan.",
        precio: 34990,
        descuento: 15, // 15% OFF
        stock: 8,
        imagen: "https://images.unsplash.com/photo-1605870445919-838d190e8e1b?q=80&w=400&auto=format&fit=crop"
    },
    {
        id: "est-carcassonne",
        nombre: "Carcassonne",
        categoria: "estrategia",
        descripcion: "Crea un precioso paisaje medieval loseta por loseta. Ubica estratégicamente a tus caballeros, ladrones y monjes en caminos y castillos.",
        precio: 28990,
        descuento: 0,
        stock: 12,
        imagen: "https://images.unsplash.com/photo-1611195974226-a6a9be9dd763?q=80&w=400&auto=format&fit=crop"
    },
    {
        id: "est-splendor",
        nombre: "Splendor",
        categoria: "estrategia",
        descripcion: "Conviértete en un comerciante rico y prestigioso del Renacimiento. Adquiere gemas exclusivas, barcos de transporte y contrata artesanos.",
        precio: 32990,
        descuento: 10, // 10% OFF
        stock: 5,
        imagen: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=400&auto=format&fit=crop"
    },
    // Categoría: Familiares
    {
        id: "fam-ticket",
        nombre: "Ticket to Ride",
        categoria: "familiares",
        descripcion: "¡Una aventura ferroviaria! Reúne cartas de vagones de colores para conectar ciudades de Norteamérica y completar tus rutas secretas.",
        precio: 39990,
        descuento: 20, // 20% OFF
        stock: 10,
        imagen: "https://images.unsplash.com/photo-1543783207-ec64e4d95325?q=80&w=400&auto=format&fit=crop"
    },
    {
        id: "fam-dixit",
        nombre: "Dixit",
        categoria: "familiares",
        descripcion: "Despierta tu creatividad. Narra pistas místicas inspiradas en hermosas e inusuales cartas ilustradas para que tus amigos las descubran.",
        precio: 24990,
        descuento: 0,
        stock: 15,
        imagen: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=400&auto=format&fit=crop"
    },
    {
        id: "fam-kingoftokyo",
        nombre: "King of Tokyo",
        categoria: "familiares",
        descripcion: "Juega como un monstruo mutante gigante o un robot colosal. Lanza los dados para curarte, ganar energía o atacar ferozmente a tus rivales.",
        precio: 35990,
        descuento: 15, // 15% OFF
        stock: 6,
        imagen: "https://images.unsplash.com/photo-1553481187-be93c21490a9?q=80&w=400&auto=format&fit=crop"
    },
    // Categoría: Party Games
    {
        id: "pty-exploding",
        nombre: "Exploding Kittens",
        categoria: "party",
        descripcion: "¡Una ruleta rusa con gatitos explosivos y rayos láser! Evita a toda costa robar el gatito explosivo usando cartas de desactivación.",
        precio: 19990,
        descuento: 0,
        stock: 20,
        imagen: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?q=80&w=400&auto=format&fit=crop"
    },
    {
        id: "pty-dobble",
        nombre: "Dobble",
        categoria: "party",
        descripcion: "¡El juego de velocidad visual definitivo! Encuentra el único símbolo coincidente entre dos cartas antes que tus oponentes.",
        precio: 14990,
        descuento: 10, // 10% OFF
        stock: 25,
        imagen: "https://images.unsplash.com/photo-1589802829985-817e51171b92?q=80&w=400&auto=format&fit=crop"
    },
    {
        id: "pty-junglespeed",
        nombre: "Jungle Speed",
        categoria: "party",
        descripcion: "Revela tus cartas y sé extremadamente rápido en atrapar el tótem de madera central cuando las formas coincidan exactamente.",
        precio: 21990,
        descuento: 15, // 15% OFF
        stock: 4,
        imagen: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=400&auto=format&fit=crop"
    },
    // Categoría: Cooperativos
    {
        id: "cop-pandemic",
        nombre: "Pandemic",
        categoria: "cooperativos",
        descripcion: "¡Salven al planeta entero de epidemias catastróficas! Encarnen a especialistas que viajan conteniendo brotes mientras buscan curas.",
        precio: 38990,
        descuento: 15, // 15% OFF
        stock: 7,
        imagen: "https://images.unsplash.com/photo-1584483766114-2cea6facdf57?q=80&w=400&auto=format&fit=crop"
    },
    {
        id: "cop-island",
        nombre: "Isla Prohibida",
        categoria: "cooperativos",
        descripcion: "Coordinen habilidades en equipo para recuperar cuatro reliquias místicas ocultas en una isla que se sumerge segundo a segundo.",
        precio: 26990,
        descuento: 0,
        stock: 9,
        imagen: "https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=400&auto=format&fit=crop"
    },
    {
        id: "cop-themind",
        nombre: "The Mind",
        categoria: "cooperativos",
        descripcion: "Consigan apilar en orden numérico ascendente todas las cartas de sus manos sin hablar, gesticular, ni mandarse señales explícitas.",
        precio: 12990,
        descuento: 10, // 10% OFF
        stock: 14,
        imagen: "https://images.unsplash.com/photo-1628157582853-a796fa650a6a?q=80&w=400&auto=format&fit=crop"
    }
];

const defaultUsers = [
    {
        nombre: "Administrador Lagarto",
        usuario: "admin",
        email: "admin@lagartoarcano.cl",
        password: "Admin123!",
        fechaNacimiento: "1990-01-01",
        direccion: "Cueva del Mago 406, Viña del Mar",
        rol: "administrador"
    },
    {
        nombre: "Juan Pérez",
        usuario: "cliente",
        email: "cliente@gmail.com",
        password: "Cliente123!",
        fechaNacimiento: "2000-05-15",
        direccion: "Calle Valparaíso 123, Viña del Mar",
        rol: "cliente"
    }
];

// Inicialización de bases de datos en localStorage
if (!localStorage.getItem('products')) {
    localStorage.setItem('products', JSON.stringify(defaultProducts));
}
if (!localStorage.getItem('registeredUsers')) {
    localStorage.setItem('registeredUsers', JSON.stringify(defaultUsers));
}
if (!localStorage.getItem('cart')) {
    localStorage.setItem('cart', JSON.stringify([]));
}
if (!localStorage.getItem('purchases')) {
    localStorage.setItem('purchases', JSON.stringify([]));
}

// 3. Sistema de Navbar Dinámica y Footer
function renderNavbar() {
    const navbarPlaceholder = document.getElementById('navbar-placeholder');
    if (!navbarPlaceholder) return;
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Obtener la cantidad de ítems del carrito para el usuario logueado
    let cartCount = 0;
    if (currentUser && currentUser.rol === 'cliente') {
        const userCart = cart.filter(item => item.username === currentUser.usuario);
        cartCount = userCart.reduce((sum, item) => sum + item.quantity, 0);
    }

    // Identificar la página activa
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    // Generar enlaces del menú
    let navMenuHTML = `
        <li class="nav-item ${currentPage === 'index.html' ? 'active' : ''}"><a href="${relPath}index.html">Inicio</a></li>
        <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Categorías
            </a>
            <ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="navbarDropdown">
                <li><a class="dropdown-item" href="${relPath}categoria-estrategia.html">Estrategia</a></li>
                <li><a class="dropdown-item" href="${relPath}categoria-familiares.html">Familiares</a></li>
                <li><a class="dropdown-item" href="${relPath}categoria-party.html">Party Games</a></li>
                <li><a class="dropdown-item" href="${relPath}categoria-cooperativos.html">Cooperativos</a></li>
            </ul>
        </li>
        <li class="nav-item ${currentPage === 'contacto.html' ? 'active' : ''}"><a href="${relPath}contacto.html">Contacto</a></li>
    `;

    // Añadir enlaces condicionales según el rol
    if (!currentUser) {
        // Invitado
        navMenuHTML += `
            <li class="nav-item ${currentPage === 'login.html' ? 'active' : ''}"><a href="${relPath}login.html" class="nav-link">Iniciar Sesión</a></li>
            <li class="nav-item ${currentPage === 'registro.html' ? 'active' : ''}"><a href="${relPath}registro.html" class="nav-link">Registrarse</a></li>
        `;
    } else if (currentUser.rol === 'cliente') {
        // Cliente
        navMenuHTML += `
            <li class="nav-item ${currentPage === 'carrito.html' ? 'active' : ''}">
                <a href="${relPath}cliente/carrito.html" class="nav-link">
                    🛒 Carrito <span class="badge bg-emerald" id="cart-badge">${cartCount}</span>
                </a>
            </li>
            <li class="nav-item ${currentPage === 'perfil.html' ? 'active' : ''}"><a href="${relPath}cliente/perfil.html" class="nav-link">Mi Perfil</a></li>
            <li class="nav-item"><a href="#" id="btn-logout" class="nav-link text-warning">Salir (${currentUser.usuario})</a></li>
        `;
    } else if (currentUser.rol === 'administrador') {
        // Administrador
        navMenuHTML += `
            <li class="nav-item ${currentPage === 'productos.html' ? 'active' : ''}"><a href="${relPath}admin/productos.html" class="nav-link">Mantenedor Productos</a></li>
            <li class="nav-item ${currentPage === 'clientes.html' ? 'active' : ''}"><a href="${relPath}admin/clientes.html" class="nav-link">Mantenedor Clientes</a></li>
            <li class="nav-item"><a href="#" id="btn-logout" class="nav-link text-warning">Salir (Admin)</a></li>
        `;
    }

    navbarPlaceholder.innerHTML = `
        <header class="header">
            <div class="container-fluid px-md-5 nav-container">
                <a href="${relPath}index.html" class="logo">
                    <img src="${relPath}assets/logo_lagarto.png" alt="Logo Lagarto Arcano" style="width: 48px; height: 48px; border-radius: 50%; border: 2px solid var(--color-arcane);">
                    <div class="logo-text">Lagarto<span>Arcano</span></div>
                </a>
                
                <nav class="navbar navbar-expand-lg navbar-dark p-0">
                    <button class="navbar-toggler menu-toggle border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarText">
                        <ul class="nav-menu navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
                            ${navMenuHTML}
                        </ul>
                    </div>
                </nav>
            </div>
        </header>
    `;

    // Listener para botón de cerrar sesión
    const logoutBtn = document.getElementById('btn-logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('currentUser');
            alert('Has cerrado sesión correctamente.');
            window.location.href = `${relPath}index.html`;
        });
    }
}

function renderFooter() {
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (!footerPlaceholder) return;

    footerPlaceholder.innerHTML = `
        <footer class="footer">
            <div class="container-fluid px-md-5">
                <div class="footer-content">
                    <div class="footer-logo">
                        <img src="${relPath}assets/logo_lagarto.png" alt="Lagarto Arcano Logo Footer" style="width: 32px; height: 32px; border-radius: 50%;">
                        <div class="logo-text">Lagarto<span>Arcano</span></div>
                    </div>
                    <ul class="footer-links">
                        <li><a href="${relPath}index.html">Inicio</a></li>
                        <li><a href="${relPath}contacto.html">Contacto</a></li>
                        <li><a href="https://gatoarcano.cl/" target="_blank" rel="noopener">Inspirado en Gato Arcano</a></li>
                    </ul>
                </div>
                <div class="footer-bottom">
                    <p>&copy; 2026 Lagarto Arcano. Trabajo Académico Universitario. Todos los derechos reservados. Desarrollado con 💚 en HTML5, CSS3, Bootstrap 5 y JS.</p>
                </div>
            </div>
        </footer>
    `;
}

// 4. Seguridad de Acceso a Páginas Protegidas
function checkAccessSecurity() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    const path = window.location.pathname;

    // Proteger carpeta /cliente/
    if (path.includes('/cliente/')) {
        if (!currentUser || currentUser.rol !== 'cliente') {
            alert('Acceso restringido. Por favor, inicia sesión como Cliente.');
            window.location.href = `${relPath}login.html`;
        }
    }

    // Proteger carpeta /admin/
    if (path.includes('/admin/')) {
        if (!currentUser || currentUser.rol !== 'administrador') {
            alert('Acceso de administración denegado. Se requieren privilegios de Administrador.');
            window.location.href = `${relPath}login.html`;
        }
    }
}

// Ejecutar inicializaciones comunes al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
    checkAccessSecurity();
    renderNavbar();
    renderFooter();
});
