// public/scripts/login.ts

declare const bootstrap: any;
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

// Hakee login form elementin ja liittää siihen tapahtumankuuntelijan
const loginForm = document.getElementById(
  'login-form'
) as HTMLFormElement | null;

if (loginForm) {
  loginForm.addEventListener('submit', async (e: Event) => {
    e.preventDefault();

    const email = (document.getElementById('login-email') as HTMLInputElement)
      ?.value;
    const password = (
      document.getElementById('login-password') as HTMLInputElement
    )?.value;

    if (!email || !password) {
      showToast('Täytä kaikki kentät.', 'warning');
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
        showToast('Kirjautuminen onnistui!', 'success');

        const loginModalElement = document.getElementById(
          'loginModal'
        ) as HTMLElement;
        if (loginModalElement) {
          // Käytetään Modal-luokkaa, ei Toastia modalin sulkemiseen
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
            window.location.href = '/admin/menuAdmin'; // Adminille
          } else if (tokenPayload.role === 3) {
            window.location.href = '/driver/orders'; // Kuljettajalle
          } else if (tokenPayload.role === 2) {
            window.location.href = '/menu.html'; // Asiakkaalle
          } else {
            // Jos rooli on joku muu tai määrittelemätön
            window.location.href = '/menu.html';
          }
        }, 1500); // Viive ennen uudelleenohjausta
      } else {
        showToast(data.message || 'Kirjautuminen epäonnistui.', 'danger');
      }
    } catch (error) {
      console.error('Palvelinvirhe:', error);
      showToast('Palvelinvirhe. Yritä myöhemmin uudelleen.', 'danger');
    }
  });
}

export {};
