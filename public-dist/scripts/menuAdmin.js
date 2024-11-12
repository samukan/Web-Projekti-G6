"use strict";
// menuAdmin.ts
// Alustava tuotelista
var products = [];
// Viittaukset DOM-elementteihin
var addProductForm = document.getElementById('add-product-form');
var productTableBody = document.querySelector('#product-table tbody');
// Lisää uuden tuotteen
addProductForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var product = {
        name: document.getElementById('product-name').value,
        description: document.getElementById('product-description').value,
        price: parseFloat(document.getElementById('product-price').value),
        category: document.getElementById('product-category')
            .value,
        image: document.getElementById('product-image').value,
    };
    products.push(product);
    renderProductTable();
    addProductForm.reset();
});
// Renderöi tuotelista taulukkoon
function renderProductTable() {
    productTableBody.innerHTML = '';
    products.forEach(function (product, index) {
        var row = document.createElement('tr');
        row.innerHTML = "\n        <td>".concat(product.name, "</td>\n        <td>").concat(product.description, "</td>\n        <td>").concat(product.price.toFixed(2), "</td>\n        <td>").concat(product.category, "</td>\n        <td>\n          ").concat(product.image
            ? "<img src=\"".concat(product.image, "\" alt=\"").concat(product.name, "\" width=\"50\">")
            : 'Ei kuvaa', "\n        </td>\n        <td>\n          <button class=\"btn btn-sm btn-warning me-2\" onclick=\"editProduct(").concat(index, ")\">Muokkaa</button>\n          <button class=\"btn btn-sm btn-danger\" onclick=\"deleteProduct(").concat(index, ")\">Poista</button>\n        </td>\n      ");
        productTableBody.appendChild(row);
    });
}
// Poista tuote
function deleteProduct(index) {
    if (confirm('Haluatko varmasti poistaa tämän tuotteen?')) {
        products.splice(index, 1);
        renderProductTable();
    }
}
// Muokkaa tuotetta
function editProduct(index) {
    var product = products[index];
    // Täytä lomake tuotteen tiedoilla
    document.getElementById('product-name').value =
        product.name;
    document.getElementById('product-description').value =
        product.description;
    document.getElementById('product-price').value =
        product.price.toString();
    document.getElementById('product-category').value =
        product.category;
    document.getElementById('product-image').value =
        product.image;
    // Poista vanha tuote
    products.splice(index, 1);
    renderProductTable();
}
// Tee funktiot globaaleiksi, jotta ne ovat käytettävissä onclick-attribuuteissa
window.deleteProduct = deleteProduct;
window.editProduct = editProduct;
//# sourceMappingURL=menuAdmin.js.map