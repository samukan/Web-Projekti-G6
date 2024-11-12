// public/scripts/register.ts
import * as bootstrap from 'bootstrap';

const registerForm = document.getElementById(
  'register-form'
) as HTMLFormElement;

if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = (
      document.getElementById('register-email') as HTMLInputElement
    ).value;
    const password = (
      document.getElementById('register-password') as HTMLInputElement
    ).value;
    const passwordConfirm = (
      document.getElementById('register-password-confirm') as HTMLInputElement
    ).value;

    if (password !== passwordConfirm) {
      alert('Salasanat eivät täsmää.');
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email, password}),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Rekisteröityminen onnistui! Voit nyt kirjautua sisään.');
        // Suljetaan rekisteröitymismodaali ja avataan kirjautumismodaali
        const registerModal = bootstrap.Modal.getInstance(
          document.getElementById('registerModal')!
        );
        registerModal.hide();

        const loginModal = new bootstrap.Modal(
          document.getElementById('loginModal')!
        );
        loginModal.show();
      } else {
        alert(data.message || 'Rekisteröityminen epäonnistui.');
      }
    } catch (error) {
      console.error(error);
      alert('Palvelinvirhe.');
    }
  });
}
