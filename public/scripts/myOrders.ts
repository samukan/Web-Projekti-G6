// public/scripts/myOrders.ts

// Funktio autentikoinnin tarkistamiseen
async function checkAuthentication(): Promise<void> {
  const token = localStorage.getItem('token');

  if (!token) {
    alert('Sinun täytyy kirjautua sisään nähdäksesi tilauksesi.');
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
    });

    if (!response.ok) {
      throw new Error('Token ei kelpaa');
    }

    // Käyttäjä on autentikoitu, hae tilaukset
    fetchMyOrders();
  } catch (error) {
    console.error('Autentikointivirhe:', error);
    alert('Autentikointi epäonnistui. Kirjaudu uudelleen.');
    window.location.href = '/login.html';
  }
}

interface OrderItem {
  product: string;
  quantity: number;
  price: number;
}

interface Order {
  order_id: number;
  order_date: string;
  status: string;
  items: OrderItem[];
}

// Hakee asiakkaan tilaukset
async function fetchMyOrders(): Promise<void> {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/orders/myOrders', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const orders: Order[] = await response.json();
      renderOrders(orders);
    } else {
      if (response.status === 401 || response.status === 403) {
        alert('Sinun täytyy kirjautua sisään nähdäksesi tilauksesi.');
        window.location.href = '/login.html';
        return;
      }
      const errorData = await response.json();
      alert('Virhe tilauksia haettaessa: ' + errorData.message);
    }
  } catch (error) {
    console.error('Virhe tilauksia haettaessa:', error);
    alert('Virhe tilauksia haettaessa.');
  }
}

// Renderöi tilaukset sivulle
function renderOrders(orders: Order[]): void {
  const ordersTableBody = document.querySelector(
    '#orders-table tbody'
  ) as HTMLTableSectionElement;
  ordersTableBody.innerHTML = '';

  if (orders.length === 0) {
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.colSpan = 5;
    cell.textContent = 'Ei tilauksia.';
    cell.classList.add('text-center');
    row.appendChild(cell);
    ordersTableBody.appendChild(row);
    return;
  }

  orders.forEach((order) => {
    const row = document.createElement('tr');

    const total = order.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const itemsList = order.items
      .map((item) => `${item.quantity} x ${item.product}`)
      .join(', ');

    row.innerHTML = `
        <td>${order.order_id}</td>
        <td>${new Date(order.order_date).toLocaleString()}</td>
        <td>${order.status}</td>
        <td>${itemsList}</td>
        <td>${total.toFixed(2)} €</td>
      `;

    ordersTableBody.appendChild(row);
  });
}

// Alustetaan kun sivu latautuu
document.addEventListener('DOMContentLoaded', () => {
  checkAuthentication();
});

export {};
