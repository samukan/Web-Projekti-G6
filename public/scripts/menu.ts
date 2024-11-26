// public/scripts/menu.ts

import {setupAddToCartButtons} from './cart.js';

// Ruokalistan kohteen rajapinta
interface MenuItem {
  item_id: number; // Numeroitu ainutlaatuinen ID – ei pelkkiä aakkosia, koska backend tykkää numeroista
  name: string; // Tuotteen nimi – "Herkullinen Hampurilainen" tyyliin
  description: string; // Tuotteen kuvaus – missä kerromme miksi tämä hampurilainen on niin mahtava
  price: number | string; // Hinta – joskus numerot joskus merkit, koska elämä on arvaamatonta
  category: string; // Kategoria – esim. "Pääruoat", "Jälkiruoat" tai "Kahvihetki"
  image_url: string; // Kuvalinkki – koska kuka haluaa lukea pelkkää tekstiä ruokalistalla?
}

const menuContainer = document.getElementById('menu-container');

async function fetchMenu() {
  try {
    // Yritetään hakea ruokalista backendistä ja rukoillaan että serveri ei ole jo joulu lomalla
    const response = await fetch('/api/menu');
    if (response.ok) {
      const menuItems: MenuItem[] = await response.json();
      displayMenu(menuItems); // Jos kaikki menee hyvin, näytetään menu
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
  if (!menuContainer) return; // Jos kenttiä ei löydy niin tästä tulee surullinen

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
            <p class="card-text">Hinta: ${Number(item.price).toFixed(
              2
            )}€</p> <!-- Muutettu Number(item.price).toFixed(2) -->
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
