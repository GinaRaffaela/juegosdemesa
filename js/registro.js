/**
 * =========================================================================
 *   LAGARTO ARCANO - LÓGICA DE REGISTRO & INTERACTIVIDAD DOM (JAVASCRIPT)
 *   Trabajo Académico Universitario - Validación y DOM Dinámico
 * =========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Elementos de Caché del Formulario
    const form = document.getElementById('form-registro');
    const nombre = document.getElementById('nombre');
    const usuario = document.getElementById('usuario');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirm-password');
    const fechaNacimiento = document.getElementById('fecha-nacimiento');
    const direccion = document.getElementById('direccion');
    
    // Botones
    const btnSubmit = document.getElementById('btn-submit');
    const btnReset = document.getElementById('btn-reset');
    
    // Elementos de Renderizado Dinámico
    const buyersGrid = document.getElementById('buyers-grid');
    const noBuyersMsg = document.getElementById('no-buyers-msg');

    // 2. Estado de validación por cada campo
    const validationState = {
        nombre: false,
        usuario: false,
        email: false,
        password: false,
        confirmPassword: false,
        fechaNacimiento: false
    };

    // 3. Helper de Inyección del DOM: Mostrar Éxito
    const setSuccess = (inputElement, errorSpanId) => {
        inputElement.classList.remove('is-invalid');
        inputElement.classList.add('is-valid');
        const errorSpan = document.getElementById(errorSpanId);
        errorSpan.textContent = '';
        errorSpan.style.opacity = '0';
    };

    // Helper de Inyección del DOM: Mostrar Error
    const setError = (inputElement, errorSpanId, message) => {
        inputElement.classList.remove('is-valid');
        inputElement.classList.add('is-invalid');
        const errorSpan = document.getElementById(errorSpanId);
        errorSpan.textContent = message;
        errorSpan.style.opacity = '1';
    };

    // 4. Funciones de Validación de Campos Individuales

    const validateNombre = () => {
        const value = nombre.value.trim();
        if (value === '') {
            setError(nombre, 'error-nombre', 'El nombre completo es requerido y no puede estar vacío.');
            validationState.nombre = false;
        } else {
            setSuccess(nombre, 'error-nombre');
            validationState.nombre = true;
        }
        checkFormValidity();
    };

    const validateUsuario = () => {
        const value = usuario.value.trim();
        if (value === '') {
            setError(usuario, 'error-usuario', 'El nombre de usuario es requerido y no puede estar vacío.');
            validationState.usuario = false;
        } else {
            setSuccess(usuario, 'error-usuario');
            validationState.usuario = true;
        }
        checkFormValidity();
    };

    const validateEmail = () => {
        const value = email.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (value === '') {
            setError(email, 'error-email', 'El correo electrónico es requerido.');
            validationState.email = false;
        } else if (!emailRegex.test(value)) {
            setError(email, 'error-email', 'El formato del correo electrónico no es válido (Ej. nombre@correo.com).');
            validationState.email = false;
        } else {
            setSuccess(email, 'error-email');
            validationState.email = true;
        }
        checkFormValidity();
    };

    const validatePassword = () => {
        const value = password.value;
        const hasNumber = /\d/.test(value);
        const hasUppercase = /[A-Z]/.test(value);
        
        if (value === '') {
            setError(password, 'error-password', 'La contraseña es requerida.');
            validationState.password = false;
        } else if (value.length < 6 || value.length > 18) {
            setError(password, 'error-password', `La contraseña debe tener entre 6 y 18 caracteres. (Actual: ${value.length})`);
            validationState.password = false;
        } else if (!hasNumber || !hasUppercase) {
            setError(password, 'error-password', 'La contraseña debe contener al menos un número (0-9) y al menos una letra mayúscula.');
            validationState.password = false;
        } else {
            setSuccess(password, 'error-password');
            validationState.password = true;
        }
        
        // Revalidar confirmación si ya tiene contenido
        if (confirmPassword.value !== '') {
            validateConfirmPassword();
        }
        checkFormValidity();
    };

    const validateConfirmPassword = () => {
        const pValue = password.value;
        const cpValue = confirmPassword.value;
        
        if (cpValue === '') {
            setError(confirmPassword, 'error-confirm-password', 'Por favor confirma tu contraseña.');
            validationState.confirmPassword = false;
        } else if (pValue !== cpValue) {
            setError(confirmPassword, 'error-confirm-password', 'Las contraseñas ingresadas no coinciden.');
            validationState.confirmPassword = false;
        } else {
            setSuccess(confirmPassword, 'error-confirm-password');
            validationState.confirmPassword = true;
        }
        checkFormValidity();
    };

    const validateFechaNacimiento = () => {
        const value = fechaNacimiento.value;
        
        if (value === '') {
            setError(fechaNacimiento, 'error-fecha-nacimiento', 'La fecha de nacimiento es requerida.');
            validationState.fechaNacimiento = false;
        } else {
            const birthDate = new Date(value);
            const today = new Date();
            
            // Cálculo preciso de edad
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            
            if (age < 13) {
                setError(fechaNacimiento, 'error-fecha-nacimiento', `Debes tener al menos 13 años para registrarte. (Tu edad calculada: ${age} años)`);
                validationState.fechaNacimiento = false;
            } else {
                setSuccess(fechaNacimiento, 'error-fecha-nacimiento');
                validationState.fechaNacimiento = true;
            }
        }
        checkFormValidity();
    };

    // 5. Verificar Validez Completa para Manipular HTML Propiedades (Disabled)
    const checkFormValidity = () => {
        const allValid = Object.values(validationState).every(state => state === true);
        
        // Manipulación dinámica de propiedades HTML (disabled) y estilos CSS
        if (allValid) {
            btnSubmit.removeAttribute('disabled');
            btnSubmit.style.cursor = 'pointer';
            btnSubmit.style.opacity = '1';
        } else {
            btnSubmit.setAttribute('disabled', 'true');
            btnSubmit.style.cursor = 'not-allowed';
            btnSubmit.style.opacity = '0.6';
        }
    };

    // 6. Asignar Escuchadores de Eventos en Tiempo Real (Requisito de Interactividad)
    nombre.addEventListener('input', validateNombre);
    nombre.addEventListener('blur', validateNombre);

    usuario.addEventListener('input', validateUsuario);
    usuario.addEventListener('blur', validateUsuario);

    email.addEventListener('input', validateEmail);
    email.addEventListener('blur', validateEmail);

    password.addEventListener('input', validatePassword);
    password.addEventListener('blur', validatePassword);

    confirmPassword.addEventListener('input', validateConfirmPassword);
    confirmPassword.addEventListener('blur', validateConfirmPassword);

    fechaNacimiento.addEventListener('change', validateFechaNacimiento);
    fechaNacimiento.addEventListener('blur', validateFechaNacimiento);

    // 7. Renderizado Dinámico de Compradores (DOM & LocalStorage)
    const renderBuyers = () => {
        const buyers = JSON.parse(localStorage.getItem('buyers') || '[]');
        
        // Limpiar contenedor
        buyersGrid.innerHTML = '';
        
        if (buyers.length === 0) {
            noBuyersMsg.style.display = 'block';
        } else {
            noBuyersMsg.style.display = 'none';
            
            buyers.forEach((buyer) => {
                // Crear tarjeta del comprador con manipulación dinámica del DOM
                const card = document.createElement('article');
                card.className = 'buyer-card';
                
                // Formatear tags de juegos comprados
                let gamesHTML = '';
                if (buyer.juegos && buyer.juegos.length > 0) {
                    gamesHTML = `<div class="buyer-games-tags">` + 
                        buyer.juegos.map(game => `<span class="game-tag">🎮 ${game}</span>`).join('') + 
                        `</div>`;
                } else {
                    gamesHTML = `<p class="no-games-tag">Ningún juego registrado aún</p>`;
                }
                
                card.innerHTML = `
                    <div class="buyer-header">
                        <span class="buyer-name">${buyer.nombre}</span>
                        <span class="buyer-username">@${buyer.usuario}</span>
                    </div>
                    <p class="buyer-detail">📧 Email: <strong>${buyer.email}</strong></p>
                    <p class="buyer-detail">🎂 Nacimiento: <strong>${buyer.fechaNacimiento}</strong></p>
                    <p class="buyer-detail">📍 Despacho: <strong>${buyer.direccion}</strong></p>
                    <div class="buyer-games">
                        <h4 class="buyer-games-title">Juegos Comprados:</h4>
                        ${gamesHTML}
                    </div>
                `;
                
                buyersGrid.appendChild(card);
            });
        }
    };

    // 8. Envío de Formulario (Submit)
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Evitar recarga
        
        // Revalidar todo por seguridad
        validateNombre();
        validateUsuario();
        validateEmail();
        validatePassword();
        validateConfirmPassword();
        validateFechaNacimiento();
        
        const allValid = Object.values(validationState).every(state => state === true);
        
        if (allValid) {
            // Capturar juegos seleccionados
            const checkedBoxes = document.querySelectorAll('input[name="juegos-favoritos"]:checked');
            const selectedGames = Array.from(checkedBoxes).map(cb => cb.value);
            
            // Crear objeto del nuevo comprador
            const newBuyer = {
                nombre: nombre.value.trim(),
                usuario: usuario.value.trim(),
                email: email.value.trim(),
                fechaNacimiento: fechaNacimiento.value,
                direccion: direccion.value.trim() || 'No especificada',
                juegos: selectedGames
            };
            
            // Guardar en LocalStorage
            const buyers = JSON.parse(localStorage.getItem('buyers') || '[]');
            buyers.push(newBuyer);
            localStorage.setItem('buyers', JSON.stringify(buyers));
            
            // Inyectar modal dinámico de éxito en el DOM
            showSuccessModal(newBuyer.usuario);
            
            // Actualizar lista en pantalla inmediatamente
            renderBuyers();
            
            // Limpiar formulario y restablecer estados
            form.reset();
            resetFormClasses();
        }
    });

    // 9. Modal Místico de Éxito creado dinámicamente
    const showSuccessModal = (username) => {
        const modal = document.createElement('div');
        modal.className = 'success-modal';
        modal.innerHTML = `
            <div class="success-modal-header">◈ ¡Registro Completado! 🧙‍♂️</div>
            <div class="success-modal-body">
                El arcanista <strong>@${username}</strong> ha ingresado con éxito al registro de compradores de <strong>Lagarto Arcano</strong>. ¡Tus recompensas lúdicas te esperan!
            </div>
        `;
        document.body.appendChild(modal);
        
        // Auto-eliminar el modal del DOM después de 4.5 segundos
        setTimeout(() => {
            modal.style.opacity = '0';
            modal.style.transition = 'opacity 0.4s ease';
            setTimeout(() => {
                modal.remove();
            }, 400);
        }, 4500);
    };

    // 10. Botón de Limpieza (Reset)
    form.addEventListener('reset', () => {
        // Permitir que el reset por defecto ocurra, luego limpiar clases de validación
        setTimeout(() => {
            resetFormClasses();
        }, 50);
    });

    const resetFormClasses = () => {
        // Remover clases de éxito y error
        const inputs = [nombre, usuario, email, password, confirmPassword, fechaNacimiento, direccion];
        inputs.forEach(input => {
            input.classList.remove('is-valid', 'is-invalid');
        });
        
        // Limpiar spans de feedback en el DOM
        const spans = document.querySelectorAll('.error-feedback');
        spans.forEach(span => {
            span.textContent = '';
            span.style.opacity = '0';
        });
        
        // Restablecer estados de validación
        for (let key in validationState) {
            validationState[key] = false;
        }
        
        // Deshabilitar botón de submit de nuevo
        checkFormValidity();
    };

    // 11. Renderizado Inicial al cargar la pantalla
    renderBuyers();
});
