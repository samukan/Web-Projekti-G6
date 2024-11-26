// public/scripts/menu.ts
// Tää tiedosto hakee menu-tiedot back-endiltä ja näyttää ne käyttäjälle.

// Tuodaan ostoskorin toiminnallisuus mukaan
import {setupAddToCartButtons} from './cart.js';

// Menu-itemit. Koska ei me voida vaan käsitellä tuotteita ilman dataa.
interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

// Tähän se ruoka lista ilmestyy
const menuContainer = document.getElementById('menu-container');

// Hakee ruokalistan backendilta
async function fetchMenu() {
  try {
    const response = await fetch('/api/menu');
    const menuItems: MenuItem[] = await response.json();
    displayMenu(menuItems);
  } catch (error) {
    console.error('Virhe haettaessa ruokalistaa:', error);
    if (menuContainer) {
      menuContainer.innerHTML = '<p>Ruokalistan lataaminen epäonnistui.</p>';
    }
  }
}

// Renderöi menu ruudulle
function displayMenu(menuItems: MenuItem[]) {
  if (!menuContainer) return;

  let html = ''; // Kerää HTML

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
  setupAddToCartButtons();
}

fetchMenu();
