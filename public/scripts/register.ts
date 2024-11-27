// public/scripts/register.ts

declare const bootstrap: any;

const registerForm = document.getElementById(
  'register-form'
) as HTMLFormElement | null;

if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = (
      document.getElementById('register-email') as HTMLInputElement
    )?.value;
    const password = (
      document.getElementById('register-password') as HTMLInputElement
    )?.value;
    const passwordConfirm = (
      document.getElementById('register-password-confirm') as HTMLInputElement
    )?.value;

    if (!email || !password || !passwordConfirm) {
      alert('Täytä kaikki kentät.');
      return;
    }

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

        // Piilota rekisteröitymisikkuna
        const registerModalElement = document.getElementById('registerModal');
        if (registerModalElement) {
          const registerModal =
            bootstrap.Modal.getInstance(registerModalElement) ||
            new bootstrap.Modal(registerModalElement);
          registerModal.hide();
        }

        // Näytä kirjautumisikkuna
        const loginModalElement = document.getElementById('loginModal');
        if (loginModalElement) {
          const loginModal =
            bootstrap.Modal.getInstance(loginModalElement) ||
            new bootstrap.Modal(loginModalElement);
          loginModal.show();
        }
      } else {
        alert(data.message || 'Rekisteröityminen epäonnistui.');
      }
    } catch (error) {
      console.error(error);
      alert('Palvelinvirhe.');
    }
  });
}

export {};
