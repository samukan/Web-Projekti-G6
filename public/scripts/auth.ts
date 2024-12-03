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

// Funktio admin-linkkien piilottamiseen tai näyttämiseen
export function manageAdminLinks(): void {
  const token = localStorage.getItem('token');
  const adminMenuLink = document.getElementById('admin-menu-link');
  const adminTilauksetLink = document.getElementById('admin-tilaukset-link');

  console.log('manageAdminLinks: Tarkistetaan token:', token);

  if (!token) {
    // Piilota admin-linkit, jos ei ole kirjautunut
    if (adminMenuLink) adminMenuLink.style.display = 'none';
    if (adminTilauksetLink) adminTilauksetLink.style.display = 'none';
    console.log('manageAdminLinks: Tokenia ei ole, piilotetaan admin-linkit');
    return;
  }

  const tokenPayload = parseJwt(token);
  console.log('manageAdminLinks: Tokenin payload:', tokenPayload);

  if (tokenPayload && tokenPayload.role === 1) {
    // Näytä admin-linkit, jos käyttäjä on admin
    if (adminMenuLink) adminMenuLink.style.display = 'block';
    if (adminTilauksetLink) adminTilauksetLink.style.display = 'block';
    console.log('manageAdminLinks: Käyttäjä on admin, näytetään admin-linkit');
  } else {
    // Piilota admin-linkit, jos käyttäjä ei ole admin
    if (adminMenuLink) adminMenuLink.style.display = 'none';
    if (adminTilauksetLink) adminTilauksetLink.style.display = 'none';
    console.log(
      'manageAdminLinks: Käyttäjä ei ole admin, piilotetaan admin-linkit'
    );
  }
}

// Funktio autentikoitujen käyttäjien linkkien hallintaan
export function manageAuthenticatedLinks(): void {
  const token = localStorage.getItem('token');
  const logoutButton = document.getElementById('logout-button');
  const cartLink = document.getElementById('cart-link');
  const loginLink = document.getElementById('login-link');
  const registerLink = document.getElementById('register-link');

  console.log('manageAuthenticatedLinks: Tarkistetaan token:', token);

  if (token) {
    // Näytä "Kirjaudu ulos" ja "Ostoskori"
    if (logoutButton) logoutButton.style.display = 'block';
    if (cartLink) cartLink.style.display = 'block';
    console.log(
      'manageAuthenticatedLinks: Näytetään "Kirjaudu ulos" ja "Ostoskori"'
    );

    // Piilota "Kirjaudu sisään" ja "Rekisteröidy"
    if (loginLink) loginLink.style.display = 'none';
    if (registerLink) registerLink.style.display = 'none';
    console.log(
      'manageAuthenticatedLinks: Piilotetaan "Kirjaudu sisään" ja "Rekisteröidy"'
    );
  } else {
    // Piilota "Kirjaudu ulos" ja "Ostoskori"
    if (logoutButton) logoutButton.style.display = 'none';
    if (cartLink) cartLink.style.display = 'none';
    console.log(
      'manageAuthenticatedLinks: Piilotetaan "Kirjaudu ulos" ja "Ostoskori"'
    );

    // Näytä "Kirjaudu sisään" ja "Rekisteröidy"
    if (loginLink) loginLink.style.display = 'block';
    if (registerLink) registerLink.style.display = 'block';
    console.log(
      'manageAuthenticatedLinks: Näytetään "Kirjaudu sisään" ja "Rekisteröidy"'
    );
  }
}

// Yhdistetään kaikki linkkien hallinnointi
export function manageNavigationLinks(): void {
  console.log('manageNavigationLinks: Päivitetään navigaatiolinkit');
  manageAuthenticatedLinks();
  manageAdminLinks();
}

// Funktio kirjautumisen ja uloskirjautumisen yhteydessä
export function setupAuthListeners(): void {
  // Kun sivu ladataan
  document.addEventListener('DOMContentLoaded', () => {
    manageNavigationLinks();
  });

  // Kuuntele "Kirjaudu ulos" -nappia
  const logoutButton = document.getElementById('logout-button');
  if (logoutButton) {
    logoutButton.addEventListener('click', (e) => {
      e.preventDefault(); // Estää oletuslinkin toiminnan
      localStorage.removeItem('token');
      manageNavigationLinks();
      alert('Olet kirjautunut ulos.');
      window.location.href = '/';
    });
  }

  // Kuuntele kirjautumisen tapahtumaa
  const loginForm = document.getElementById(
    'login-form'
  ) as HTMLFormElement | null;
  if (loginForm) {
    loginForm.addEventListener('submit', () => {
      // Odota, että login.ts tallentaa tokenin
      setTimeout(() => {
        manageNavigationLinks();
      }, 500); // Varmista, että token on tallennettu
    });
  }
}

// Alusta auth linkkien hallinta
manageNavigationLinks();
setupAuthListeners();

export {};
