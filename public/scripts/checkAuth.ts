// public/scripts/checkAuth.ts

export function checkAuth() {
  const token = localStorage.getItem('token');

  if (!token) {
    alert('Sinun täytyy kirjautua sisään.');
    window.location.href = '/';
    return;
  }

  try {
    const tokenPayload = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
    const isAdminPage = window.location.pathname.includes('menuAdmin');

    // Tarkistetaan admin-oikeudet, jos ollaan admin-sivulla
    if (isAdminPage && tokenPayload.role !== 1) {
      alert('Ei oikeuksia admin-sivulle.');
      window.location.href = '/';
      return;
    }
  } catch (error) {
    console.error('Virhe tokenin dekoodauksessa:', error);
    alert('Virheellinen token. Kirjaudu uudelleen.');
    window.location.href = '/';
  }
}
