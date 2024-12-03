// public/scripts/login.ts

import {manageAdminLinks, manageAuthenticatedLinks, showToast} from './auth.js';

// Tokenin purkaminen funktiota varten
function parseJwt(token: string): any {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    console.error('Tokenin purkaminen epäonnistui:', e);
    return null;
  }
}

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
      showToast('Täytä kaikki kentät.', 'warning'); // Korvattu alert
      return;
    }

    try {
      // Lähetetään kirjautumistiedot backendille
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email, password}),
      });

      const data = await response.json();

      if (response.ok) {
        // Tallenna token paikallisesti
        localStorage.setItem('token', data.token);
        showToast('Kirjautuminen onnistui!', 'success'); // Korvattu alert

        const loginModalElement = document.getElementById('loginModal');
        if (loginModalElement) {
          const loginModal =
            bootstrap.Modal.getInstance(loginModalElement) ||
            new bootstrap.Modal(loginModalElement);
          loginModal.hide();
        }

        // Päivitä navigaatiolinkit
        manageAdminLinks();
        manageAuthenticatedLinks();

        // Tarkistetaan käyttäjän rooli
        const tokenPayload = parseJwt(data.token); // Decode JWT payload
        setTimeout(() => {
          if (tokenPayload.role === 1) {
            window.location.href = '/admin/menuAdmin'; // Ohjataan adminille
          } else {
            window.location.href = '/menu.html'; // Ohjataan asiakas-näkymään
          }
        }, 1500); // Viive 1,5 sekuntia ennen uudelleenohjausta
      } else {
        showToast(data.message || 'Kirjautuminen epäonnistui.', 'danger'); // Korvattu alert
      }
    } catch (error) {
      console.error('Palvelinvirhe:', error);
      showToast('Palvelinvirhe. Yritä myöhemmin uudelleen.', 'danger'); // Korvattu alert
    }
  });
}

export {};
