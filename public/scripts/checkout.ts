// public/scripts/checkout.ts
// Ostoskori-yhteenveto ja tilauksen käsittely

interface CartItem {
  product: string;
  price: number;
  quantity: number;
}

let cart: CartItem[] = [];

// Lataa ostoskori localStoragesta
const storedCart = localStorage.getItem('cart');
if (storedCart) {
  cart = JSON.parse(storedCart);
}

// Ostoskorin yhteenveto
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

  if (!submitOrderButton) return;

  submitOrderButton.addEventListener('click', async () => {
    if (cart.length === 0) {
      alert('Ostoskorisi on tyhjä.');
      return;
    }

    // Pyytää käyttäjältä nimen, Tää nimi menee tilaukselle.
    const customerName = prompt('Anna nimesi:');
    if (!customerName) {
      alert('Nimi on pakollinen.');
      return;
    }

    // Lähetä tilaus back-endille
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({customer: customerName, items: cart}),
      });

      if (response.ok) {
        alert('Tilaus lähetetty!');
        // Tyhjennetään ostoskori
        localStorage.removeItem('cart');
        cart = [];
        // Päivitetään sivu
        displayCartSummary();
        // Päivitetään ostoskorin määrä navigaatiossa
        updateCartCount();
      } else {
        const errorData = await response.json();
        alert('Virhe tilauksen lähettämisessä: ' + errorData.message);
      }
    } catch (error) {
      console.error('Virhe tilauksen lähettämisessä:', error);
      alert('Virhe tilauksen lähettämisessä.');
    }
  });
}

// Päivittää ostoskorin navissa
function updateCartCount(): void {
  const cartCountElement = document.getElementById('cart-count') as HTMLElement;
  if (!cartCountElement) return;

  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (totalQuantity > 0) {
    cartCountElement.textContent = totalQuantity.toString();
    cartCountElement.style.display = 'inline-block';
  } else {
    cartCountElement.textContent = '';
    cartCountElement.style.display = 'none';
  }
}
// Käynnistä kaikki, kun sivu latautuu
document.addEventListener('DOMContentLoaded', () => {
  displayCartSummary();
  handleOrderSubmission();
  updateCartCount();
});
