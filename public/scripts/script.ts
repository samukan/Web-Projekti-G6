// script.ts

// Teemakytkin
const themeToggleBtn = document.getElementById(
  'theme-toggle'
) as HTMLButtonElement | null;
if (themeToggleBtn) {
  const currentTheme = localStorage.getItem('theme');

  if (currentTheme === 'dark') {
    document.body.classList.add('dark-theme');
  }

  themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    let theme = 'light';
    if (document.body.classList.contains('dark-theme')) {
      theme = 'dark';
    }
    localStorage.setItem('theme', theme);
  });
}

// Ostoskoriin lisääminen (vain jos sivulla on ostoskori)
if (document.querySelectorAll('.add-to-cart').length > 0) {
  interface CartItem {
    product: string;
    price: number;
    quantity: number;
  }

  let cart: CartItem[] = [];

  function setupAddToCartButtons(): void {
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

          updateCartModal();
        }
      });
    });
  }

  function updateCartModal(): void {
    const cartItemsContainer = document.getElementById(
      'cart-items'
    ) as HTMLElement;
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = '<p>Ostoskorisi on tyhjä.</p>';
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
      listItem.textContent = `${item.product} x ${item.quantity}`;
      const priceSpan = document.createElement('span');
      priceSpan.classList.add('badge', 'bg-primary', 'rounded-pill');
      priceSpan.textContent = `${(item.price * item.quantity).toFixed(2)}€`;
      listItem.appendChild(priceSpan);
      list.appendChild(listItem);
    });

    cartItemsContainer.appendChild(list);
  }

  setupAddToCartButtons();
}

// Kirjautumislomakkeen käsittely (vain jos sivulla on kirjautumislomake)
const loginForm = document.getElementById(
  'login-form'
) as HTMLFormElement | null;

if (loginForm) {
  loginForm.addEventListener('submit', (e: Event) => {
    e.preventDefault();
    alert('Kirjautuminen ei ole käytettävissä.');
  });
}
