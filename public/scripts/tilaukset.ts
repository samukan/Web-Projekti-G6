// public/scripts/tilaukset.ts
// Tilaukset-sivun toiminnallisuus
// Modalit ja napit: Jos ei tapahdu mitään, tarkista token – tai käyttäjä. 😅

declare const bootstrap: any;

// Hae tilaukset back-endiltä, Tässä myös samalla sisäänkirjautumisen tarkistus.
async function fetchOrders(): Promise<void> {
  try {
    const response = await fetch('/api/orders', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Tarvitaan token tilausten hakemiseen
      },
    });

    if (response.ok) {
      const fetchedOrders = await response.json();
      orders = fetchedOrders;
      updateOrderLists();
      renderOrdersTable();
    } else {
      if (response.status === 401 || response.status === 403) {
        alert(
          'Sinun täytyy kirjautua sisään Admin tunniksilla nähdäksesi tilaukset.'
        );
        window.location.href = '/login.html'; // Ohjaa kirjautumissivulle jos ei tokenia
      } else {
        const errorData = await response.json();
        alert('Virhe tilauksia haettaessa: ' + errorData.message);
      }
    }
  } catch (error) {
    console.error('Virhe tilauksia haettaessa:', error);
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
  items: OrderItem[];
}

// Tilaukset ja niiden tilalistat
let orders: Order[] = [];
let activeOrders: Order[] = [];
let archivedOrders: Order[] = [];
let currentView: string = 'Aktiivinen'; // Oletuksena aktiivinen tila

// DOM-elementit
const ordersTableBody = document.querySelector(
  '#orders-table tbody'
) as HTMLTableSectionElement;
const orderTableTitle = document.getElementById(
  'order-table-title'
) as HTMLElement;
const showActiveBtn = document.getElementById(
  'show-active'
) as HTMLButtonElement;
const showArchivedBtn = document.getElementById(
  'show-archived'
) as HTMLButtonElement;

// Lisää tapahtumakuuntelijat suodatinpainikkeille
showActiveBtn.addEventListener('click', () => {
  currentView = 'Aktiivinen';
  renderOrdersTable();
  orderTableTitle.textContent = 'Aktiiviset tilaukset';
  showActiveBtn.classList.replace('btn-secondary', 'btn-primary');
  showArchivedBtn.classList.replace('btn-primary', 'btn-secondary');
});

showArchivedBtn.addEventListener('click', () => {
  currentView = 'Arkistoitu';
  renderOrdersTable();
  orderTableTitle.textContent = 'Arkistoidut tilaukset';
  showActiveBtn.classList.replace('btn-primary', 'btn-secondary');
  showArchivedBtn.classList.replace('btn-secondary', 'btn-primary');
});

function updateOrderLists(): void {
  activeOrders = orders.filter((order) => order.status === 'Aktiivinen');
  archivedOrders = orders.filter((order) => order.status === 'Arkistoitu');
}

function renderOrdersTable(): void {
  ordersTableBody.innerHTML = '';

  const ordersToRender =
    currentView === 'Aktiivinen' ? activeOrders : archivedOrders;

  if (ordersToRender.length === 0) {
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.colSpan = 5;
    cell.textContent = 'Ei tilauksia.';
    cell.classList.add('text-center');
    row.appendChild(cell);
    ordersTableBody.appendChild(row);
    return;
  }

  ordersToRender.forEach((order) => {
    const row = document.createElement('tr');

    row.innerHTML = `
        <td>${order.order_id}</td>
        <td>${order.customer_name}</td>
        <td>${new Date(order.order_date).toLocaleString()}</td>
        <td>${order.status}</td>
        <td>
          <button class="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#orderModal" data-order-id="${
            order.order_id
          }">Näytä</button>
        </td>
      `;

    ordersTableBody.appendChild(row);
  });
}

// Näytä tilauksen tiedot modalissa
function viewOrder(orderId: number): void {
  const order = orders.find((o) => o.order_id === orderId);

  if (!order) return;

  (document.getElementById('modal-order-id') as HTMLElement).textContent =
    order.order_id.toString();

  const orderDetails = document.getElementById('order-details') as HTMLElement;

  const itemsList = order.items
    .map(
      (item) =>
        `<li>${item.quantity} x ${item.product} - ${item.price.toFixed(
          2
        )}€</li>`
    )
    .join('');

  orderDetails.innerHTML = `
      <p><strong>Asiakas:</strong> ${order.customer_name}</p>
      <p><strong>Päivämäärä:</strong> ${new Date(
        order.order_date
      ).toLocaleString()}</p>
      <p><strong>Status:</strong> ${order.status}</p>
      <h5>Tuotteet:</h5>
      <ul>
        ${itemsList}
      </ul>
      <p><strong>Yhteensä:</strong> ${calculateOrderTotal(order).toFixed(
        2
      )}€</p>
    `;

  // Näytä tai piilota Arkistoi-painike
  const archiveBtn = document.getElementById(
    'archive-order-btn'
  ) as HTMLButtonElement;
  if (order.status === 'Aktiivinen') {
    archiveBtn.style.display = 'inline-block';
    archiveBtn.onclick = () => archiveOrder(orderId);
  } else {
    archiveBtn.style.display = 'none';
  }
}

// Laske tilauksen kokonaissumma
function calculateOrderTotal(order: Order): number {
  return order.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
}

// Arkistoi tilaus
async function archiveOrder(orderId: number): Promise<void> {
  if (confirm('Haluatko varmasti arkistoida tämän tilauksen?')) {
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({status: 'Arkistoitu'}),
      });

      if (response.ok) {
        // Päivitä tila paikallisessa tilauksessa
        const order = orders.find((o) => o.order_id === orderId);
        if (order) {
          order.status = 'Arkistoitu';
          updateOrderLists();
          renderOrdersTable();
          // Sulje modal
          const orderModalElement = document.getElementById('orderModal');
          if (orderModalElement) {
            const orderModal = bootstrap.Modal.getInstance(orderModalElement);
            if (orderModal) {
              orderModal.hide();
            }
          }
        }
      } else {
        const errorData = await response.json();
        alert('Virhe tilauksen päivittämisessä: ' + errorData.message);
      }
    } catch (error) {
      console.error('Virhe tilauksen päivittämisessä:', error);
    }
  }
}

// Modalin näyttämiseen ja tilauksen katseluun
document.addEventListener('click', function (event) {
  const target = event.target as HTMLElement;
  if (target.matches('button[data-bs-toggle="modal"]')) {
    const orderId = target.getAttribute('data-order-id');
    if (orderId) {
      viewOrder(parseInt(orderId));
    }
  }
});

// Käynnistä sovellus, Lataa tilaukset
document.addEventListener('DOMContentLoaded', () => {
  fetchOrders();
});
