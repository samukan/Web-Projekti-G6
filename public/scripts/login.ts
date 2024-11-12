// public/scripts/login.ts
import * as bootstrap from 'bootstrap';

const loginForm = document.getElementById('login-form') as HTMLFormElement;

if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = (document.getElementById('login-email') as HTMLInputElement)
      .value;
    const password = (
      document.getElementById('login-password') as HTMLInputElement
    ).value;

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email, password}),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        alert('Kirjautuminen onnistui!');
        // Suljetaan modaali
        const loginModal = bootstrap.Modal.getInstance(
          document.getElementById('loginModal')!
        );
        loginModal.hide();
        // Päivitetään sivu tai uudelleenohjataan
        // location.reload();
      } else {
        alert(data.message || 'Kirjautuminen epäonnistui.');
      }
    } catch (error) {
      console.error(error);
      alert('Palvelinvirhe.');
    }
  });
}
