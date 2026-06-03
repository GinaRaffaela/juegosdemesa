/**
 * =========================================================================
 *   LAGARTO ARCANO - ADMIN CRUD JS
 *   Gestión de mantenedores de Productos y Clientes
 * =========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Detección de cuál pantalla de administración está activa
    const formProducto = document.getElementById('form-producto');
    const formCliente = document.getElementById('form-cliente');

    // =========================================================================
    //   SECCIÓN A: MANTENEDOR DE PRODUCTOS (PRODUCTOS & INVENTARIO)
    // =========================================================================
    if (formProducto) {
        const prodId = document.getElementById('product-id');
        const prodNombre = document.getElementById('nombre');
        const prodCategoria = document.getElementById('categoria');
        const prodDescripcion = document.getElementById('descripcion');
        const prodPrecio = document.getElementById('precio');
        const prodDescuento = document.getElementById('descuento');
        const prodStock = document.getElementById('stock');
        const prodImagen = document.getElementById('imagen');
        
        // Botones
        const btnCancel = document.getElementById('btn-cancel');
        const btnSubmit = document.getElementById('btn-submit');
        const formTitle = document.getElementById('form-title');
        
        const inventoryBody = document.getElementById('inventory-items-body');

        // Validar e Inyectar Mensaje
        const setFieldInvalid = (input, spanId, msg) => {
            input.classList.add('is-invalid');
            document.getElementById(spanId).textContent = msg;
        };
        const setFieldValid = (input, spanId) => {
            input.classList.remove('is-invalid');
            input.classList.add('is-valid');
            document.getElementById(spanId).textContent = '';
        };

        // Renderizar Inventario en la Tabla
        function renderInventory() {
            const products = JSON.parse(localStorage.getItem('products') || '[]');
            inventoryBody.innerHTML = '';
            
            const clpFormatter = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' });

            products.forEach(p => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>
                        <img src="${p.imagen}" alt="${p.nombre}" style="width: 45px; height: 45px; object-fit: cover; border-radius: var(--radius-sm);">
                    </td>
                    <td><strong class="text-white">${p.nombre}</strong></td>
                    <td><span class="badge bg-secondary">${p.categoria}</span></td>
                    <td class="text-end text-emerald fw-bold">${clpFormatter.format(p.precio)}</td>
                    <td class="text-center text-warning fw-bold">${p.descuento}%</td>
                    <td class="text-center">${p.stock} uds</td>
                    <td class="text-center">
                        <div class="btn-group btn-group-sm">
                            <button class="btn btn-warning btn-edit-prod" data-id="${p.id}">✏️</button>
                            <button class="btn btn-danger btn-delete-prod" data-id="${p.id}">🗑️</button>
                        </div>
                    </td>
                `;
                inventoryBody.appendChild(tr);
            });

            setupProductActionListeners();
        }

        // Listeners para botones de la tabla
        function setupProductActionListeners() {
            // Editar
            document.querySelectorAll('.btn-edit-prod').forEach(btn => {
                btn.addEventListener('click', () => {
                    const id = btn.getAttribute('data-id');
                    const products = JSON.parse(localStorage.getItem('products') || '[]');
                    const p = products.find(prod => prod.id === id);

                    if (p) {
                        prodId.value = p.id;
                        prodNombre.value = p.nombre;
                        prodCategoria.value = p.categoria;
                        prodDescripcion.value = p.descripcion;
                        prodPrecio.value = p.precio;
                        prodDescuento.value = p.descuento;
                        prodStock.value = p.stock;
                        prodImagen.value = p.imagen;

                        // Cambiar textos del Form
                        formTitle.textContent = "Editar Juego";
                        btnSubmit.textContent = "Guardar Cambios";
                        btnCancel.classList.remove('d-none');
                        
                        // Scroll suave al formulario
                        formProducto.scrollIntoView({ behavior: 'smooth' });
                    }
                });
            });

            // Eliminar
            document.querySelectorAll('.btn-delete-prod').forEach(btn => {
                btn.addEventListener('click', () => {
                    const id = btn.getAttribute('data-id');
                    const products = JSON.parse(localStorage.getItem('products') || '[]');
                    const p = products.find(prod => prod.id === id);

                    if (p && confirm(`¿Estás seguro/a de eliminar el juego "${p.nombre}" de la base de datos de inventario?`)) {
                        const updated = products.filter(prod => prod.id !== id);
                        localStorage.setItem('products', JSON.stringify(updated));
                        renderInventory();
                        resetProductForm();
                    }
                });
            });
        }

        // Cancelar Edición
        btnCancel.addEventListener('click', resetProductForm);

        function resetProductForm() {
            formProducto.reset();
            prodId.value = '';
            formTitle.textContent = "Agregar Nuevo Juego";
            btnSubmit.textContent = "Guardar Producto";
            btnCancel.classList.add('d-none');
            
            // Limpiar clases
            const inputs = [prodNombre, prodCategoria, prodDescripcion, prodPrecio, prodDescuento, prodStock, prodImagen];
            inputs.forEach(input => input.classList.remove('is-valid', 'is-invalid'));
            document.querySelectorAll('.error-feedback').forEach(span => span.textContent = '');
        }

        // Submit Formulario Producto (Agregar/Editar)
        formProducto.addEventListener('submit', (e) => {
            e.preventDefault();

            // Limpiar estados
            const inputs = [prodNombre, prodCategoria, prodDescripcion, prodPrecio, prodDescuento, prodStock, prodImagen];
            inputs.forEach(input => input.classList.remove('is-valid', 'is-invalid'));
            
            let hasError = false;

            // Validar requeridos
            if (prodNombre.value.trim() === '') {
                setFieldInvalid(prodNombre, 'error-nombre', 'El nombre es requerido.');
                hasError = true;
            }
            if (!prodCategoria.value) {
                setFieldInvalid(prodCategoria, 'error-categoria', 'La categoría es requerida.');
                hasError = true;
            }
            if (prodDescripcion.value.trim() === '') {
                setFieldInvalid(prodDescripcion, 'error-descripcion', 'La descripción es requerida.');
                hasError = true;
            }
            if (prodPrecio.value === '' || Number(prodPrecio.value) < 0) {
                setFieldInvalid(prodPrecio, 'error-precio', 'Ingrese un precio válido (>= 0).');
                hasError = true;
            }
            if (prodDescuento.value === '' || Number(prodDescuento.value) < 0 || Number(prodDescuento.value) > 100) {
                setFieldInvalid(prodDescuento, 'error-descuento', 'Ingrese un descuento válido (0-100%).');
                hasError = true;
            }
            if (prodStock.value === '' || Number(prodStock.value) < 0) {
                setFieldInvalid(prodStock, 'error-stock', 'Ingrese un stock válido (>= 0).');
                hasError = true;
            }
            if (prodImagen.value.trim() === '') {
                setFieldInvalid(prodImagen, 'error-imagen', 'La URL de la imagen es requerida.');
                hasError = true;
            }

            if (hasError) return;

            const products = JSON.parse(localStorage.getItem('products') || '[]');
            const editingId = prodId.value;

            if (editingId) {
                // Modo Edición
                const index = products.findIndex(p => p.id === editingId);
                if (index !== -1) {
                    products[index].nombre = prodNombre.value.trim();
                    products[index].categoria = prodCategoria.value;
                    products[index].descripcion = prodDescripcion.value.trim();
                    products[index].precio = Number(prodPrecio.value);
                    products[index].descuento = Number(prodDescuento.value);
                    products[index].stock = Number(prodStock.value);
                    products[index].imagen = prodImagen.value.trim();
                }
                alert('¡Juego modificado con éxito!');
            } else {
                // Modo Creación
                const newProduct = {
                    id: 'gen-' + Date.now(), // ID dinámico único
                    nombre: prodNombre.value.trim(),
                    categoria: prodCategoria.value,
                    descripcion: prodDescripcion.value.trim(),
                    precio: Number(prodPrecio.value),
                    descuento: Number(prodDescuento.value),
                    stock: Number(prodStock.value),
                    imagen: prodImagen.value.trim()
                };
                products.push(newProduct);
                alert('¡Juego agregado al inventario con éxito!');
            }

            localStorage.setItem('products', JSON.stringify(products));
            renderInventory();
            resetProductForm();
        });

        // Inicializar tabla
        renderInventory();
    }

    // =========================================================================
    //   SECCIÓN B: MANTENEDOR DE CLIENTES Y USUARIOS
    // =========================================================================
    if (formCliente) {
        const formMode = document.getElementById('form-mode'); // add / edit
        const clientNombre = document.getElementById('nombre');
        const clientUsuario = document.getElementById('usuario');
        const clientEmail = document.getElementById('email');
        const clientRol = document.getElementById('rol');
        const clientPassword = document.getElementById('password');
        const clientFechaNac = document.getElementById('fecha-nacimiento');
        const clientDireccion = document.getElementById('direccion');

        const btnCancel = document.getElementById('btn-cancel');
        const btnSubmit = document.getElementById('btn-submit');
        const formTitle = document.getElementById('form-title');
        const labelPassword = document.getElementById('label-password');

        const usersBody = document.getElementById('users-items-body');

        const setFieldInvalid = (input, spanId, msg) => {
            input.classList.add('is-invalid');
            document.getElementById(spanId).textContent = msg;
        };

        // Renderizar Usuarios en la Tabla
        function renderUsers() {
            const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
            const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
            
            usersBody.innerHTML = '';

            registeredUsers.forEach(u => {
                const tr = document.createElement('tr');
                
                // Si el usuario listado es el administrador activo, no permitir eliminarlo para evitar bloqueo
                const isSelf = currentUser && currentUser.usuario === u.usuario;

                tr.innerHTML = `
                    <td><strong class="text-white">${u.nombre}</strong></td>
                    <td>@${u.usuario}</td>
                    <td>${u.email}</td>
                    <td>${u.fechaNacimiento}</td>
                    <td>
                        <span class="badge ${u.rol === 'administrador' ? 'bg-warning text-dark' : 'bg-emerald'}">
                            ${u.rol.toUpperCase()}
                        </span>
                    </td>
                    <td class="text-center">
                        <div class="btn-group btn-group-sm">
                            <button class="btn btn-warning btn-edit-user" data-username="${u.usuario}">✏️</button>
                            ${isSelf ? '' : `<button class="btn btn-danger btn-delete-user" data-username="${u.usuario}">🗑️</button>`}
                        </div>
                    </td>
                `;
                usersBody.appendChild(tr);
            });

            setupUserActionListeners();
        }

        // Listeners
        function setupUserActionListeners() {
            // Editar
            document.querySelectorAll('.btn-edit-user').forEach(btn => {
                btn.addEventListener('click', () => {
                    const username = btn.getAttribute('data-username');
                    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
                    const u = registeredUsers.find(user => user.usuario === username);

                    if (u) {
                        formMode.value = "edit";
                        clientNombre.value = u.nombre;
                        clientUsuario.value = u.usuario;
                        clientUsuario.setAttribute('disabled', 'true'); // Deshabilitar nombre de usuario
                        clientEmail.value = u.email;
                        clientRol.value = u.rol;
                        clientFechaNac.value = u.fechaNacimiento;
                        clientDireccion.value = u.direccion === 'No especificada' ? '' : u.direccion;
                        clientPassword.value = ''; // Contraseña en blanco para edición opcional

                        formTitle.textContent = "Editar Cuenta";
                        btnSubmit.textContent = "Guardar Cambios";
                        labelPassword.textContent = "Nueva Contraseña (Opcional)";
                        clientPassword.placeholder = "Dejar vacío para no modificar";
                        clientPassword.removeAttribute('required');
                        
                        btnCancel.classList.remove('d-none');
                        formCliente.scrollIntoView({ behavior: 'smooth' });
                    }
                });
            });

            // Eliminar
            document.querySelectorAll('.btn-delete-user').forEach(btn => {
                btn.addEventListener('click', () => {
                    const username = btn.getAttribute('data-username');
                    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
                    const u = registeredUsers.find(user => user.usuario === username);

                    if (u && confirm(`¿Estás seguro/a de eliminar al usuario @${u.usuario} (${u.nombre})?`)) {
                        const updated = registeredUsers.filter(user => user.usuario !== username);
                        localStorage.setItem('registeredUsers', JSON.stringify(updated));
                        renderUsers();
                        resetUserForm();
                    }
                });
            });
        }

        btnCancel.addEventListener('click', resetUserForm);

        function resetUserForm() {
            formCliente.reset();
            formMode.value = "add";
            clientUsuario.removeAttribute('disabled');
            formTitle.textContent = "Agregar Cuenta";
            btnSubmit.textContent = "Guardar Cuenta";
            labelPassword.textContent = "Contraseña *";
            clientPassword.placeholder = "Contraseña segura";
            clientPassword.setAttribute('required', 'true');
            btnCancel.classList.add('d-none');

            // Limpiar clases
            const inputs = [clientNombre, clientUsuario, clientEmail, clientRol, clientPassword, clientFechaNac, clientDireccion];
            inputs.forEach(input => input.classList.remove('is-valid', 'is-invalid'));
            document.querySelectorAll('.error-feedback').forEach(span => span.textContent = '');
        }

        // Submit Formulario Cliente (Agregar/Editar)
        formCliente.addEventListener('submit', (e) => {
            e.preventDefault();

            const inputs = [clientNombre, clientUsuario, clientEmail, clientRol, clientPassword, clientFechaNac];
            inputs.forEach(input => input.classList.remove('is-invalid'));

            let hasError = false;

            // Requeridos base
            if (clientNombre.value.trim() === '') {
                setFieldInvalid(clientNombre, 'error-nombre', 'El nombre completo es requerido.');
                hasError = true;
            }
            if (clientUsuario.value.trim() === '') {
                setFieldInvalid(clientUsuario, 'error-usuario', 'El nombre de usuario es requerido.');
                hasError = true;
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (clientEmail.value.trim() === '' || !emailRegex.test(clientEmail.value.trim())) {
                setFieldInvalid(clientEmail, 'error-email', 'Formato de correo inválido.');
                hasError = true;
            }
            if (!clientRol.value) {
                setFieldInvalid(clientRol, 'error-rol', 'Debe seleccionar un rol.');
                hasError = true;
            }

            // Contraseña requerida solo en creación
            const isAddMode = formMode.value === "add";
            if (isAddMode && clientPassword.value === '') {
                setFieldInvalid(clientPassword, 'error-password', 'La contraseña es requerida.');
                hasError = true;
            }

            // Edad mínima 13 años
            if (clientFechaNac.value === '') {
                setFieldInvalid(clientFechaNac, 'error-fecha-nacimiento', 'La fecha de nacimiento es requerida.');
                hasError = true;
            } else {
                const birthDate = new Date(clientFechaNac.value);
                const today = new Date();
                let age = today.getFullYear() - birthDate.getFullYear();
                const monthDiff = today.getMonth() - birthDate.getMonth();
                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                    age--;
                }
                if (age < 13) {
                    setFieldInvalid(clientFechaNac, 'error-fecha-nacimiento', `Debe tener al menos 13 años. (Edad actual: ${age} años).`);
                    hasError = true;
                }
            }

            if (hasError) return;

            const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
            const username = clientUsuario.value.trim();
            const emailValue = clientEmail.value.trim();

            if (isAddMode) {
                // Validar unicidad
                const usernameExists = registeredUsers.some(u => u.usuario === username);
                const emailExists = registeredUsers.some(u => u.email === emailValue);

                if (usernameExists) {
                    setFieldInvalid(clientUsuario, 'error-usuario', 'El nombre de usuario ya existe.');
                    return;
                }
                if (emailExists) {
                    setFieldInvalid(clientEmail, 'error-email', 'El correo ya está registrado.');
                    return;
                }

                // Crear usuario
                const newUser = {
                    nombre: clientNombre.value.trim(),
                    usuario: username,
                    email: emailValue,
                    rol: clientRol.value,
                    password: clientPassword.value,
                    fechaNacimiento: clientFechaNac.value,
                    direccion: clientDireccion.value.trim() || 'No especificada'
                };
                registeredUsers.push(newUser);
                alert('¡Cuenta creada con éxito!');
            } else {
                // Modo Edición
                const userIndex = registeredUsers.findIndex(u => u.usuario === username);
                if (userIndex !== -1) {
                    // Validar unicidad de email (excluyendo el usuario actual)
                    const emailExists = registeredUsers.some(u => u.usuario !== username && u.email === emailValue);
                    if (emailExists) {
                        setFieldInvalid(clientEmail, 'error-email', 'El correo ya está registrado por otro usuario.');
                        return;
                    }

                    registeredUsers[userIndex].nombre = clientNombre.value.trim();
                    registeredUsers[userIndex].email = emailValue;
                    registeredUsers[userIndex].rol = clientRol.value;
                    registeredUsers[userIndex].fechaNacimiento = clientFechaNac.value;
                    registeredUsers[userIndex].direccion = clientDireccion.value.trim() || 'No especificada';

                    if (clientPassword.value !== '') {
                        registeredUsers[userIndex].password = clientPassword.value;
                    }
                }
                alert('¡Cuenta modificada con éxito!');
            }

            localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
            renderUsers();
            resetUserForm();
        });

        // Inicializar tabla
        renderUsers();
    }
});
