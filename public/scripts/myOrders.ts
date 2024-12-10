// public/scripts/myOrders.ts

import {showToast} from './auth.js';

// Funktio autentikoinnin tarkistamiseen
async function checkAuthentication(): Promise<void> {
  const token = localStorage.getItem('token');
  console.log('checkAuthentication: Token:', token);

  if (!token) {
    showToast(
      'Sinun täytyy kirjautua sisään nähdäksesi tilauksesi.',
      'warning'
    );
    setTimeout(() => {
      window.location.href = '/login.html';
    }, 1500);
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

    fetchMyOrders();
    setupPolling();
  } catch (error) {
    console.error('Autentikointivirhe:', error);
    showToast('Autentikointi epäonnistui. Kirjaudu uudelleen.', 'danger');
    setTimeout(() => {
      window.location.href = '/login.html';
    }, 1500);
  }
}

interface OrderItem {
  product: string;
  quantity: number;
  price: number;
}

interface Order {
  order_id: number;
  customer_name: string;
  order_date: string;
  status: string;
  delivery_method: string;
  delivery_address: string | null;
  items: OrderItem[];
  is_archived?: number;
}

// Hakee asiakkaan tilaukset
async function fetchMyOrders(): Promise<void> {
  try {
    const token = localStorage.getItem('token');
    console.log('fetchMyOrders: Token:', token);

    const response = await fetch('/api/orders/myOrders', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('fetchMyOrders: Response status:', response.status);

    if (response.ok) {
      const orders: Order[] = await response.json();
      console.log('fetchMyOrders: Fetched Orders:', orders);
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
    '#customer-orders-table tbody'
  ) as HTMLTableSectionElement;
  ordersTableBody.innerHTML = '';

  if (orders.length === 0) {
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.colSpan = 7;
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
      .join('<br>');

    row.innerHTML = `
        <td>${order.order_id}</td>
        <td>${new Date(order.order_date).toLocaleString()}</td>
        <td>${order.status}</td>
        <td>${order.delivery_method}</td>
        <td>${order.delivery_address || '-'}</td>
        <td>${itemsList}</td>
        <td>${total.toFixed(2)} €</td>
      `;

    ordersTableBody.appendChild(row);
  });
}

// Polling-funktio tilauksien päivitysten hakemiseen
function setupPolling(interval: number = 30000): void {
  // 30 sekuntia
  setInterval(() => {
    fetchMyOrders();
  }, interval);
}

// Alustetaan kun sivu latautuu
document.addEventListener('DOMContentLoaded', () => {
  console.log('myOrders.ts DOMContentLoaded');
  checkAuthentication();
});
