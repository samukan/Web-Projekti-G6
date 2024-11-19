// public/scripts/register.ts
import * as bootstrap from 'bootstrap';
const registerForm = document.getElementById('register-form');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('register-email')?.value;
        const password = document.getElementById('register-password')?.value;
        const passwordConfirm = document.getElementById('register-password-confirm')?.value;
        if (!email || !password || !passwordConfirm) {
            alert('Täytä kaikki kentät.');
            return;
        }
        if (password !== passwordConfirm) {
            alert('Salasanat eivät täsmää.');
            return;
        }
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (response.ok) {
                alert('Rekisteröityminen onnistui! Voit nyt kirjautua sisään.');
                const registerModalElement = document.getElementById('registerModal');
                if (registerModalElement) {
                    const registerModal = bootstrap.Modal.getInstance(registerModalElement);
                    registerModal?.hide();
                }
                const loginModalElement = document.getElementById('loginModal');
                if (loginModalElement) {
                    const loginModal = new bootstrap.Modal(loginModalElement);
                    loginModal.show();
                }
            }
            else {
                alert(data.message || 'Rekisteröityminen epäonnistui.');
            }
        }
        catch (error) {
            console.error(error);
            alert('Palvelinvirhe.');
        }
    });
}
//# sourceMappingURL=register.js.map