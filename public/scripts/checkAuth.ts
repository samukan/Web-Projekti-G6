// public/scripts/checkAuth.ts
// Tää file tarkistaa, että käyttäjä on kirjautunut sisään ja että on oikeudet adminsivulle. Tän pitäis olla back-end puolella, mutta nyt se on front-endissä.

export function checkAuth() {
  const token = localStorage.getItem('token');

  if (!token) {
    alert('Sinun täytyy kirjautua sisään.');
    window.location.href = '/';
    return;
  }

  const tokenPayload = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
  const isAdminPage = window.location.pathname.includes('menuAdmin');

  // Tarkistetaan admin-oikeudet, jos ollaan admin-sivulla
  if (isAdminPage && tokenPayload.role !== 1) {
    alert('Ei oikeuksia admin-sivulle.');
    window.location.href = '/';
    return;
  }
}
