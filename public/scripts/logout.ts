// public/scripts/logout.ts

import {manageAdminLinks} from './auth.js'; // Varmista polku oikein

document.addEventListener('DOMContentLoaded', () => {
  const logoutButton = document.querySelector('#logout-button');

  if (logoutButton) {
    logoutButton.addEventListener('click', (e) => {
      e.preventDefault(); // Estää oletuslinkin toiminnan
      localStorage.removeItem('token');
      manageAdminLinks();
      alert('Olet kirjautunut ulos.');
      window.location.href = '/';
    });
  } else {
    console.error('Logout-nappia ei löytynyt DOM:sta.');
  }
});
