"use strict";
// menuAdmin.ts
// Tää on vaan väliaikainen ratkaisu, jotta saadaan jotain toimivaa aikaiseksi
// Alustava tuotelista (Tähän joku back-end toiminnallisuus jossain vaiheessa?)
let products = [];
// Viittaukset DOM-elementteihin
const addProductForm = document.getElementById('add-product-form');
const productTableBody = document.querySelector('#product-table tbody');
// Lisää uuden tuotteen
addProductForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const product = {
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
    products.forEach((product, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${product.name}</td>
        <td>${product.description}</td>
        <td>${product.price.toFixed(2)}</td>
        <td>${product.category}</td>
        <td>
          ${product.image
            ? `<img src="${product.image}" alt="${product.name}" width="50">`
            : 'Ei kuvaa'}
        </td>
        <td>
          <button class="btn btn-sm btn-warning me-2" onclick="editProduct(${index})">Muokkaa</button>
          <button class="btn btn-sm btn-danger" onclick="deleteProduct(${index})">Poista</button>
        </td>
      `;
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
    const product = products[index];
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
// Tekee tuotteista globaalin muuttujan, jotta niitä voidaan käyttää muualla
window.deleteProduct = deleteProduct;
window.editProduct = editProduct;
