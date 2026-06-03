/**
 * =========================================================================
 *   LAGARTO ARCANO - CATÁLOGO DINÁMICO JS
 *   Renderizado de productos y lógica de agregar al carrito por categorías
 * =========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('catalog-products-container');
    if (!container) return;

    // Obtener categoría activa desde el atributo data
    const activeCategory = container.getAttribute('data-category');

    function renderCatalog() {
        const products = JSON.parse(localStorage.getItem('products') || '[]');
        
        // Filtrar por la categoría de la página actual
        const filteredProducts = products.filter(p => p.categoria === activeCategory);

        container.innerHTML = '';

        if (filteredProducts.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <h4 class="text-muted">No hay juegos disponibles en esta categoría por el momento.</h4>
                </div>
            `;
            return;
        }

        const clpFormatter = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' });

        filteredProducts.forEach(p => {
            const hasDiscount = p.descuento > 0;
            const finalPrice = hasDiscount ? p.precio * (1 - p.descuento / 100) : p.precio;

            // Columna responsiva Bootstrap: 12 cols en móvil, 6 en tablet, 4 en escritorio grande
            const col = document.createElement('div');
            col.className = 'col-12 col-md-6 col-lg-4 mb-4 d-flex justify-content-center';

            col.innerHTML = `
                <article class="game-card w-100">
                    <!-- Insignias de Descuento / Stock -->
                    ${p.stock === 0 ? 
                        `<div class="bg-danger text-white position-absolute top-0 end-0 m-3 px-3 py-1 rounded fw-bold" style="z-index: 10; font-size: 0.8rem;">SIN STOCK</div>`
                        : (hasDiscount ? `<div class="discount-badge">${p.descuento}% OFF</div>` : `<div class="regular-price-badge">Precio Regular</div>`)
                    }
                    
                    <div class="game-image-wrapper">
                        <img src="${p.imagen}" alt="${p.nombre}">
                    </div>
                    <div class="game-content">
                        <div>
                            <h3 class="game-title">${p.nombre}</h3>
                            <p class="game-desc">${p.descripcion}</p>
                        </div>
                        <div>
                            <div class="game-pricing">
                                <span class="price-current">${clpFormatter.format(finalPrice)}</span>
                                ${hasDiscount ? `<span class="price-old">${clpFormatter.format(p.precio)}</span>` : ''}
                            </div>
                            <span class="d-block text-muted mb-2" style="font-size: 0.8rem;">Disponibles: ${p.stock} unidades</span>
                            
                            <button class="btn-add-to-cart game-btn w-100 border-0" data-id="${p.id}" ${p.stock === 0 ? 'disabled style="cursor:not-allowed; opacity: 0.5;"' : ''}>
                                ${p.stock === 0 ? 'Agotado' : 'Añadir al Carrito 🛒'}
                            </button>
                        </div>
                    </div>
                </article>
            `;

            container.appendChild(col);
        });

        setupAddToCartListeners();
    }

    function setupAddToCartListeners() {
        document.querySelectorAll('.btn-add-to-cart').forEach(btn => {
            btn.addEventListener('click', () => {
                const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

                // 1. Validar que esté logueado
                if (!currentUser) {
                    alert('Debes iniciar sesión para poder comprar juegos.');
                    // Obtener la ruta correcta para login.html
                    const isSub = window.location.pathname.includes('/cliente/') || window.location.pathname.includes('/admin/');
                    window.location.href = isSub ? '../login.html' : 'login.html';
                    return;
                }

                // 2. Validar que no sea administrador
                if (currentUser.rol === 'administrador') {
                    alert('Los administradores no pueden realizar compras. Inicia sesión como cliente.');
                    return;
                }

                const productId = btn.getAttribute('data-id');
                const products = JSON.parse(localStorage.getItem('products') || '[]');
                const product = products.find(p => p.id === productId);

                if (product) {
                    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
                    const existingItem = cart.find(item => item.username === currentUser.usuario && item.productId === productId);

                    if (existingItem) {
                        // Si ya está en el carro, validar contra el stock
                        if (existingItem.quantity < product.stock) {
                            existingItem.quantity++;
                            localStorage.setItem('cart', JSON.stringify(cart));
                            alert(`¡${product.nombre} añadido de nuevo! Cantidad en carrito: ${existingItem.quantity}`);
                        } else {
                            alert(`Lo sentimos, no hay más stock disponible de ${product.nombre}. (Stock máximo: ${product.stock})`);
                        }
                    } else {
                        // Si no está, validar que haya al menos 1 de stock
                        if (product.stock >= 1) {
                            cart.push({
                                username: currentUser.usuario,
                                productId: productId,
                                quantity: 1
                            });
                            localStorage.setItem('cart', JSON.stringify(cart));
                            alert(`¡${product.nombre} añadido al carrito con éxito!`);
                        } else {
                            alert(`Lo sentimos, el producto ${product.nombre} no se encuentra disponible.`);
                        }
                    }

                    // Recargar navbar para actualizar el número de items
                    renderNavbar();
                }
            });
        });
    }

    renderCatalog();
});
