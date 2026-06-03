/**
 * =========================================================================
 *   LAGARTO ARCANO - REGISTRO JS
 *   Lógica de validación avanzada y registro en localStorage
 * =========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Elementos de Caché del Formulario
    const form = document.getElementById('form-registro');
    const nombre = document.getElementById('nombre');
    const usuario = document.getElementById('usuario');
    const email = document.getElementById('email');
    const rol = document.getElementById('rol');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirm-password');
    const fechaNacimiento = document.getElementById('fecha-nacimiento');
    const direccion = document.getElementById('direccion');
    
    // Botones
    const btnSubmit = document.getElementById('btn-submit');

    // 2. Estado de validación por cada campo requerido
    const validationState = {
        nombre: false,
        usuario: false,
        email: false,
        rol: false,
        password: false,
        confirmPassword: false,
        fechaNacimiento: false
    };

    // 3. Helpers de inyección del DOM para Clases CSS y Spans de error
    const setSuccess = (inputElement, errorSpanId) => {
        inputElement.classList.remove('is-invalid');
        inputElement.classList.add('is-valid');
        const errorSpan = document.getElementById(errorSpanId);
        errorSpan.textContent = '';
    };

    const setError = (inputElement, errorSpanId, message) => {
        inputElement.classList.remove('is-valid');
        inputElement.classList.add('is-invalid');
        const errorSpan = document.getElementById(errorSpanId);
        errorSpan.textContent = message;
    };

    // 4. Funciones de Validación de Campos
    const validateNombre = () => {
        const value = nombre.value.trim();
        if (value === '') {
            setError(nombre, 'error-nombre', 'El nombre completo es requerido.');
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
            setError(usuario, 'error-usuario', 'El nombre de usuario es requerido.');
            validationState.usuario = false;
        } else if (value.length < 3) {
            setError(usuario, 'error-usuario', 'El usuario debe tener al menos 3 caracteres.');
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
            setError(email, 'error-email', 'Formato de correo no es válido (Ej: nombre@correo.com).');
            validationState.email = false;
        } else {
            setSuccess(email, 'error-email');
            validationState.email = true;
        }
        checkFormValidity();
    };

    const validateRol = () => {
        const value = rol.value;
        if (!value) {
            setError(rol, 'error-rol', 'Debes seleccionar un rol para el usuario.');
            validationState.rol = false;
        } else {
            setSuccess(rol, 'error-rol');
            validationState.rol = true;
        }
        checkFormValidity();
    };

    const validatePassword = () => {
        const value = password.value;
        
        // 5 validaciones de seguridad solicitadas:
        const minLength = value.length >= 8;                     // 1. Longitud mínima de 8
        const maxLength = value.length <= 20;                    // 2. Longitud máxima de 20
        const hasUppercase = /[A-Z]/.test(value);                // 3. Al menos una mayúscula
        const hasNumber = /\d/.test(value);                      // 4. Al menos un número
        const hasSpecialChar = /[@$!%*?&]/.test(value);          // 5. Al menos un carácter especial
        
        if (value === '') {
            setError(password, 'error-password', 'La contraseña es requerida.');
            validationState.password = false;
        } else if (!minLength || !maxLength) {
            setError(password, 'error-password', `La contraseña debe tener entre 8 y 20 caracteres. (Largo actual: ${value.length})`);
            validationState.password = false;
        } else if (!hasUppercase) {
            setError(password, 'error-password', 'Debe contener al menos una letra mayúscula.');
            validationState.password = false;
        } else if (!hasNumber) {
            setError(password, 'error-password', 'Debe contener al menos un número.');
            validationState.password = false;
        } else if (!hasSpecialChar) {
            setError(password, 'error-password', 'Debe contener al menos un carácter especial (@$!%*?&).');
            validationState.password = false;
        } else {
            setSuccess(password, 'error-password');
            validationState.password = true;
        }
        
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
            setError(confirmPassword, 'error-confirm-password', 'Las contraseñas no coinciden.');
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
                setError(fechaNacimiento, 'error-fecha-nacimiento', `La persona no puede tener menos de 13 años para registrarse. (Edad actual: ${age} años).`);
                validationState.fechaNacimiento = false;
            } else {
                setSuccess(fechaNacimiento, 'error-fecha-nacimiento');
                validationState.fechaNacimiento = true;
            }
        }
        checkFormValidity();
    };

    // Habilitar o deshabilitar botón de enviar dinámicamente
    const checkFormValidity = () => {
        const allValid = Object.values(validationState).every(state => state === true);
        if (allValid) {
            btnSubmit.removeAttribute('disabled');
        } else {
            btnSubmit.setAttribute('disabled', 'true');
        }
    };

    // 5. Escuchadores de eventos para validación en tiempo real
    nombre.addEventListener('input', validateNombre);
    nombre.addEventListener('blur', validateNombre);

    usuario.addEventListener('input', validateUsuario);
    usuario.addEventListener('blur', validateUsuario);

    email.addEventListener('input', validateEmail);
    email.addEventListener('blur', validateEmail);

    rol.addEventListener('change', validateRol);
    rol.addEventListener('blur', validateRol);

    password.addEventListener('input', validatePassword);
    password.addEventListener('blur', validatePassword);

    confirmPassword.addEventListener('input', validateConfirmPassword);
    confirmPassword.addEventListener('blur', validateConfirmPassword);

    fechaNacimiento.addEventListener('change', validateFechaNacimiento);
    fechaNacimiento.addEventListener('blur', validateFechaNacimiento);

    // 6. Envío del formulario
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Revalidar todo por seguridad
        validateNombre();
        validateUsuario();
        validateEmail();
        validateRol();
        validatePassword();
        validateConfirmPassword();
        validateFechaNacimiento();

        const allValid = Object.values(validationState).every(state => state === true);
        
        if (allValid) {
            const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
            
            // Verificar si el usuario ya existe
            const usernameExists = registeredUsers.some(user => user.usuario === usuario.value.trim());
            const emailExists = registeredUsers.some(user => user.email === email.value.trim());

            if (usernameExists) {
                setError(usuario, 'error-usuario', 'El nombre de usuario ya está registrado por otro arcanista.');
                return;
            }
            if (emailExists) {
                setError(email, 'error-email', 'El correo electrónico ya está registrado por otro arcanista.');
                return;
            }

            // Crear y guardar el nuevo usuario
            const newUser = {
                nombre: nombre.value.trim(),
                usuario: usuario.value.trim(),
                email: email.value.trim(),
                rol: rol.value,
                password: password.value,
                fechaNacimiento: fechaNacimiento.value,
                direccion: direccion.value.trim() || 'No especificada'
            };

            registeredUsers.push(newUser);
            localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));

            alert(`¡Registro Exitoso! Bienvenido/a a Lagarto Arcano, ${newUser.nombre}. Serás redirigido/a al inicio de sesión.`);
            form.reset();
            resetFormClasses();
            
            // Redirigir a login
            window.location.href = 'login.html';
        }
    });

    // 7. Botón de Limpieza (Reset)
    form.addEventListener('reset', () => {
        setTimeout(() => {
            resetFormClasses();
        }, 50);
    });

    const resetFormClasses = () => {
        const inputs = [nombre, usuario, email, rol, password, confirmPassword, fechaNacimiento, direccion];
        inputs.forEach(input => {
            input.classList.remove('is-valid', 'is-invalid');
        });
        
        const errorSpans = document.querySelectorAll('.error-feedback');
        errorSpans.forEach(span => {
            span.textContent = '';
        });
        
        for (let key in validationState) {
            validationState[key] = false;
        }
        checkFormValidity();
    };
});
