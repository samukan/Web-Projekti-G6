import {updateCartCount, cart} from './cart.js';

declare const bootstrap: any;

interface CartItem {
  product: string;
  price: number;
  quantity: number;
}

function showToast(message: string, type: string = 'warning'): void {
  const toastEl = document.getElementById('toast') as HTMLElement;
  const toastBody = document.getElementById('toast-body') as HTMLElement;

  if (toastEl && toastBody) {
    toastBody.textContent = message;
    toastEl.className = `toast align-items-center text-bg-${type} border-0`;
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
  } else {
    console.error('Toast-elementtiä ei löytynyt');
  }
}

async function checkAuthentication(): Promise<void> {
  const token = localStorage.getItem('token');

  if (!token) {
    showToast('Sinun täytyy kirjautua sisään tehdäksesi tilauksen.', 'danger');
    window.location.href = '/login.html';
    return;
  }

  try {
    const response = await fetch('/api/auth/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      throw new Error('Token ei kelpaa');
    }
  } catch (error) {
    console.error('Autentikointivirhe:', error);
    showToast('Autentikointi epäonnistui. Kirjaudu uudelleen.', 'danger');
    window.location.href = '/login.html';
  }
}

function displayCartSummary(): void {
  const cartSummaryContainer = document.getElementById(
    'cart-summary'
  ) as HTMLElement;

  if (!cartSummaryContainer) return;

  if (cart.length === 0) {
    cartSummaryContainer.innerHTML = '<p>Ostoskorisi on tyhjä.</p>';
    return;
  }

  const table = document.createElement('table');
  table.classList.add('table', 'table-striped');

  const thead = document.createElement('thead');
  thead.innerHTML = `
    <tr>
      <th>Tuote</th>
      <th>Määrä</th>
      <th>Hinta</th>
      <th>Yhteensä</th>
    </tr>
  `;
  table.appendChild(thead);

  const tbody = document.createElement('tbody');

  cart.forEach((item) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.product}</td>
      <td>${item.quantity}</td>
      <td>${item.price.toFixed(2)}€</td>
      <td>${(item.price * item.quantity).toFixed(2)}€</td>
    `;
    tbody.appendChild(row);
  });

  table.appendChild(tbody);

  const total = calculateTotal();

  const tfoot = document.createElement('tfoot');
  tfoot.innerHTML = `
    <tr>
      <td colspan="3" class="text-end"><strong>Kokonaissumma</strong></td>
      <td><strong>${total.toFixed(2)}€</strong></td>
    </tr>
  `;
  table.appendChild(tfoot);

  cartSummaryContainer.innerHTML = ''; // Tyhjennetään aiempi sisältö
  cartSummaryContainer.appendChild(table);
}

function calculateTotal(): number {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function handleOrderSubmission(): void {
  const submitOrderButton = document.getElementById(
    'submit-order'
  ) as HTMLButtonElement;
  const nameModal = document.getElementById('nameModal') as HTMLElement;
  const customerNameInput = document.getElementById(
    'customerName'
  ) as HTMLInputElement;
  const confirmNameButton = document.getElementById(
    'confirmName'
  ) as HTMLButtonElement;

  // Uudet elementit
  const pickupOption = document.getElementById(
    'pickupOption'
  ) as HTMLInputElement;
  const deliveryOption = document.getElementById(
    'deliveryOption'
  ) as HTMLInputElement;
  const addressField = document.getElementById('addressField') as HTMLElement;
  const deliveryAddressInput = document.getElementById(
    'deliveryAddress'
  ) as HTMLInputElement;

  if (
    !submitOrderButton ||
    !nameModal ||
    !customerNameInput ||
    !confirmNameButton
  )
    return;

  // Näytetään/piilotetaan osoitekenttä valinnan mukaan
  pickupOption.addEventListener('change', () => {
    if (pickupOption.checked) {
      addressField.style.display = 'none';
    }
  });

  deliveryOption.addEventListener('change', () => {
    if (deliveryOption.checked) {
      addressField.style.display = 'block';
    }
  });

  submitOrderButton.addEventListener('click', () => {
    if (cart.length === 0) {
      showToast('Ostoskorisi on tyhjä.', 'warning');
      return;
    }

    // Käytä bootstrap.Modal, ei window.Modal
    const nameModalInstance = bootstrap.Modal.getOrCreateInstance(nameModal);
    nameModalInstance.show();

    confirmNameButton.addEventListener(
      'click',
      async () => {
        const customerName = customerNameInput.value.trim();

        if (!customerName) {
          showToast('Nimi on pakollinen.', 'warning');
          return;
        }

        // Haetaan valittu toimitustapa
        const deliveryMethod = deliveryOption.checked ? 'delivery' : 'pickup';
        const deliveryAddress =
          deliveryMethod === 'delivery'
            ? deliveryAddressInput.value.trim()
            : null;

        if (
          deliveryMethod === 'delivery' &&
          (!deliveryAddress || deliveryAddress === '')
        ) {
          showToast('Anna toimitusosoite.', 'warning');
          return;
        }

        nameModalInstance.hide();

        const token = localStorage.getItem('token');

        try {
          const response = await fetch('/api/orders', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              customer: customerName,
              items: cart,
              delivery_method: deliveryMethod,
              delivery_address: deliveryAddress || '',
            }),
          });

          if (response.ok) {
            showToast('Tilaus lähetetty!', 'success');
            localStorage.removeItem('cart');
            cart.length = 0;
            displayCartSummary();
            updateCartCount();
          } else {
            const errorData = await response.json();
            showToast(
              errorData.message || 'Virhe tilauksen lähettämisessä.',
              'danger'
            );
          }
        } catch (error) {
          console.error('Virhe tilauksen lähettämisessä:', error);
          showToast('Virhe tilauksen lähettämisessä.', 'danger');
        }
      },
      {once: true}
    );
  });
}

document.addEventListener('DOMContentLoaded', () => {
  checkAuthentication();
  displayCartSummary();
  handleOrderSubmission();
  updateCartCount();
});

export {};
