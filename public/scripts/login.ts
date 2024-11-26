// public/scripts/login.ts

// Bootstrap jutut on vähän mystisiä, joten ne pitää vaan hyväksyä näin.
declare const bootstrap: any; // Jos tän poistaa niin tulee erroria tai ehkä ei

// Hakee login form elementin ja liittää siihen tapahtumakuuntelijan
const loginForm = document.getElementById(
  'login-form'
) as HTMLFormElement | null;

if (loginForm) {
  loginForm.addEventListener('submit', async (e: Event) => {
    e.preventDefault();

    const email = (
      document.getElementById('login-email') as HTMLInputElement | null
    )?.value;
    const password = (
      document.getElementById('login-password') as HTMLInputElement | null
    )?.value;

    if (!email || !password) {
      alert('Täytä kaikki kentät.');
      return;
    }

    try {
      // Lähetetään kirjautumistiedot backendille ja rukoillaan että kaikki menee hyvin
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email, password}),
      });

      const data = await response.json();

      if (response.ok) {
        // Tallenna token paikallisesti
        localStorage.setItem('token', data.token);
        alert('Kirjautuminen onnistui!');

        const loginModalElement = document.getElementById('loginModal');
        if (loginModalElement) {
          const loginModal = bootstrap.Modal.getInstance(loginModalElement);
          loginModal?.hide();
        }

        // Tarkistetaan käyttäjän rooli
        const tokenPayload = JSON.parse(atob(data.token.split('.')[1])); // Decode JWT payload
        if (tokenPayload.role === 1) {
          window.location.href = '/admin/menuAdmin';
        } else {
          window.location.href = '/menu.html'; // Ohjaa käyttäjä tänne, Ehkä login.html sivulle?
        }
      } else {
        alert(data.message || 'Kirjautuminen epäonnistui.');
      }
    } catch (error) {
      console.error('Palvelinvirhe:', error);
      alert('Palvelinvirhe. Yritä myöhemmin uudelleen.');
    }
  });
}

// Tarkista kirjautumistila
export function checkAuth() {
  const token = localStorage.getItem('token');
  const currentPath = window.location.pathname;

  if (!token) {
    // Ei kirjautunut sisään
    if (
      currentPath.includes('menuAdmin') ||
      currentPath.includes('tilaukset')
    ) {
      alert('Sinun täytyy kirjautua sisään!');
      window.location.href = '/';
    }
    return;
  }

  // Varmista rooli, jos sivu on suojattu
  const tokenPayload = JSON.parse(atob(token.split('.')[1]));
  if (currentPath.includes('menuAdmin') && tokenPayload.role !== 1) {
    alert('Ei oikeuksia admin-sivulle.');
    window.location.href = '/';
  }
}
