"use strict";
// tilaukset.ts
// Esimerkkidata tilauksille
let orders = [
    {
        id: 1001,
        customer: 'Matti Meikäläinen',
        date: '2023-08-01',
        status: 'Aktiivinen',
        items: [
            { name: 'Kana kebab', quantity: 2, price: 8.9 },
            { name: 'Coca-Cola', quantity: 2, price: 2.5 },
        ],
        total: 22.8,
    },
    {
        id: 1002,
        customer: 'Maija Mallikas',
        date: '2023-07-30',
        status: 'Arkistoitu',
        items: [
            { name: 'Vegetable Wrap', quantity: 1, price: 7.0 },
            { name: 'Vesi', quantity: 1, price: 0.0 },
        ],
        total: 7.0,
    },
];
let activeOrders = [];
let archivedOrders = [];
function updateOrderLists() {
    activeOrders = orders.filter((order) => order.status === 'Aktiivinen');
    archivedOrders = orders.filter((order) => order.status === 'Arkistoitu');
}
updateOrderLists();
let currentView = 'Aktiivinen';
// DOM-elementit
const ordersTableBody = document.querySelector('#orders-table tbody');
const orderTableTitle = document.getElementById('order-table-title');
const showActiveBtn = document.getElementById('show-active');
const showArchivedBtn = document.getElementById('show-archived');
// Näytä aktiiviset tilaukset
showActiveBtn.addEventListener('click', () => {
    currentView = 'Aktiivinen';
    renderOrdersTable();
    orderTableTitle.textContent = 'Aktiiviset tilaukset';
    showActiveBtn.classList.replace('btn-secondary', 'btn-primary');
    showArchivedBtn.classList.replace('btn-primary', 'btn-secondary');
});
// Näytä arkistoidut tilaukset
showArchivedBtn.addEventListener('click', () => {
    currentView = 'Arkistoitu';
    renderOrdersTable();
    orderTableTitle.textContent = 'Arkistoidut tilaukset';
    showActiveBtn.classList.replace('btn-primary', 'btn-secondary');
    showArchivedBtn.classList.replace('btn-secondary', 'btn-primary');
});
// Renderöi tilaukset taulukkoon
function renderOrdersTable() {
    ordersTableBody.innerHTML = '';
    const ordersToRender = currentView === 'Aktiivinen' ? activeOrders : archivedOrders;
    ordersToRender.forEach((order) => {
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${order.id}</td>
        <td>${order.customer}</td>
        <td>${order.date}</td>
        <td>${order.status}</td>
        <td>
          <button class="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#orderModal" onclick="viewOrder(${order.id})">Näytä</button>
        </td>
      `;
        ordersTableBody.appendChild(row);
    });
}
// Näytä tilauksen tiedot modalissa
function viewOrder(orderId) {
    const order = orders.find((o) => o.id === orderId);
    if (!order)
        return;
    document.getElementById('modal-order-id').textContent =
        order.id.toString();
    const orderDetails = document.getElementById('order-details');
    orderDetails.innerHTML = `
      <p><strong>Asiakas:</strong> ${order.customer}</p>
      <p><strong>Päivämäärä:</strong> ${order.date}</p>
      <p><strong>Status:</strong> ${order.status}</p>
      <h5>Tuotteet:</h5>
      <ul>
        ${order.items
        .map((item) => `<li>${item.quantity} x ${item.name} - ${item.price.toFixed(2)}€</li>`)
        .join('')}
      </ul>
      <p><strong>Yhteensä:</strong> ${order.total.toFixed(2)}€</p>
    `;
    // Näytä tai piilota Arkistoi-painike
    const archiveBtn = document.getElementById('archive-order-btn');
    if (order.status === 'Aktiivinen') {
        archiveBtn.style.display = 'inline-block';
        archiveBtn.onclick = () => archiveOrder(orderId);
    }
    else {
        archiveBtn.style.display = 'none';
    }
}
// Arkistoi tilaus
function archiveOrder(orderId) {
    if (confirm('Haluatko varmasti arkistoida tämän tilauksen?')) {
        const order = orders.find((o) => o.id === orderId);
        if (order) {
            order.status = 'Arkistoitu';
            updateOrderLists();
            renderOrdersTable();
            // Sulje modal
            const orderModalElement = document.getElementById('orderModal');
            if (orderModalElement) {
                const orderModal = window.bootstrap.Modal.getInstance(orderModalElement);
                if (orderModal) {
                    orderModal.hide();
                }
            }
        }
    }
}
// Tee funktiot globaaleiksi, jotta ne ovat käytettävissä onclick-attribuuteissa
window.viewOrder = viewOrder;
window.archiveOrder = archiveOrder;
renderOrdersTable();
//# sourceMappingURL=tilaukset.js.map