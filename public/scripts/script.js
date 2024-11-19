"use strict";
// script.ts
Object.defineProperty(exports, "__esModule", { value: true });
const cart_js_1 = require("./cart.js");
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
    (0, cart_js_1.updateCartModal)();
    // Tarkista, onko käyttäjä kirjautunut sisään
    updateUIAfterLogin();
    // Aseta "Lisää ostoskoriin" -napit, jos niitä on sivulla
    if (document.querySelectorAll('.add-to-cart').length > 0) {
        (0, cart_js_1.setupAddToCartButtons)();
    }
});
// Päivitetään käyttöliittymä kirjautumisen jälkeen
function updateUIAfterLogin() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const loginNavItem = document.getElementById('login-nav-item');
    const logoutNavItem = document.getElementById('logout-nav-item');
    const adminNavItem = document.getElementById('admin-nav-item');
    if (user && user.email) {
        if (loginNavItem)
            loginNavItem.style.display = 'none';
        if (logoutNavItem)
            logoutNavItem.style.display = 'block';
        // Näytä admin-linkki, jos käyttäjä on admin
        if (user.role === 'admin' && adminNavItem) {
            adminNavItem.style.display = 'block';
        }
    }
    else {
        // Käyttäjä ei ole kirjautunut sisään
        if (loginNavItem)
            loginNavItem.style.display = 'block';
        if (logoutNavItem)
            logoutNavItem.style.display = 'none';
        if (adminNavItem)
            adminNavItem.style.display = 'none';
    }
}
// Kirjaudu ulos
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Päivitä käyttöliittymä
        updateUIAfterLogin();
    });
}
