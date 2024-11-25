// public/scripts/logout.ts
// Kirjaudu ulos funktio täällä.

document.addEventListener('DOMContentLoaded', () => {
  const logoutButton = document.querySelector('#logout-button');

  if (logoutButton) {
    logoutButton.addEventListener('click', (e: Event) => {
      e.preventDefault();
      localStorage.removeItem('token');
      console.log('Token after removal:', localStorage.getItem('token')); // Varmista tokenin tila
      alert('Olet kirjautunut ulos.');
      window.location.href = '/';
    });
  } else {
    console.error('Logout-nappia ei löytynyt DOM:sta.');
  }
});
