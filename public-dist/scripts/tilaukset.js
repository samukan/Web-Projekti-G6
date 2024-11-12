"use strict";
// tilaukset.ts
// Esimerkkidata tilauksille
var orders = [
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
var activeOrders = [];
var archivedOrders = [];
function updateOrderLists() {
    activeOrders = orders.filter(function (order) { return order.status === 'Aktiivinen'; });
    archivedOrders = orders.filter(function (order) { return order.status === 'Arkistoitu'; });
}
updateOrderLists();
var currentView = 'Aktiivinen';
// DOM-elementit
var ordersTableBody = document.querySelector('#orders-table tbody');
var orderTableTitle = document.getElementById('order-table-title');
var showActiveBtn = document.getElementById('show-active');
var showArchivedBtn = document.getElementById('show-archived');
// Näytä aktiiviset tilaukset
showActiveBtn.addEventListener('click', function () {
    currentView = 'Aktiivinen';
    renderOrdersTable();
    orderTableTitle.textContent = 'Aktiiviset tilaukset';
    showActiveBtn.classList.replace('btn-secondary', 'btn-primary');
    showArchivedBtn.classList.replace('btn-primary', 'btn-secondary');
});
// Näytä arkistoidut tilaukset
showArchivedBtn.addEventListener('click', function () {
    currentView = 'Arkistoitu';
    renderOrdersTable();
    orderTableTitle.textContent = 'Arkistoidut tilaukset';
    showActiveBtn.classList.replace('btn-primary', 'btn-secondary');
    showArchivedBtn.classList.replace('btn-secondary', 'btn-primary');
});
// Renderöi tilaukset taulukkoon
function renderOrdersTable() {
    ordersTableBody.innerHTML = '';
    var ordersToRender = currentView === 'Aktiivinen' ? activeOrders : archivedOrders;
    ordersToRender.forEach(function (order) {
        var row = document.createElement('tr');
        row.innerHTML = "\n        <td>".concat(order.id, "</td>\n        <td>").concat(order.customer, "</td>\n        <td>").concat(order.date, "</td>\n        <td>").concat(order.status, "</td>\n        <td>\n          <button class=\"btn btn-sm btn-primary\" data-bs-toggle=\"modal\" data-bs-target=\"#orderModal\" onclick=\"viewOrder(").concat(order.id, ")\">N\u00E4yt\u00E4</button>\n        </td>\n      ");
        ordersTableBody.appendChild(row);
    });
}
// Näytä tilauksen tiedot modalissa
function viewOrder(orderId) {
    var order = orders.find(function (o) { return o.id === orderId; });
    if (!order)
        return;
    document.getElementById('modal-order-id').textContent =
        order.id.toString();
    var orderDetails = document.getElementById('order-details');
    orderDetails.innerHTML = "\n      <p><strong>Asiakas:</strong> ".concat(order.customer, "</p>\n      <p><strong>P\u00E4iv\u00E4m\u00E4\u00E4r\u00E4:</strong> ").concat(order.date, "</p>\n      <p><strong>Status:</strong> ").concat(order.status, "</p>\n      <h5>Tuotteet:</h5>\n      <ul>\n        ").concat(order.items
        .map(function (item) {
        return "<li>".concat(item.quantity, " x ").concat(item.name, " - ").concat(item.price.toFixed(2), "\u20AC</li>");
    })
        .join(''), "\n      </ul>\n      <p><strong>Yhteens\u00E4:</strong> ").concat(order.total.toFixed(2), "\u20AC</p>\n    ");
    // Näytä tai piilota Arkistoi-painike
    var archiveBtn = document.getElementById('archive-order-btn');
    if (order.status === 'Aktiivinen') {
        archiveBtn.style.display = 'inline-block';
        archiveBtn.onclick = function () { return archiveOrder(orderId); };
    }
    else {
        archiveBtn.style.display = 'none';
    }
}
// Arkistoi tilaus
function archiveOrder(orderId) {
    if (confirm('Haluatko varmasti arkistoida tämän tilauksen?')) {
        var order = orders.find(function (o) { return o.id === orderId; });
        if (order) {
            order.status = 'Arkistoitu';
            updateOrderLists();
            renderOrdersTable();
            // Sulje modal
            var orderModalElement = document.getElementById('orderModal');
            if (orderModalElement) {
                var orderModal = window.bootstrap.Modal.getInstance(orderModalElement);
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