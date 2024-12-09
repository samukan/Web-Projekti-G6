// public/scripts/driverOrders.ts

declare const bootstrap: any;

import {parseJwt, showToast} from './auth.js';

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
}

async function checkDriverRole(): Promise<boolean> {
  const token = localStorage.getItem('token');
  if (!token) {
    return false;
  }

  // Tarkista rooli tokenista
  const payload = parseJwt(token);
  console.log('Token payload:', payload);
  if (!payload) return false;
  return payload.role === 3;
}

async function fetchDriverOrders(): Promise<void> {
  const token = localStorage.getItem('token');
  if (!token) {
    showToast('Sinun täytyy kirjautua sisään.', 'danger');
    window.location.href = '/login.html';
    return;
  }

  try {
    const response = await fetch('/api/orders/driver/orders', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const orders: Order[] = await response.json();
      console.log('Driver orders fetched:', orders);
      renderDriverOrders(orders);
    } else {
      const errorData = await response.json();
      showToast(errorData.message || 'Virhe tilausten haussa.', 'danger');
      if (response.status === 401 || response.status === 403) {
        window.location.href = '/login.html';
      }
    }
  } catch (error) {
    console.error('Virhe kuljettajan tilausten haussa:', error);
    showToast('Virhe tilausten haussa.', 'danger');
  }
}

function renderDriverOrders(orders: Order[]): void {
  const container = document.getElementById('driver-orders-container');
  if (!container) return;

  if (orders.length === 0) {
    container.innerHTML = '<p>Ei kuljetettavia tilauksia.</p>';
    return;
  }

  let html = `
    <table class="table table-striped">
      <thead>
        <tr>
          <th>Tilaus ID</th>
          <th>Asiakas</th>
          <th>Osoite</th>
          <th>Status</th>
          <th>Päivämäärä</th>
          <th>Tuotteet</th>
          <th>Toiminnot</th>
        </tr>
      </thead>
      <tbody>
  `;

  orders.forEach((order) => {
    const itemsList = order.items
      .map((item) => `${item.quantity}x ${item.product}`)
      .join(', ');

    html += `
      <tr>
        <td>${order.order_id}</td>
        <td>${order.customer_name}</td>
        <td>${order.delivery_address || 'Ei osoitetta'}</td>
        <td>${order.status}</td>
        <td>${new Date(order.order_date).toLocaleString()}</td>
        <td>${itemsList}</td>
        <td>
          <button class="btn btn-sm btn-success mark-delivered-btn" data-order-id="${
            order.order_id
          }">Merkitse Toimitetuksi</button>
        </td>
      </tr>
    `;
  });

  html += '</tbody></table>';
  container.innerHTML = html;

  // Lisää tapahtumakuuntelijat "Merkitse Toimitetuksi" -painikkeille
  const deliveredButtons = document.querySelectorAll('.mark-delivered-btn');
  deliveredButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const orderId = button.getAttribute('data-order-id');
      openMarkDeliveredModal(orderId);
    });
  });
}

function openMarkDeliveredModal(orderId: string | null): void {
  if (!orderId) return;

  const deliveredOrderIdDisplay = document.getElementById(
    'delivered-order-id-display'
  ) as HTMLElement;
  const deliveredOrderIdInput = document.getElementById(
    'delivered-order-id'
  ) as HTMLInputElement;

  deliveredOrderIdDisplay.textContent = orderId;
  deliveredOrderIdInput.value = orderId;

  // Avaa modal
  const markDeliveredModalElement =
    document.getElementById('markDeliveredModal');
  if (markDeliveredModalElement) {
    const modalInstance = new bootstrap.Modal(markDeliveredModalElement);
    modalInstance.show();
  }
}

async function handleMarkDelivered(event: Event): Promise<void> {
  event.preventDefault();

  const orderId = (
    document.getElementById('delivered-order-id') as HTMLInputElement
  ).value;

  if (!orderId) {
    showToast('Tilaus ID puuttuu.', 'warning');
    return;
  }

  try {
    const response = await fetch(`/api/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({status: 'Kuljetettu perille'}),
    });

    if (response.ok) {
      const data = await response.json();
      showToast(data.message || 'Tilauksen status päivitetty.', 'success');
      fetchDriverOrders(); // Päivitä toimitettavat tilaukset
      // Sulje modal
      const markDeliveredModalElement =
        document.getElementById('markDeliveredModal');
      if (markDeliveredModalElement) {
        const modalInstance = bootstrap.Modal.getInstance(
          markDeliveredModalElement
        );
        modalInstance?.hide();
      }
    } else {
      const errorData = await response.json();
      showToast(
        errorData.message || 'Virhe tilauksen statusta päivittäessä.',
        'danger'
      );
    }
  } catch (error) {
    console.error('Virhe tilauksen statusta päivittäessä:', error);
    showToast('Virhe tilauksen statusta päivittäessä.', 'danger');
  }
}

// Lisää tapahtumakuuntelija tilauksen statuksen päivityslomakkeelle
document
  .getElementById('mark-delivered-form')
  ?.addEventListener('submit', handleMarkDelivered);

// Alustetaan kuljettajan näkymä
document.addEventListener('DOMContentLoaded', async () => {
  const isDriver = await checkDriverRole();
  if (!isDriver) {
    showToast('Sinulla ei ole oikeuksia tälle sivulle.', 'danger');
    window.location.href = '/login.html';
    return;
  }

  // Nyt kun tiedetään että käyttäjä on kuljettaja, haetaan tilaukset
  fetchDriverOrders();
});
