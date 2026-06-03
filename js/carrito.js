/**
 * =========================================================================
 *   LAGARTO ARCANO - CARRITO & CHECKOUT JS
 *   Lógica de compras, inventario y pasarela de pago simulada
 * =========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Obtener sesión activa de localStorage
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (!currentUser || currentUser.rol !== 'cliente') return;

    // Elementos del DOM
    const cartEmptyMsg = document.getElementById('cart-empty-msg');
    const cartTableWrapper = document.getElementById('cart-table-wrapper');
    const cartItemsBody = document.getElementById('cart-items-body');
    const cartSummaryWrapper = document.getElementById('cart-summary-wrapper');
    
    // Totales
    const summarySubtotal = document.getElementById('summary-subtotal');
    const summaryDiscount = document.getElementById('summary-discount');
    const summaryTotal = document.getElementById('summary-total');

    // Formulario de Pago
    const formCheckout = document.getElementById('form-checkout');
    const addressInput = document.getElementById('address');
    const cardNameInput = document.getElementById('card-name');
    const cardNumberInput = document.getElementById('card-number');
    const cardExpiryInput = document.getElementById('card-expiry');
    const cardCvvInput = document.getElementById('card-cvv');

    // Pre-llenar dirección de perfil del usuario
    if (currentUser.direccion && currentUser.direccion !== 'No especificada') {
        addressInput.value = currentUser.direccion;
    }

    // 2. Cargar y Renderizar Carrito
    function loadCart() {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const products = JSON.parse(localStorage.getItem('products') || '[]');
        
        // Filtrar ítems que corresponden al usuario activo
        const userCart = cart.filter(item => item.username === currentUser.usuario);

        if (userCart.length === 0) {
            cartEmptyMsg.classList.remove('d-none');
            cartTableWrapper.classList.add('d-none');
            cartSummaryWrapper.classList.add('d-none');
            // Actualizar la insignia del carrito en la navbar
            const badge = document.getElementById('cart-badge');
            if (badge) badge.textContent = '0';
            return;
        }

        cartEmptyMsg.classList.add('d-none');
        cartTableWrapper.classList.remove('d-none');
        cartSummaryWrapper.classList.remove('d-none');

        // Limpiar tabla
        cartItemsBody.innerHTML = '';

        let subtotalAcumulado = 0;
        let descuentoAcumulado = 0;
        let totalItems = 0;

        userCart.forEach(item => {
            // Resolver datos actualizados del juego desde la base de productos
            const product = products.find(p => p.id === item.productId);
            if (!product) return;

            const unitPrice = product.precio;
            const discountPercentage = product.descuento;
            const priceAfterDiscount = unitPrice * (1 - discountPercentage / 100);
            
            const itemSubtotal = unitPrice * item.quantity;
            const itemTotal = priceAfterDiscount * item.quantity;
            const itemDiscount = itemSubtotal - itemTotal;

            subtotalAcumulado += itemSubtotal;
            descuentoAcumulado += itemDiscount;
            totalItems += item.quantity;

            // Formatear precios en CLP
            const clpFormatter = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' });

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <div class="d-flex align-items-center gap-3">
                        <img src="${product.imagen}" alt="${product.nombre}" style="width: 50px; height: 50px; object-fit: cover; border-radius: var(--radius-sm);">
                        <div>
                            <span class="fw-bold d-block">${product.nombre}</span>
                            <span class="badge bg-emerald" style="font-size: 0.7rem;">${product.categoria}</span>
                            ${product.descuento > 0 ? `<span class="badge bg-warning text-dark" style="font-size: 0.7rem;">${product.descuento}% OFF</span>` : ''}
                        </div>
                    </div>
                </td>
                <td class="text-center">
                    ${product.descuento > 0 ? 
                        `<span class="d-block text-emerald fw-bold">${clpFormatter.format(priceAfterDiscount)}</span>
                         <span class="text-danger text-decoration-line-through" style="font-size: 0.8rem;">${clpFormatter.format(unitPrice)}</span>` 
                        : `<span class="text-white">${clpFormatter.format(unitPrice)}</span>`
                    }
                </td>
                <td>
                    <div class="input-group input-group-sm justify-content-center">
                        <button class="btn btn-outline-secondary btn-minus" data-id="${item.productId}">-</button>
                        <input type="text" class="form-control text-center bg-dark text-white border-secondary" value="${item.quantity}" style="max-width: 50px;" readonly>
                        <button class="btn btn-outline-secondary btn-plus" data-id="${item.productId}">+</button>
                    </div>
                    <span class="d-block text-center text-muted mt-1" style="font-size: 0.72rem;">Stock: ${product.stock}</span>
                </td>
                <td class="text-end fw-bold text-emerald">
                    ${clpFormatter.format(itemTotal)}
                </td>
                <td class="text-center">
                    <button class="btn btn-link text-danger p-0 btn-remove" data-id="${item.productId}" style="font-size: 1.2rem;">&times;</button>
                </td>
            `;

            cartItemsBody.appendChild(row);
        });

        // Actualizar totales en CLP
        const clpFormatter = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' });
        summarySubtotal.textContent = clpFormatter.format(subtotalAcumulado);
        summaryDiscount.textContent = `-${clpFormatter.format(descuentoAcumulado)}`;
        summaryTotal.textContent = clpFormatter.format(subtotalAcumulado - descuentoAcumulado);

        // Actualizar la insignia del carrito en la navbar
        const badge = document.getElementById('cart-badge');
        if (badge) badge.textContent = totalItems;

        // Configurar los escuchadores de los botones de cantidad y remover
        setupCartListeners();
    }

    // 3. Listener de Botones del Carrito
    function setupCartListeners() {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const products = JSON.parse(localStorage.getItem('products') || '[]');

        // Botones de incremento (+)
        document.querySelectorAll('.btn-plus').forEach(btn => {
            btn.addEventListener('click', () => {
                const productId = btn.getAttribute('data-id');
                const product = products.find(p => p.id === productId);
                const cartItem = cart.find(item => item.username === currentUser.usuario && item.productId === productId);

                if (product && cartItem) {
                    if (cartItem.quantity < product.stock) {
                        cartItem.quantity++;
                        localStorage.setItem('cart', JSON.stringify(cart));
                        loadCart();
                    } else {
                        alert(`Lo sentimos, no hay más stock disponible de ${product.nombre}. (Stock actual: ${product.stock})`);
                    }
                }
            });
        });

        // Botones de decremento (-)
        document.querySelectorAll('.btn-minus').forEach(btn => {
            btn.addEventListener('click', () => {
                const productId = btn.getAttribute('data-id');
                const cartItem = cart.find(item => item.username === currentUser.usuario && item.productId === productId);

                if (cartItem && cartItem.quantity > 1) {
                    cartItem.quantity--;
                    localStorage.setItem('cart', JSON.stringify(cart));
                    loadCart();
                }
            });
        });

        // Botón de eliminar ítem
        document.querySelectorAll('.btn-remove').forEach(btn => {
            btn.addEventListener('click', () => {
                const productId = btn.getAttribute('data-id');
                // Filtrar el ítem a eliminar
                const updatedCart = cart.filter(item => !(item.username === currentUser.usuario && item.productId === productId));
                localStorage.setItem('cart', JSON.stringify(updatedCart));
                loadCart();
            });
        });
    }

    // 4. Formatear y Enmascarar Inputs de Tarjeta
    cardNumberInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        value = value.match(/.{1,4}/g)?.join(' ') || value;
        e.target.value = value;
    });

    cardExpiryInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        e.target.value = value;
    });

    cardCvvInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '');
    });

    // 5. Validaciones y Procesamiento de Pago Simulado
    formCheckout.addEventListener('submit', (e) => {
        e.preventDefault();

        // Limpiar errores previos
        const inputs = [addressInput, cardNameInput, cardNumberInput, cardExpiryInput, cardCvvInput];
        inputs.forEach(input => input.classList.remove('is-invalid'));
        document.querySelectorAll('.error-feedback').forEach(span => span.textContent = '');

        let hasError = false;

        // Validar Dirección
        if (addressInput.value.trim() === '') {
            addressInput.classList.add('is-invalid');
            document.getElementById('error-address').textContent = 'La dirección de despacho es requerida.';
            hasError = true;
        }

        // Validar Nombre en Tarjeta
        if (cardNameInput.value.trim() === '') {
            cardNameInput.classList.add('is-invalid');
            document.getElementById('error-card-name').textContent = 'El nombre en la tarjeta es requerido.';
            hasError = true;
        }

        // Validar Número de Tarjeta (16 dígitos)
        const rawCard = cardNumberInput.value.replace(/\s/g, '');
        if (rawCard.length !== 16) {
            cardNumberInput.classList.add('is-invalid');
            document.getElementById('error-card-number').textContent = 'Debe ingresar un número de tarjeta de 16 dígitos.';
            hasError = true;
        }

        // Validar Vencimiento (MM/YY)
        const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
        if (!expiryRegex.test(cardExpiryInput.value)) {
            cardExpiryInput.classList.add('is-invalid');
            document.getElementById('error-card-expiry').textContent = 'Formato inválido (MM/YY).';
            hasError = true;
        }

        // Validar CVV (3 dígitos)
        if (cardCvvInput.value.length !== 3) {
            cardCvvInput.classList.add('is-invalid');
            document.getElementById('error-card-cvv').textContent = 'CVV debe tener 3 dígitos.';
            hasError = true;
        }

        if (hasError) return;

        // --- PROCESAR PAGO EXITOSO ---
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const products = JSON.parse(localStorage.getItem('products') || '[]');
        const purchases = JSON.parse(localStorage.getItem('purchases') || '[]');

        const userCart = cart.filter(item => item.username === currentUser.usuario);

        // A. Validar stock e inventario una última vez antes de descontar
        let stockInsuficiente = false;
        userCart.forEach(item => {
            const product = products.find(p => p.id === item.productId);
            if (product && product.stock < item.quantity) {
                alert(`Lo sentimos, el producto ${product.nombre} se ha quedado sin stock suficiente (${product.stock} disponibles). Por favor ajusta tu cantidad.`);
                stockInsuficiente = true;
            }
        });
        if (stockInsuficiente) return;

        // B. Descontar Inventario y Compilar Items de Compra
        const purchaseItems = [];
        let totalPaid = 0;

        userCart.forEach(item => {
            const product = products.find(p => p.id === item.productId);
            if (product) {
                // Descontar del inventario
                product.stock -= item.quantity;
                
                // Calcular precio de compra real
                const priceAfterDiscount = product.precio * (1 - product.descuento / 100);
                totalPaid += priceAfterDiscount * item.quantity;

                purchaseItems.push({
                    id: product.id,
                    nombre: product.nombre,
                    precioUnitario: priceAfterDiscount,
                    cantidad: item.quantity
                });
            }
        });

        // Guardar cambios de stock
        localStorage.setItem('products', JSON.stringify(products));

        // C. Generar ticket de compra para el historial
        const purchaseTicket = {
            id: 'LGA-' + Math.floor(100000 + Math.random() * 900000), // Código aleatorio
            usuario: currentUser.usuario,
            clienteNombre: currentUser.nombre,
            fecha: new Date().toLocaleDateString('es-CL'),
            juegos: purchaseItems,
            total: totalPaid,
            direccion: addressInput.value.trim()
        };

        purchases.push(purchaseTicket);
        localStorage.setItem('purchases', JSON.stringify(purchases));

        // D. Limpiar el carrito del usuario activo (conservando el de otros si existiesen)
        const remainingCart = cart.filter(item => item.username !== currentUser.usuario);
        localStorage.setItem('cart', JSON.stringify(remainingCart));

        // E. Guardar ticket temporal de compra para mostrar en la pantalla de éxito
        localStorage.setItem('lastPurchaseTicket', JSON.stringify(purchaseTicket));

        // Redirección
        window.location.href = 'pago-exito.html';
    });

    // Carga inicial
    loadCart();
});
