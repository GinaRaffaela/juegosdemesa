/**
 * =========================================================================
 *   LAGARTO ARCANO - RECUPERAR CLAVE JS
 *   Lógica de validación del formulario de recuperación
 * =========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-recuperar');
    const email = document.getElementById('email');
    const alertSuccess = document.getElementById('alert-success-recuperar');
    const alertError = document.getElementById('alert-error-recuperar');
    const errorSpan = document.getElementById('error-email');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Limpiar alertas previas
        alertSuccess.classList.add('d-none');
        alertError.classList.add('d-none');
        email.classList.remove('is-valid', 'is-invalid');
        errorSpan.textContent = '';

        const valueEmail = email.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (valueEmail === '') {
            email.classList.add('is-invalid');
            errorSpan.textContent = 'El correo electrónico es requerido.';
            return;
        }

        if (!emailRegex.test(valueEmail)) {
            email.classList.add('is-invalid');
            errorSpan.textContent = 'El formato del correo electrónico no es válido (Ej. nombre@correo.com).';
            alertError.classList.remove('d-none');
            return;
        }

        // Simulación exitosa
        email.classList.add('is-valid');
        alertSuccess.classList.remove('d-none');
        form.reset();
    });

    email.addEventListener('input', () => {
        email.classList.remove('is-invalid', 'is-valid');
        errorSpan.textContent = '';
        alertError.classList.add('d-none');
        alertSuccess.classList.add('d-none');
    });
});
