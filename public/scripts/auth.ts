// public/scripts/auth.ts

// Funktio tokenin purkamiseen
export function parseJwt(token: string): any {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    console.error('Tokenin purkaminen epäonnistui:', e);
    return null;
  }
}

// Funktio toast-ilmoitusten näyttämiseen
export function showToast(message: string, type: string = 'info'): void {
  // Luo uusi toast-elementti
  const toastEl = document.createElement('div');
  toastEl.className = `toast align-items-center text-bg-${type} border-0`;
  toastEl.role = 'alert';
  toastEl.ariaLive = 'assertive';
  toastEl.ariaAtomic = 'true';

  // Toastin sisältö
  toastEl.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">${message}</div>
        <button
          type="button"
          class="btn-close btn-close-white me-2 m-auto"
          data-bs-dismiss="toast"
          aria-label="Sulje"
        ></button>
      </div>
    `;

  // Lisää toast kontaineriin
  const toastContainer =
    document.querySelector('.toast-container') || document.body;
  toastContainer.appendChild(toastEl);

  // Näytä toast
  const toast = new bootstrap.Toast(toastEl);
  toast.show();

  // Poista toast DOM:sta, kun se on piilotettu
  toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
}

// Funktio admin-linkkien piilottamiseen tai näyttämiseen
export function manageAdminLinks(): void {
  const token = localStorage.getItem('token');
  const adminMenuLink = document.getElementById('admin-menu-link');
  const adminTilauksetLink = document.getElementById('admin-tilaukset-link');

  if (!token) {
    if (adminMenuLink) adminMenuLink.style.display = 'none';
    if (adminTilauksetLink) adminTilauksetLink.style.display = 'none';
    return;
  }

  const tokenPayload = parseJwt(token);
  if (tokenPayload && tokenPayload.role === 1) {
    if (adminMenuLink) adminMenuLink.style.display = 'block';
    if (adminTilauksetLink) adminTilauksetLink.style.display = 'block';
  } else {
    if (adminMenuLink) adminMenuLink.style.display = 'none';
    if (adminTilauksetLink) adminTilauksetLink.style.display = 'none';
  }
}

// Funktio autentikoitujen käyttäjien linkkien hallintaan
export function manageAuthenticatedLinks(): void {
  const token = localStorage.getItem('token');
  const logoutButton = document.getElementById('logout-button');
  const cartLink = document.getElementById('cart-link');
  const loginLink = document.getElementById('login-link');
  const registerLink = document.getElementById('register-link');

  if (token) {
    if (logoutButton) logoutButton.style.display = 'block';
    if (cartLink) cartLink.style.display = 'block';
    if (loginLink) loginLink.style.display = 'none';
    if (registerLink) registerLink.style.display = 'none';
  } else {
    if (logoutButton) logoutButton.style.display = 'none';
    if (cartLink) cartLink.style.display = 'none';
    if (loginLink) loginLink.style.display = 'block';
    if (registerLink) registerLink.style.display = 'block';
  }
}

// Funktio tarkistamaan, onko käyttäjä kirjautunut sisään
export function isAuthenticated(): boolean {
  const token = localStorage.getItem('token');
  return !!token;
}

// Yhdistetään kaikki linkkien hallinnointi
export function manageNavigationLinks(): void {
  manageAuthenticatedLinks();
  manageAdminLinks();
}

// Funktio kirjautumisen ja uloskirjautumisen yhteydessä
export function setupAuthListeners(): void {
  document.addEventListener('DOMContentLoaded', () => {
    manageNavigationLinks();
  });

  // Kuuntele "Kirjaudu ulos" -nappia
  const logoutButton = document.getElementById('logout-button');
  if (logoutButton) {
    logoutButton.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('token');
      manageNavigationLinks();
      showToast('Olet kirjautunut ulos.', 'success');
      setTimeout(() => {
        window.location.href = '/';
      }, 1500); // Viive 1,5 sekuntia
    });
  }
}

// Alusta auth linkkien hallinta
manageNavigationLinks();
setupAuthListeners();

export {};
