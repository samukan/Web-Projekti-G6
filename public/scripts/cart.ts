// public/scripts/cart.ts

interface CartItem {
  product: string;
  price: number;
  quantity: number;
}

export let cart: CartItem[] = []; // Exportattu muuttuja

// Alustaa ostoskorin localStoragesta
const storedCart = localStorage.getItem('cart');
if (storedCart) {
  cart = JSON.parse(storedCart);
}

// Päivitä ostoskorin sisältö modaalissa
export function updateCartModal(): void {
  console.log('updateCartModal called');
  const cartItemsContainer = document.getElementById(
    'cart-items'
  ) as HTMLElement;
  const totalContainer = document.getElementById('cart-total') as HTMLElement;

  if (!cartItemsContainer) {
    console.error('cart-items elementtiä ei löytynyt');
    return;
  }

  cartItemsContainer.innerHTML = '';

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p>Ostoskorisi on tyhjä.</p>';
    if (totalContainer) totalContainer.textContent = 'Yhteensä: 0.00€';
    return;
  }

  const list = document.createElement('ul');
  list.classList.add('list-group');

  cart.forEach((item) => {
    const listItem = document.createElement('li');
    listItem.classList.add(
      'list-group-item',
      'd-flex',
      'justify-content-between',
      'align-items-center'
    );

    const itemDetails = document.createElement('div');
    itemDetails.textContent = `${item.product} x ${item.quantity}`;

    const quantityControls = document.createElement('div');
    quantityControls.innerHTML = `
      <button class="btn btn-sm btn-outline-secondary me-2" data-action="decrease" data-product="${item.product}">–</button>
      <button class="btn btn-sm btn-outline-secondary" data-action="increase" data-product="${item.product}">+</button>
    `;

    const priceSpan = document.createElement('span');
    priceSpan.classList.add('badge', 'bg-primary', 'rounded-pill');
    priceSpan.textContent = `${(item.price * item.quantity).toFixed(2)}€`;

    listItem.appendChild(itemDetails);
    listItem.appendChild(quantityControls);
    listItem.appendChild(priceSpan);

    list.appendChild(listItem);
  });

  cartItemsContainer.appendChild(list);

  // Lisää tapahtumakuuntelijat määrän muuttamiseen
  list.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    const action = target.getAttribute('data-action');
    const product = target.getAttribute('data-product');

    if (product && action) {
      if (action === 'decrease') updateQuantity(product, -1);
      if (action === 'increase') updateQuantity(product, 1);
    }
  });

  // Päivitä kokonaishinta
  if (totalContainer) {
    totalContainer.textContent = `Yhteensä: ${calculateTotal().toFixed(2)}€`;
  }
}

// Tuotteen määrän muuttaminen
function updateQuantity(productName: string, delta: number): void {
  console.log(`updateQuantity called for ${productName} with delta ${delta}`);
  const item = cart.find((item) => item.product === productName);
  if (item) {
    item.quantity += delta;
    if (item.quantity <= 0) {
      removeItemFromCart(productName);
    } else {
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartModal();
      updateCartCount();
    }
  }
}

// Poista tuote ostoskorista
function removeItemFromCart(productName: string): void {
  console.log(`removeItemFromCart called for ${productName}`);
  cart = cart.filter((item) => item.product !== productName);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartModal();
  updateCartCount();
}

// Tyhjennä ostoskori
export function clearCart(): void {
  console.log('clearCart called');
  cart = [];
  localStorage.removeItem('cart');
  updateCartModal();
  updateCartCount();
}

// Laske kokonaishinta
function calculateTotal(): number {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

// Päivitä ostoskorin laskuri
export function updateCartCount(): void {
  console.log('updateCartCount called');
  const cartCountElement = document.getElementById('cart-count') as HTMLElement;
  if (!cartCountElement) {
    console.error('cart-count elementtiä ei löytynyt');
    return;
  }

  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (totalQuantity > 0) {
    cartCountElement.textContent = totalQuantity.toString();
    cartCountElement.style.display = 'inline-block';
  } else {
    cartCountElement.textContent = '0';
    cartCountElement.style.display = 'none';
  }
}

// Alusta ostoskorin tila sivun latauksen yhteydessä
export function initializeCart(): void {
  console.log('initializeCart called');
  updateCartModal();
  updateCartCount();
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('cart.js DOMContentLoaded');
  initializeCart();
});
