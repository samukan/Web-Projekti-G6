var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// public/scripts/register.ts
import * as bootstrap from 'bootstrap';
const registerForm = document.getElementById('register-form');
if (registerForm) {
    registerForm.addEventListener('submit', (e) => __awaiter(void 0, void 0, void 0, function* () {
        e.preventDefault();
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const passwordConfirm = document.getElementById('register-password-confirm').value;
        if (password !== passwordConfirm) {
            alert('Salasanat eivät täsmää.');
            return;
        }
        try {
            const response = yield fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = yield response.json();
            if (response.ok) {
                alert('Rekisteröityminen onnistui! Voit nyt kirjautua sisään.');
                // Suljetaan rekisteröitymismodaali ja avataan kirjautumismodaali
                const registerModal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
                registerModal.hide();
                const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
                loginModal.show();
            }
            else {
                alert(data.message || 'Rekisteröityminen epäonnistui.');
            }
        }
        catch (error) {
            console.error(error);
            alert('Palvelinvirhe.');
        }
    }));
}
//# sourceMappingURL=register.js.map