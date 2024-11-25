// public/scripts/cart.ts

interface CartItem {
  product: string;
  price: number;
  quantity: number;
}

let cart: CartItem[] = [];

// Alustaa ostoskorin localStoragesta
const storedCart = localStorage.getItem('cart');
if (storedCart) {
  cart = JSON.parse(storedCart);
}

// Lisää ostoskori-napit
export function setupAddToCartButtons(): void {
  const addToCartButtons = document.querySelectorAll('.add-to-cart');

  addToCartButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const product = (button as HTMLElement).getAttribute('data-product');
      const priceAttr = (button as HTMLElement).getAttribute('data-price');

      if (product && priceAttr) {
        const price = parseFloat(priceAttr);

        const item = cart.find((item) => item.product === product);

        if (item) {
          item.quantity += 1;
        } else {
          cart.push({product, price, quantity: 1});
        }

        // Tallenna ostoskori localStorageen
        localStorage.setItem('cart', JSON.stringify(cart));

        updateCartModal();
        updateCartCount();
      }
    });
  });
}

// Päivitä ostoskorin sisältö modaalissa
export function updateCartModal(): void {
  const cartItemsContainer = document.getElementById(
    'cart-items'
  ) as HTMLElement;
  const totalContainer = document.getElementById('cart-total') as HTMLElement;

  if (!cartItemsContainer) return;

  cartItemsContainer.innerHTML = '';

  // Jos ostoskori on tyhjä niin tämä näkyy käyttäjälle
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p>Ostoskorisi on tyhjä.</p>';
    if (totalContainer) totalContainer.textContent = 'Yhteensä: 0.00€';
    return;
  }

  const list = document.createElement('ul');
  list.classList.add('list-group');

  // Luo lista tuotteista
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

    // Luo "+" ja "–" -napit määrän muuttamiseksi
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
  cart = cart.filter((item) => item.product !== productName);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartModal();
  updateCartCount();
}

// Tyhjennä ostoskori
export function clearCart(): void {
  cart = [];
  localStorage.removeItem('cart');
  updateCartModal();
  updateCartCount();
}

// Laske kokonaishinta
function calculateTotal(): number {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function updateCartCount(): void {
  const cartCountElement = document.getElementById('cart-count') as HTMLElement;
  if (!cartCountElement) return;

  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (totalQuantity > 0) {
    cartCountElement.textContent = totalQuantity.toString();
    cartCountElement.style.display = 'inline-block';
  } else {
    cartCountElement.textContent = '';
    cartCountElement.style.display = 'none';
  }
}

// Exporttaa ostoskori
export {cart};
