/**
 * =========================================================================
 *   LAGARTO ARCANO - PERFIL & HISTORIAL JS
 *   Lógica de edición de perfil, cambio de clave y monitoreo de compras
 * =========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Obtener sesión activa de localStorage
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (!currentUser || currentUser.rol !== 'cliente') return;

    // Elementos del DOM: Formulario
    const form = document.getElementById('form-perfil');
    const nombre = document.getElementById('nombre');
    const email = document.getElementById('email');
    const fechaNacimiento = document.getElementById('fecha-nacimiento');
    const direccion = document.getElementById('direccion');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirm-password');

    // Elementos del DOM: Historial
    const purchasesEmptyMsg = document.getElementById('purchases-empty-msg');
    const purchasesTableWrapper = document.getElementById('purchases-table-wrapper');
    const purchasesItemsBody = document.getElementById('purchases-items-body');

    // 2. Pre-cargar Datos del Usuario
    nombre.value = currentUser.nombre;
    email.value = currentUser.email;
    fechaNacimiento.value = currentUser.fechaNacimiento;
    direccion.value = currentUser.direccion === 'No especificada' ? '' : currentUser.direccion;

    // 3. Renderizar Historial de Compras
    function loadPurchases() {
        const purchases = JSON.parse(localStorage.getItem('purchases') || '[]');
        
        // Filtrar compras asociadas al usuario actual
        const userPurchases = purchases.filter(p => p.usuario === currentUser.usuario);

        if (userPurchases.length === 0) {
            purchasesEmptyMsg.classList.remove('d-none');
            purchasesTableWrapper.classList.add('d-none');
            return;
        }

        purchasesEmptyMsg.classList.add('d-none');
        purchasesTableWrapper.classList.remove('d-none');
        
        purchasesItemsBody.innerHTML = '';

        const clpFormatter = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' });

        userPurchases.reverse().forEach(purchase => {
            // Generar desglose de juegos
            const gamesListHTML = purchase.juegos.map(g => 
                `<div>• ${g.nombre} <span class="text-muted">(x${g.cantidad})</span></div>`
            ).join('');

            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong class="text-warning">${purchase.id}</strong></td>
                <td>${purchase.fecha}</td>
                <td>
                    <div style="font-size: 0.82rem; max-height: 100px; overflow-y: auto;">
                        ${gamesListHTML}
                        <div class="text-muted mt-1" style="font-size: 0.75rem;">📍 Despacho: ${purchase.direccion}</div>
                    </div>
                </td>
                <td class="text-end fw-bold text-emerald">${clpFormatter.format(purchase.total)}</td>
            `;
            purchasesItemsBody.appendChild(row);
        });
    }

    // 4. Validaciones de Edición de Perfil
    const validationState = {
        nombre: true,
        email: true,
        fechaNacimiento: true,
        password: true // Verdadero por defecto porque es opcional
    };

    const setError = (inputElement, errorSpanId, message) => {
        inputElement.classList.remove('is-valid');
        inputElement.classList.add('is-invalid');
        document.getElementById(errorSpanId).textContent = message;
    };

    const setSuccess = (inputElement, errorSpanId) => {
        inputElement.classList.remove('is-invalid');
        inputElement.classList.add('is-valid');
        document.getElementById(errorSpanId).textContent = '';
    };

    const validateNombre = () => {
        if (nombre.value.trim() === '') {
            setError(nombre, 'error-nombre', 'El nombre completo es requerido.');
            validationState.nombre = false;
        } else {
            setSuccess(nombre, 'error-nombre');
            validationState.nombre = true;
        }
    };

    const validateEmail = () => {
        const value = email.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value === '') {
            setError(email, 'error-email', 'El correo electrónico es requerido.');
            validationState.email = false;
        } else if (!emailRegex.test(value)) {
            setError(email, 'error-email', 'Formato de correo no es válido.');
            validationState.email = false;
        } else {
            setSuccess(email, 'error-email');
            validationState.email = true;
        }
    };

    const validateFechaNacimiento = () => {
        const value = fechaNacimiento.value;
        if (value === '') {
            setError(fechaNacimiento, 'error-fecha-nacimiento', 'La fecha de nacimiento es requerida.');
            validationState.fechaNacimiento = false;
        } else {
            const birthDate = new Date(value);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            
            if (age < 13) {
                setError(fechaNacimiento, 'error-fecha-nacimiento', `Debes tener al menos 13 años. (Edad actual: ${age} años).`);
                validationState.fechaNacimiento = false;
            } else {
                setSuccess(fechaNacimiento, 'error-fecha-nacimiento');
                validationState.fechaNacimiento = true;
            }
        }
    };

    const validatePasswords = () => {
        const passVal = password.value;
        const confirmVal = confirmPassword.value;

        // Si están vacíos, no se modifica la contraseña
        if (passVal === '' && confirmVal === '') {
            password.classList.remove('is-invalid', 'is-valid');
            confirmPassword.classList.remove('is-invalid', 'is-valid');
            document.getElementById('error-password').textContent = '';
            document.getElementById('error-confirm-password').textContent = '';
            validationState.password = true;
            return;
        }

        // Si hay contenido, aplicar las 5 reglas de seguridad
        const minLength = passVal.length >= 8;
        const maxLength = passVal.length <= 20;
        const hasUppercase = /[A-Z]/.test(passVal);
        const hasNumber = /\d/.test(passVal);
        const hasSpecialChar = /[@$!%*?&]/.test(passVal);

        if (!minLength || !maxLength) {
            setError(password, 'error-password', `Debe medir entre 8 y 20 caracteres. (Actual: ${passVal.length})`);
            validationState.password = false;
            return;
        }
        if (!hasUppercase) {
            setError(password, 'error-password', 'Debe contener al menos una mayúscula.');
            validationState.password = false;
            return;
        }
        if (!hasNumber) {
            setError(password, 'error-password', 'Debe contener al menos un número.');
            validationState.password = false;
            return;
        }
        if (!hasSpecialChar) {
            setError(password, 'error-password', 'Debe contener un carácter especial (@$!%*?&).');
            validationState.password = false;
            return;
        }

        setSuccess(password, 'error-password');

        // Validar confirmación
        if (confirmVal === '') {
            setError(confirmPassword, 'error-confirm-password', 'Por favor confirma tu contraseña.');
            validationState.password = false;
        } else if (passVal !== confirmVal) {
            setError(confirmPassword, 'error-confirm-password', 'Las contraseñas no coinciden.');
            validationState.password = false;
        } else {
            setSuccess(confirmPassword, 'error-confirm-password');
            validationState.password = true;
        }
    };

    // Listeners en tiempo real
    nombre.addEventListener('input', validateNombre);
    email.addEventListener('input', validateEmail);
    fechaNacimiento.addEventListener('change', validateFechaNacimiento);
    password.addEventListener('input', validatePasswords);
    confirmPassword.addEventListener('input', validatePasswords);

    // 5. Submit Formulario
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Validar todos los campos
        validateNombre();
        validateEmail();
        validateFechaNacimiento();
        validatePasswords();

        const allValid = Object.values(validationState).every(s => s === true);

        if (allValid) {
            const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
            
            // Buscar y actualizar al usuario en la base de datos
            const userIndex = registeredUsers.findIndex(u => u.usuario === currentUser.usuario);
            if (userIndex !== -1) {
                registeredUsers[userIndex].nombre = nombre.value.trim();
                registeredUsers[userIndex].email = email.value.trim();
                registeredUsers[userIndex].fechaNacimiento = fechaNacimiento.value;
                registeredUsers[userIndex].direccion = direccion.value.trim() || 'No especificada';

                // Si se cambió la contraseña
                if (password.value !== '') {
                    registeredUsers[userIndex].password = password.value;
                }

                // Guardar cambios
                localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
                // Actualizar la sesión activa en el navegador
                localStorage.setItem('currentUser', JSON.stringify(registeredUsers[userIndex]));

                alert('¡Tus datos de arcanista han sido actualizados con éxito!');
                
                // Limpiar inputs de contraseña
                password.value = '';
                confirmPassword.value = '';
                password.classList.remove('is-valid');
                confirmPassword.classList.remove('is-valid');
                
                // Recargar barra de navegación para actualizar nombres si cambiaron
                renderNavbar();
            }
        }
    });

    // Carga inicial
    loadPurchases();
});
