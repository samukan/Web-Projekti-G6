// public/scripts/menu.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { setupAddToCartButtons } from './cart.js';
const menuContainer = document.getElementById('menu-container');
function fetchMenu() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch('/api/menu');
            const menuItems = yield response.json();
            displayMenu(menuItems);
        }
        catch (error) {
            console.error('Virhe haettaessa ruokalistaa:', error);
            if (menuContainer) {
                menuContainer.innerHTML = '<p>Ruokalistan lataaminen epäonnistui.</p>';
            }
        }
    });
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
    // Lisää event listenerit "Lisää ostoskoriin" -nappeihin
    setupAddToCartButtons();
}
fetchMenu();
//# sourceMappingURL=menu.js.map