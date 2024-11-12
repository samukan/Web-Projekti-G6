// public/scripts/cart.ts
let cart = [];
// Alusta ostoskori localStoragesta, jos se on olemassa
const storedCart = localStorage.getItem('cart');
if (storedCart) {
    cart = JSON.parse(storedCart);
}
export function setupAddToCartButtons() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const product = button.getAttribute('data-product');
            const priceAttr = button.getAttribute('data-price');
            if (product && priceAttr) {
                const price = parseFloat(priceAttr);
                const item = cart.find((item) => item.product === product);
                if (item) {
                    item.quantity += 1;
                }
                else {
                    cart.push({ product, price, quantity: 1 });
                }
                // Tallenna ostoskori localStorageen
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartModal();
            }
        });
    });
}
export function updateCartModal() {
    const cartItemsContainer = document.getElementById('cart-items');
    if (!cartItemsContainer)
        return;
    cartItemsContainer.innerHTML = '';
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Ostoskorisi on tyhjä.</p>';
        return;
    }
    const list = document.createElement('ul');
    list.classList.add('list-group');
    cart.forEach((item) => {
        const listItem = document.createElement('li');
        listItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        listItem.textContent = `${item.product} x ${item.quantity}`;
        const priceSpan = document.createElement('span');
        priceSpan.classList.add('badge', 'bg-primary', 'rounded-pill');
        priceSpan.textContent = `${(item.price * item.quantity).toFixed(2)}€`;
        listItem.appendChild(priceSpan);
        list.appendChild(listItem);
    });
    cartItemsContainer.appendChild(list);
}
// Exportataan ostoskori, jos sitä tarvitaan muualla
export { cart };
//# sourceMappingURL=cart.js.map