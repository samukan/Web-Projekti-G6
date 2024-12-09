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
  dietary_info?: string;
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
            class="card-img-top product-image"
            alt="${item.name}"
          />
          <div class="card-body d-flex flex-column">
            <h3 class="card-title">${item.name}</h3>
            <p class="card-text flex-grow-1">${item.description}</p>
            ${
              item.dietary_info
                ? `<p class="card-text"><small class="text-muted"><i class="fas fa-leaf"></i> ${item.dietary_info}</small></p>`
                : ''
            }
            <p class="card-text">Hinta: ${Number(item.price).toFixed(2)}€</p>
          </div>
          <div class="card-footer">
            <button
              class="btn btn-success w-100 add-to-cart"
              data-product="${item.name}"
              data-price="${item.price}"
            >
              <i class="fas fa-cart-plus"></i> Lisää ostoskoriin
            </button>
          </div>
        </div>
      </div>
    `;
  });

  menuContainer.innerHTML = `
    <div class="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-4">
      ${html}
    </div>
  `;

  setupAddToCartButtons();
}

fetchMenu();
