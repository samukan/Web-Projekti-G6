// script.ts
import { setupAddToCartButtons, updateCartModal } from './cart.js';
// Teemakytkin
const themeToggleBtn = document.getElementById('theme-toggle');
if (themeToggleBtn) {
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        let theme = 'light';
        if (document.body.classList.contains('dark-theme')) {
            theme = 'dark';
        }
        localStorage.setItem('theme', theme);
    });
}
// Kun sivu latautuu
document.addEventListener('DOMContentLoaded', () => {
    // Päivitä ostoskori
    updateCartModal();
    // Aseta "Lisää ostoskoriin" -napit, jos niitä on sivulla
    if (document.querySelectorAll('.add-to-cart').length > 0) {
        setupAddToCartButtons();
    }
});
// Kirjautumislomakkeen käsittely (vain jos sivulla on kirjautumislomake)
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Kirjautuminen ei ole käytettävissä.');
    });
}
//# sourceMappingURL=script.js.map