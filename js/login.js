/**
 * =========================================================================
 *   LAGARTO ARCANO - LOGIN JS
 *   Lógica de validación y control de sesión del usuario
 * =========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-login');
    const identificador = document.getElementById('identificador');
    const password = document.getElementById('password');
    const alertError = document.getElementById('alert-error-login');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Limpiar estados previos
        alertError.classList.add('d-none');
        identificador.classList.remove('is-invalid');
        password.classList.remove('is-invalid');
        document.getElementById('error-identificador').textContent = '';
        document.getElementById('error-password').textContent = '';

        const valueIdentificador = identificador.value.trim();
        const valuePassword = password.value;

        let hasError = false;

        // Validar vacío
        if (valueIdentificador === '') {
            identificador.classList.add('is-invalid');
            document.getElementById('error-identificador').textContent = 'El nombre de usuario o correo es requerido.';
            hasError = true;
        }

        if (valuePassword === '') {
            password.classList.add('is-invalid');
            document.getElementById('error-password').textContent = 'La contraseña es requerida.';
            hasError = true;
        }

        if (hasError) return;

        // Buscar el usuario en localStorage
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const matchedUser = registeredUsers.find(user => 
            user.usuario === valueIdentificador || user.email === valueIdentificador
        );

        // Validar credenciales
        if (matchedUser && matchedUser.password === valuePassword) {
            // Guardar usuario activo en la sesión
            localStorage.setItem('currentUser', JSON.stringify(matchedUser));
            
            alert(`¡Bienvenido de vuelta, ${matchedUser.nombre}!`);

            // Redirección según el rol
            if (matchedUser.rol === 'administrador') {
                window.location.href = 'admin/productos.html';
            } else {
                window.location.href = 'index.html';
            }
        } else {
            // Mostrar error general
            alertError.classList.remove('d-none');
            identificador.classList.add('is-invalid');
            password.classList.add('is-invalid');
        }
    });

    // Quitar clases invalid al escribir
    identificador.addEventListener('input', () => {
        identificador.classList.remove('is-invalid');
        document.getElementById('error-identificador').textContent = '';
    });

    password.addEventListener('input', () => {
        password.classList.remove('is-invalid');
        document.getElementById('error-password').textContent = '';
    });
});
