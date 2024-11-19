// public/scripts/login.ts
// Tää file on vastuussa kirjautumisesta ja kirjautumisen tarkistamisesta.

// Bootstrap jutut on vähän mystisiä, joten ne pitää vaan hyväksyä näin.
declare const bootstrap: any;

// Haetaan login-form
const loginForm = document.getElementById(
  'login-form'
) as HTMLFormElement | null;

if (loginForm) {
  loginForm.addEventListener('submit', async (e: Event) => {
    e.preventDefault();

    // Haetaan syötetyt arvot
    const email = (
      document.getElementById('login-email') as HTMLInputElement | null
    )?.value;
    const password = (
      document.getElementById('login-password') as HTMLInputElement | null
    )?.value;

    if (!email || !password) {
      // Jos joku yrittää olla ovela ja jättää kentät tyhjiksi...
      alert('Täytä kaikki kentät.');
      return;
    }

    try {
      // Lähetetään kirjautumistiedot backendille ja rukoillaan
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

        // Suljetaan modal
        const loginModalElement = document.getElementById('loginModal');
        if (loginModalElement) {
          const loginModal = bootstrap.Modal.getInstance(loginModalElement);
          loginModal?.hide();
        }

        // Tarkistetaan käyttäjän rooli
        const tokenPayload = JSON.parse(atob(data.token.split('.')[1])); // Decode JWT payload
        if (tokenPayload.role === 1) {
          window.location.href = '/menuAdmin.html'; // Admin-sivulle
        } else {
          window.location.href = '/menu.html'; // Perus käyttäjät vaikka tänne?!
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

// Funktio tarkistaa onko käyttäjä oikeasti kirjautunut sisään.
export function checkAuth() {
  const token = localStorage.getItem('token');
  const currentPath = window.location.pathname;

  if (!token) {
    // Ei kirjautunut sisään
    if (
      currentPath.includes('menuAdmin') || // Admin sivut vaatii kirjautumise
      currentPath.includes('tilaukset')
    ) {
      alert('Sinun täytyy kirjautua sisään!');
      window.location.href = '/'; // Redirecti takas etusivulle
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
