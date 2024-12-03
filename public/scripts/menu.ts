// public/scripts/menu.ts

import {setupAddToCartButtons} from './addToCart.js';

// Ruokalistan kohteen rajapinta
interface MenuItem {
  item_id: number;
  name: string;
  description: string;
  price: number | string;
  category: string;
  image_url: string;
}

const menuContainer = document.getElementById('menu-container');

async function fetchMenu() {
  try {
    // Yritetään hakea ruokalista backendistä
    const response = await fetch('/api/menu');
    if (response.ok) {
      const menuItems: MenuItem[] = await response.json();
      displayMenu(menuItems); // Näytetään menu, jos onnistui
    } else {
      console.error('Virhe haettaessa ruokalistaa.');
      if (menuContainer) {
        menuContainer.innerHTML = '<p>Ruokalistan lataaminen epäonnistui.</p>';
      }
    }
  } catch (error) {
    console.error('Virhe haettaessa ruokalistaa:', error);
    if (menuContainer) {
      menuContainer.innerHTML = '<p>Ruokalistan lataaminen epäonnistui.</p>';
    }
  }
}

function displayMenu(menuItems: MenuItem[]) {
  if (!menuContainer) return;

  let html = '';

  menuItems.forEach((item) => {
    html += `
      <div class="col">
        <div class="card h-100 text-center shadow-sm">
          <img
            src="${item.image_url}"
            class="card-img-top"
            alt="${item.name}"
          />
          <div class="card-body">
            <h5 class="card-title">${item.name}</h5>
            <p class="card-text">${item.description}</p>
            <p class="card-text">Hinta: ${Number(item.price).toFixed(2)}€</p>
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

  // Lisää event listenerit ostoskoriin lisäämistä varten
  setupAddToCartButtons();
}

fetchMenu();
