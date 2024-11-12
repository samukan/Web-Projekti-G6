var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// public/scripts/login.ts
import * as bootstrap from 'bootstrap';
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => __awaiter(void 0, void 0, void 0, function* () {
        e.preventDefault();
        const email = document.getElementById('login-email')
            .value;
        const password = document.getElementById('login-password').value;
        try {
            const response = yield fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = yield response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                alert('Kirjautuminen onnistui!');
                // Suljetaan modaali
                const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
                loginModal.hide();
                // Päivitetään sivu tai uudelleenohjataan
                // location.reload();
            }
            else {
                alert(data.message || 'Kirjautuminen epäonnistui.');
            }
        }
        catch (error) {
            console.error(error);
            alert('Palvelinvirhe.');
        }
    }));
}
//# sourceMappingURL=login.js.map