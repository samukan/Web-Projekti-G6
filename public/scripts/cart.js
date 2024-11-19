"use strict";
// public/scripts/cart.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.cart = void 0;
exports.setupAddToCartButtons = setupAddToCartButtons;
exports.updateCartModal = updateCartModal;
let cart = [];
exports.cart = cart;
// Alustaa ostoskorin localStoragesta
const storedCart = localStorage.getItem('cart');
if (storedCart) {
    exports.cart = cart = JSON.parse(storedCart);
}
function setupAddToCartButtons() {
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
function updateCartModal() {
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
