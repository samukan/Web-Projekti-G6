// public/scripts/tilaukset.ts

declare const bootstrap: any;

import {showToast} from './auth.js';

interface OrderItem {
  product: string;
  quantity: number;
  price: number;
  dietary_info?: string;
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

const statusTransitions: {[key: string]: string[]} = {
  Vastaanotettu: ['Valmistuksessa'],
  Valmistuksessa: [
    'Tilaus on noudettavissa ravintolasta',
    'Tilaus on kuljetuksessa',
  ],
  'Tilaus on noudettavissa ravintolasta': ['Asiakas noutanut tilauksen'],
  'Asiakas noutanut tilauksen': [], // Arkistointi tapahtuu automaattisesti
  'Tilaus on kuljetuksessa': ['Kuljetettu perille'],
  'Kuljetettu perille': [], // Arkistointi tapahtuu automaattisesti
  Toimitettu: [],
};

let orders: Order[] = [];
let activeOrders: Order[] = [];
let archivedOrders: Order[] = [];
let currentView: string = 'Aktiiviset';
let cancelOrderId: string | null = null;

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
const confirmCancelOrderBtn = document.getElementById(
  'confirm-cancel-order-btn'
) as HTMLButtonElement;

// Varmistetaan, että DOM on ladattu ennen event listenerien lisäämistä
document.addEventListener('DOMContentLoaded', () => {
  fetchAllOrders();

  // Lisää tapahtumakuuntelijat suodattimille
  showActiveBtn.addEventListener('click', () => {
    currentView = 'Aktiiviset';
    renderOrdersTable();
    orderTableTitle.textContent = 'Aktiiviset tilaukset';
    showActiveBtn.classList.replace('btn-secondary', 'btn-primary');
    showArchivedBtn.classList.replace('btn-primary', 'btn-secondary');
  });

  showArchivedBtn.addEventListener('click', () => {
    currentView = 'Arkistoidut';
    renderOrdersTable();
    orderTableTitle.textContent = 'Arkistoidut tilaukset';
    showActiveBtn.classList.replace('btn-primary', 'btn-secondary');
    showArchivedBtn.classList.replace('btn-secondary', 'btn-primary');
  });

  // Lisää tapahtumakuuntelija tilauksen statuksen päivityslomakkeelle
  const updateStatusForm = document.getElementById(
    'update-status-form'
  ) as HTMLFormElement;
  updateStatusForm?.addEventListener('submit', handleUpdateStatus);

  // Lisää tapahtumakuuntelija tilausten toimintopainikkeille
  ordersTableBody.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    if (target.classList.contains('update-status-btn')) {
      const orderId = target.getAttribute('data-order-id');
      const newStatus = target.getAttribute('data-new-status');
      if (orderId && newStatus) {
        openUpdateStatusModal(orderId, newStatus);
      }
    } else if (target.classList.contains('view-details-btn')) {
      const orderId = target.getAttribute('data-order-id');
      if (orderId) {
        openViewOrderModal(parseInt(orderId));
      }
    } else if (target.classList.contains('cancel-order-btn')) {
      const orderId = target.getAttribute('data-order-id');
      if (orderId) {
        cancelOrder(orderId);
      }
    }
  });

  // Lisää tapahtumankuuntelija peruutuksen vahvistuspainikkeelle
  confirmCancelOrderBtn?.addEventListener('click', handleConfirmCancelOrder);
});

function populateStatusOptions(allowedTransitions: string[]): void {
  const statusSelect = document.getElementById(
    'new-status'
  ) as HTMLSelectElement;
  statusSelect.innerHTML = '<option value="">Valitse Status</option>'; // Tyhjennä valikot

  allowedTransitions.forEach((status) => {
    const option = document.createElement('option');
    option.value = status;
    option.textContent = status;
    statusSelect.appendChild(option);
  });
}

function updateOrderLists(): void {
  activeOrders = orders.filter((order) => order.is_archived === 0);
  archivedOrders = orders.filter((order) => order.is_archived === 1);
}

function renderOrdersTable(): void {
  ordersTableBody.innerHTML = '';

  const ordersToRender =
    currentView === 'Aktiiviset' ? activeOrders : archivedOrders;

  if (ordersToRender.length === 0) {
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.colSpan = 6;
    cell.textContent = 'Ei tilauksia.';
    cell.classList.add('text-center');
    row.appendChild(cell);
    ordersTableBody.appendChild(row);
    return;
  }

  ordersToRender.forEach((order) => {
    let actionButtons = '';
    const statusKey = order.status.trim();
    const isArchived =
      typeof order.is_archived === 'string'
        ? parseInt(order.is_archived)
        : order.is_archived;

    // Lisää "Näytä tiedot" -painike kaikille tilauksille
    actionButtons += `
      <button class="btn btn-sm btn-info view-details-btn me-1" data-order-id="${order.order_id}">
        Näytä tiedot
      </button>
    `;

    if (!isArchived) {
      const allowedTransitions = statusTransitions[statusKey];
      if (allowedTransitions && allowedTransitions.length > 0) {
        allowedTransitions.forEach((newStatus) => {
          actionButtons += `
            <button class="btn btn-sm btn-primary update-status-btn me-1" data-order-id="${order.order_id}" data-new-status="${newStatus}">
              Päivitä status: ${newStatus}
            </button>
          `;
        });
      }
      // Lisää "Peruuta tilaus" -painike aktiivisille tilauksille
      actionButtons += `
        <button class="btn btn-sm btn-danger cancel-order-btn" data-order-id="${order.order_id}">
          Peruuta tilaus
        </button>
      `;
    }

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${order.order_id}</td>
      <td>${order.customer_name}</td>
      <td>${new Date(order.order_date).toLocaleString()}</td>
      <td>${order.status}</td>
      <td>${order.delivery_method}</td>
      <td>
        ${actionButtons || 'Ei toimintoa'}
      </td>
    `;
    ordersTableBody.appendChild(row);
  });
}

// Funktio tilauksen perumiseen (avautuu modal)
function cancelOrder(orderId: string): void {
  cancelOrderId = orderId;
  const cancelOrderModalElement = document.getElementById('cancelOrderModal');
  if (cancelOrderModalElement) {
    const modalInstance = new bootstrap.Modal(cancelOrderModalElement);
    modalInstance.show();
  }
}

// Funktio peruutuksen vahvistamiseen
async function handleConfirmCancelOrder(): Promise<void> {
  if (!cancelOrderId) {
    showToast('Virhe: Tilauksen ID puuttuu.', 'danger');
    return;
  }

  try {
    const response = await fetch(`/api/orders/${cancelOrderId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      showToast(data.message || 'Tilaus peruutettu.', 'success');

      // Poistetaan tilaus paikallisesta listasta ja päivitetään taulukko
      orders = orders.filter(
        (order) => order.order_id !== parseInt(cancelOrderId!)
      );
      updateOrderLists();
      renderOrdersTable();

      cancelOrderId = null;

      // Sulje modal
      const cancelOrderModalElement =
        document.getElementById('cancelOrderModal');
      if (cancelOrderModalElement) {
        const modalInstance = bootstrap.Modal.getInstance(
          cancelOrderModalElement
        );
        modalInstance?.hide();
      }
    } else {
      const errorData = await response.json();
      showToast(
        errorData.message || 'Virhe tilauksen peruutuksessa.',
        'danger'
      );
    }
  } catch (error) {
    console.error('Virhe tilauksen peruutuksessa:', error);
    showToast('Virhe tilauksen peruutuksessa.', 'danger');
  }
}

// Funktio statuksen päivitysmodalin avaamiseen
function openUpdateStatusModal(orderId: string, newStatus: string): void {
  const updateOrderIdInput = document.getElementById(
    'update-order-id'
  ) as HTMLInputElement;

  if (!orderId) return;

  updateOrderIdInput.value = orderId;

  // Haetaan tilauksen nykyinen status
  const order = orders.find((o) => o.order_id === parseInt(orderId));
  if (!order) {
    showToast('Tilausta ei löytynyt.', 'danger');
    return;
  }

  const currentStatusKey = order.status.trim();
  const allowedTransitions = statusTransitions[currentStatusKey] || [];

  if (allowedTransitions.length === 0) {
    showToast('Tälle tilaukselle ei ole sallittuja tilasiirtymiä.', 'warning');
    return;
  }

  populateStatusOptions(allowedTransitions);

  // Avaa modal
  const updateStatusModalElement = document.getElementById('updateStatusModal');
  if (updateStatusModalElement) {
    const modalInstance = new bootstrap.Modal(updateStatusModalElement);
    modalInstance.show();
  }
}

// Funktio tilauksen yksityiskohtien modalin avaamiseen
function openViewOrderModal(orderId: number): void {
  const order = orders.find((o) => o.order_id === orderId);
  if (!order) {
    showToast('Tilausta ei löytynyt.', 'danger');
    return;
  }

  // Hae elementit ja tarkista niiden olemassaolo
  const modalElement = document.getElementById('viewOrderModal');
  const viewOrderId = document.getElementById('view-order-id');
  const viewCustomerName = document.getElementById('view-customer-name');
  const viewOrderDate = document.getElementById('view-order-date');
  const viewStatus = document.getElementById('view-status');
  const viewDeliveryMethod = document.getElementById('view-delivery-method');
  const viewDeliveryAddress = document.getElementById('view-delivery-address');
  const viewOrderItems = document.getElementById('view-order-items');
  const viewTotalPrice = document.getElementById('view-total-price');

  // Tarkista, että kaikki tarvittavat elementit löytyvät
  if (
    !modalElement ||
    !viewOrderId ||
    !viewCustomerName ||
    !viewOrderDate ||
    !viewStatus ||
    !viewDeliveryMethod ||
    !viewDeliveryAddress ||
    !viewOrderItems ||
    !viewTotalPrice
  ) {
    console.error('Modaalin elementtejä puuttuu');
    return;
  }

  // Aseta arvot
  viewOrderId.textContent = order.order_id.toString();
  viewCustomerName.textContent = order.customer_name;
  viewOrderDate.textContent = new Date(order.order_date).toLocaleString();
  viewStatus.textContent = order.status;
  viewDeliveryMethod.textContent = order.delivery_method;
  viewDeliveryAddress.textContent = order.delivery_address || 'Ei osoitetta';

  // Tyhjennä aiemmat tuoterivit
  viewOrderItems.innerHTML = '';

  let totalPrice = 0;

  // Lisää tuoterivit
  order.items.forEach((item) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.product}</td>
      <td>${item.quantity}</td>
      <td>${item.price.toFixed(2)}€</td>
      <td>${item.dietary_info || '-'}</td>
    `;
    viewOrderItems.appendChild(row);
    totalPrice += item.quantity * item.price;
  });

  // Aseta kokonaishinta
  viewTotalPrice.textContent = totalPrice.toFixed(2);

  // Näytä modaali
  const modal = new bootstrap.Modal(modalElement);
  modal.show();
}

// Funktio statuksen päivityslomakkeen käsittelyyn
async function handleUpdateStatus(event: Event): Promise<void> {
  event.preventDefault();

  const orderId = (
    document.getElementById('update-order-id') as HTMLInputElement
  ).value;
  const newStatus = (document.getElementById('new-status') as HTMLSelectElement)
    .value;

  if (!orderId || !newStatus) {
    showToast('Valitse uusi status.', 'warning');
    return;
  }

  try {
    const response = await fetch(`/api/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({status: newStatus}),
    });

    if (response.ok) {
      const data = await response.json();
      showToast(data.message || 'Tilauksen status päivitetty.', 'success');
      // Päivitä tilauksen status paikallisessa arrayssa
      const order = orders.find((o) => o.order_id === parseInt(orderId));
      if (order) {
        order.status = newStatus;
        if (
          newStatus === 'Kuljetettu perille' ||
          newStatus === 'Asiakas noutanut tilauksen'
        ) {
          order.is_archived = 1;
        }
      }
      updateOrderLists();
      renderOrdersTable();
      // Sulje modal
      const updateStatusModalElement = document.getElementById(
        'updateStatusModal'
      ) as HTMLElement;
      if (updateStatusModalElement) {
        const modalInstance = bootstrap.Modal.getInstance(
          updateStatusModalElement
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

// Funktio tilausten hakemiseen adminille
async function fetchActiveOrders(): Promise<void> {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      showToast('Sinun täytyy kirjautua sisään.', 'warning');
      setTimeout(() => {
        window.location.href = '/login.html';
      }, 1500);
      return;
    }

    const response = await fetch('/api/orders', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const fetchedOrders: Order[] = await response.json();
      orders = fetchedOrders;
      updateOrderLists();
      renderOrdersTable();
    } else {
      if (response.status === 401 || response.status === 403) {
        showToast(
          'Sinun täytyy kirjautua sisään admin-tunnuksilla.',
          'warning'
        );
        setTimeout(() => {
          window.location.href = '/login.html';
        }, 1500);
        return;
      }
      const errorData = await response.json();
      showToast('Virhe tilauksia haettaessa: ' + errorData.message, 'danger');
    }
  } catch (error) {
    console.error('Virhe tilauksia haettaessa:', error);
    showToast(
      'Virhe tilauksia haettaessa. Yritä myöhemmin uudelleen.',
      'danger'
    );
  }
}

// Funktio arkistoitujen tilausten hakemiseen adminille
async function fetchArchivedOrders(): Promise<void> {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      showToast('Sinun täytyy kirjautua sisään.', 'warning');
      setTimeout(() => {
        window.location.href = '/login.html';
      }, 1500);
      return;
    }

    const response = await fetch('/api/orders/archived', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const fetchedArchivedOrders: Order[] = await response.json();
      orders = orders
        .filter((order) => order.is_archived === 0)
        .concat(fetchedArchivedOrders);
      updateOrderLists();
      renderOrdersTable();
    } else {
      if (response.status === 401 || response.status === 403) {
        showToast(
          'Sinun täytyy kirjautua sisään admin-tunnuksilla.',
          'warning'
        );
        setTimeout(() => {
          window.location.href = '/login.html';
        }, 1500);
        return;
      }
      const errorData = await response.json();
      showToast(
        'Virhe arkistoituja tilauksia haettaessa: ' + errorData.message,
        'danger'
      );
    }
  } catch (error) {
    console.error('Virhe arkistoituja tilauksia haettaessa:', error);
    showToast(
      'Virhe arkistoituja tilauksia haettaessa. Yritä myöhemmin uudelleen.',
      'danger'
    );
  }
}

// Funktio kaikkien tilausten hakemiseen
async function fetchAllOrders(): Promise<void> {
  await fetchActiveOrders();
  await fetchArchivedOrders();
}
