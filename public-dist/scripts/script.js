"use strict";
// script.ts
// Teemakytkin
var themeToggleBtn = document.getElementById('theme-toggle');
if (themeToggleBtn) {
    var currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
    themeToggleBtn.addEventListener('click', function () {
        document.body.classList.toggle('dark-theme');
        var theme = 'light';
        if (document.body.classList.contains('dark-theme')) {
            theme = 'dark';
        }
        localStorage.setItem('theme', theme);
    });
}
// Ostoskoriin lisääminen (vain jos sivulla on ostoskori)
if (document.querySelectorAll('.add-to-cart').length > 0) {
    var cart_1 = [];
    function setupAddToCartButtons() {
        var addToCartButtons = document.querySelectorAll('.add-to-cart');
        addToCartButtons.forEach(function (button) {
            button.addEventListener('click', function () {
                var product = button.getAttribute('data-product');
                var priceAttr = button.getAttribute('data-price');
                if (product && priceAttr) {
                    var price = parseFloat(priceAttr);
                    var item = cart_1.find(function (item) { return item.product === product; });
                    if (item) {
                        item.quantity += 1;
                    }
                    else {
                        cart_1.push({ product: product, price: price, quantity: 1 });
                    }
                    updateCartModal();
                }
            });
        });
    }
    function updateCartModal() {
        var cartItemsContainer = document.getElementById('cart-items');
        cartItemsContainer.innerHTML = '';
        if (cart_1.length === 0) {
            cartItemsContainer.innerHTML = '<p>Ostoskorisi on tyhjä.</p>';
            return;
        }
        var list = document.createElement('ul');
        list.classList.add('list-group');
        cart_1.forEach(function (item) {
            var listItem = document.createElement('li');
            listItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
            listItem.textContent = "".concat(item.product, " x ").concat(item.quantity);
            var priceSpan = document.createElement('span');
            priceSpan.classList.add('badge', 'bg-primary', 'rounded-pill');
            priceSpan.textContent = "".concat((item.price * item.quantity).toFixed(2), "\u20AC");
            listItem.appendChild(priceSpan);
            list.appendChild(listItem);
        });
        cartItemsContainer.appendChild(list);
    }
    setupAddToCartButtons();
}
// Kirjautumislomakkeen käsittely (vain jos sivulla on kirjautumislomake)
var loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        alert('Kirjautuminen ei ole käytettävissä.');
    });
}
//# sourceMappingURL=script.js.map