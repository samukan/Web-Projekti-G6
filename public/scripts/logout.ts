// public/scripts/logout.ts
// Tää on se file missä sanotaan "moi moi" tokenille

document.addEventListener('DOMContentLoaded', () => {
  const logoutButton = document.querySelector('#logout-button');

  if (logoutButton) {
    logoutButton.addEventListener('click', (e: Event) => {
      e.preventDefault();
      localStorage.removeItem('token');
      // Varmistetaan tokenin tila konsolilla
      console.log('Token after removal:', localStorage.getItem('token')); // Varmista tokenin tila
      alert('Olet kirjautunut ulos.');
      window.location.href = '/';
    });
  } else {
    // Jos nappia ei löydy nii virhe konsoliin. Joku unohti laittaa sen HTML:ään?!
    console.error('Logout-nappia ei löytynyt DOM:sta.');
  }
});
