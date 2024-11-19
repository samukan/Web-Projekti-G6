"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// public/scripts/login.ts
const bootstrap = __importStar(require("bootstrap"));
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email')
            .value;
        const password = document.getElementById('login-password').value;
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                alert('Kirjautuminen onnistui!');
                const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
                loginModal?.hide();
                // Päivitetään käyttöliittymä
                updateUIAfterLogin();
            }
            else {
                alert(data.message || 'Kirjautuminen epäonnistui.');
            }
        }
        catch (error) {
            console.error(error);
            alert('Palvelinvirhe.');
        }
    });
}
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
}
// Kirjaudu ulos
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Päivitä käyttöliittymä
        updateUIAfterLogout();
    });
}
function updateUIAfterLogout() {
    const loginNavItem = document.getElementById('login-nav-item');
    const logoutNavItem = document.getElementById('logout-nav-item');
    const adminNavItem = document.getElementById('admin-nav-item');
    if (loginNavItem)
        loginNavItem.style.display = 'block';
    if (logoutNavItem)
        logoutNavItem.style.display = 'none';
    if (adminNavItem)
        adminNavItem.style.display = 'none';
}
