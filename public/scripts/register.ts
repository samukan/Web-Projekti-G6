// public/scripts/register.ts

declare const bootstrap: any;

// lisää toasti
function showToast(message: string, type: 'success' | 'danger' = 'success') {
  const toastContainer =
    document.getElementById('toast-container') || createToastContainer();

  const toastElement = document.createElement('div');
  toastElement.className = `toast align-items-center text-white bg-${type} border-0`;
  toastElement.setAttribute('role', 'alert');
  toastElement.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">
        ${message}
      </div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
    </div>
  `;

  toastContainer.appendChild(toastElement);
  const toast = new bootstrap.Toast(toastElement);
  toast.show();
}

// Luo toast containerin, jos sitä ei ole vielä olemassa
function createToastContainer(): HTMLDivElement {
  const container = document.createElement('div');
  container.id = 'toast-container';
  container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
  document.body.appendChild(container);
  return container;
}

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
      showToast('Täytä kaikki kentät.', 'danger');
      return;
    }

    if (password !== passwordConfirm) {
      showToast('Salasanat eivät täsmää.', 'danger');
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
        showToast(
          'Rekisteröityminen onnistui! Voit nyt kirjautua sisään.',
          'success'
        );

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
        showToast(data.message || 'Rekisteröityminen epäonnistui.', 'danger');
      }
    } catch (error) {
      console.error(error);
      showToast('Palvelinvirhe.', 'danger');
    }
  });
}

export {};
