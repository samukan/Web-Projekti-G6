// public/scripts/login.ts
// Kirjautumislomakkeen käsittely
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email')?.value;
        const password = document.getElementById('login-password')?.value;
        if (!email || !password) {
            alert('Täytä kaikki kentät.');
            return;
        }
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                alert('Kirjautuminen onnistui!');
                const loginModalElement = document.getElementById('loginModal');
                if (loginModalElement) {
                    const loginModal = bootstrap.Modal.getInstance(loginModalElement);
                    loginModal?.hide();
                }
                const tokenPayload = JSON.parse(atob(data.token.split('.')[1])); // Decode JWT payload
                if (tokenPayload.role === 1) {
                    window.location.href = '/menuAdmin.html';
                }
                else {
                    window.location.href = '/menu.html';
                }
            }
            else {
                alert(data.message || 'Kirjautuminen epäonnistui.');
            }
        }
        catch (error) {
            console.error('Palvelinvirhe:', error);
            alert('Palvelinvirhe. Yritä myöhemmin uudelleen.');
        }
    });
}
// Tarkista kirjautumistila
export function checkAuth() {
    const token = localStorage.getItem('token');
    const currentPath = window.location.pathname;
    if (!token) {
        // Ei kirjautunut sisään
        if (currentPath.includes('menuAdmin') ||
            currentPath.includes('tilaukset')) {
            alert('Sinun täytyy kirjautua sisään!');
            window.location.href = '/';
        }
        return;
    }
    // Varmista rooli, jos sivu on suojattu
    const tokenPayload = JSON.parse(atob(token.split('.')[1]));
    if (currentPath.includes('menuAdmin') && tokenPayload.role !== 1) {
        alert('Ei oikeuksia admin-sivulle.');
        window.location.href = '/';
    }
}
//# sourceMappingURL=login.js.map