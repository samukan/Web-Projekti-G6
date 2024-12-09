// public/scripts/addToCart.ts

declare const bootstrap: any;

import {isAuthenticated} from './auth.js';
import {updateCartModal, updateCartCount, cart} from './cart.js';

interface CartItem {
  product: string;
  price: number;
  quantity: number;
}

// Funktio, joka näyttää toast-ilmoituksen ja avaa kirjautumismodaalin
function promptLogin(): void {
  console.log('promptLogin: Näytetään loginToast ja avataan loginModal');

  // Näytä toast-ilmoitus
  const loginToastEl = document.getElementById('loginToast') as HTMLElement;
  if (loginToastEl) {
    const loginToast = new bootstrap.Toast(loginToastEl, {
      delay: 5000, // Viive 5 sekuntia
      autohide: true,
    });
    loginToast.show();
  } else {
    console.error('promptLogin: loginToast-elementtiä ei löytynyt');
  }

  // Avaa kirjautumismodaali
  const loginModalElement = document.getElementById(
    'loginModal'
  ) as HTMLElement;
  if (loginModalElement) {
    const loginModal = new bootstrap.Modal(loginModalElement);
    loginModal.show();
  } else {
    console.error('promptLogin: loginModal-elementtiä ei löytynyt');
  }
}

// Funktio, joka näyttää tuotteen lisäyksen toast-ilmoituksen
function showAddedToCartToast(product: string): void {
  console.log(`showAddedToCartToast: Näytetään toast tuotteen: ${product}`);

  const addedToastEl = document.getElementById('addedToast') as HTMLElement;
  if (addedToastEl) {
    // Päivitä toast-viesti
    const toastBody = addedToastEl.querySelector('.toast-body') as HTMLElement;
    if (toastBody) {
      toastBody.textContent = `${product} on lisätty ostoskoriin!`;
    } else {
      console.error('showAddedToCartToast: toast-body-elementtiä ei löytynyt');
    }

    // Näytä toast
    const addedToast = new bootstrap.Toast(addedToastEl, {
      delay: 5000, // Viive 5 sekuntia
      autohide: true,
    });
    addedToast.show();
  } else {
    console.error('showAddedToCartToast: addedToast-elementtiä ei löytynyt');
  }
}

// Funktio, joka lisää tuotteen ostoskoriin
function addToCart(product: string, price: number): void {
  console.log(`addToCart: Lisää tuote: ${product}, hinta: ${price}`);

  // Käytä tuotettua 'cart' muuttujaa
  const existingItem = cart.find((item) => item.product === product);
  if (existingItem) {
    existingItem.quantity += 1;
    console.log(
      `addToCart: Päivitetään tuotteen ${product} määrä: ${existingItem.quantity}`
    );
  } else {
    cart.push({product, price, quantity: 1});
    console.log(`addToCart: Lisätään uusi tuote ${product} ostoskoriin`);
  }

  // Tallenna ostoskori takaisin localStorageen
  localStorage.setItem('cart', JSON.stringify(cart));

  // Päivitä ostoskorin sisältö modaalissa ja laskuri
  updateCartModal();
  updateCartCount();

  // Näytä toast-ilmoitus tuotteen lisäämisestä
  showAddedToCartToast(product);
}

// Lisää tapahtumankuuntelijat kaikille "Lisää ostoskoriin" -napeille
export function setupAddToCartButtons(): void {
  console.log(
    'setupAddToCartButtons: Asetetaan tapahtumankuuntelijat add-to-cart-napeille'
  );

  const addToCartButtons = document.querySelectorAll('.add-to-cart');

  addToCartButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const product = (button as HTMLElement).getAttribute('data-product');
      const priceAttr = (button as HTMLElement).getAttribute('data-price');

      console.log(`Klikattu tuote: ${product}, hintaAttr: ${priceAttr}`);

      if (product && priceAttr) {
        const price = parseFloat(priceAttr);

        if (!isAuthenticated()) {
          console.log('Käyttäjä ei ole autentikoitunut');
          promptLogin();
          return;
        }

        console.log('Käyttäjä on autentikoitunut, lisätään ostoskoriin');
        addToCart(product, price);
      } else {
        console.error('Tuotteen nimi tai hinta puuttuu');
      }
    });
  });
}

// Alusta tapahtumankuuntelijat, kun DOM on ladattu
document.addEventListener('DOMContentLoaded', () => {
  console.log('addToCart.js DOMContentLoaded');
  setupAddToCartButtons();
});

export {};
