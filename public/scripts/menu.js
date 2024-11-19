"use strict";
// public/scripts/menu.ts
Object.defineProperty(exports, "__esModule", { value: true });
const cart_js_1 = require("./cart.js");
const menuContainer = document.getElementById('menu-container');
async function fetchMenu() {
    try {
        const response = await fetch('/api/menu');
        const menuItems = await response.json();
        displayMenu(menuItems);
    }
    catch (error) {
        console.error('Virhe haettaessa ruokalistaa:', error);
        if (menuContainer) {
            menuContainer.innerHTML = '<p>Ruokalistan lataaminen epäonnistui.</p>';
        }
    }
}
function displayMenu(menuItems) {
    if (!menuContainer)
        return;
    let html = '';
    menuItems.forEach((item) => {
        html += `
        <div class="col">
          <div class="card h-100 text-center shadow-sm">
            <img
              src="${item.image}"
              class="card-img-top"
              alt="${item.name}"
            />
            <div class="card-body">
              <h5 class="card-title">${item.name}</h5>
              <p class="card-text">${item.description}</p>
              <p class="card-text">Hinta: ${item.price.toFixed(2)}€</p>
            </div>
            <div class="card-footer">
              <button
                class="btn btn-success w-100 add-to-cart"
                data-product="${item.name}"
                data-price="${item.price}"
              >
                Lisää ostoskoriin
              </button>
            </div>
          </div>
        </div>
      `;
    });
    menuContainer.innerHTML = `
      <div class="row row-cols-1 row-cols-md-4 g-4">
        ${html}
      </div>
    `;
    // Lisää event listenerit
    (0, cart_js_1.setupAddToCartButtons)();
}
fetchMenu();
