// menuAdmin.ts
// Tää on vaan väliaikainen ratkaisu, jotta saadaan jotain toimivaa aikaiseksi

// Tuote-tyypin määrittely
interface Product {
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

// Alustava tuotelista (Tähän joku back-end toiminnallisuus jossain vaiheessa?)
let products: Product[] = [];

// Viittaukset DOM-elementteihin
const addProductForm = document.getElementById(
  'add-product-form'
) as HTMLFormElement;
const productTableBody = document.querySelector(
  '#product-table tbody'
) as HTMLTableSectionElement;

// Lisää uuden tuotteen
addProductForm.addEventListener('submit', (e: Event) => {
  e.preventDefault();

  const product: Product = {
    name: (document.getElementById('product-name') as HTMLInputElement).value,
    description: (
      document.getElementById('product-description') as HTMLInputElement
    ).value,
    price: parseFloat(
      (document.getElementById('product-price') as HTMLInputElement).value
    ),
    category: (document.getElementById('product-category') as HTMLInputElement)
      .value,
    image: (document.getElementById('product-image') as HTMLInputElement).value,
  };

  products.push(product);
  renderProductTable();

  addProductForm.reset();
});

// Renderöi tuotelista taulukkoon
function renderProductTable(): void {
  productTableBody.innerHTML = '';

  products.forEach((product, index) => {
    const row = document.createElement('tr');

    row.innerHTML = `
        <td>${product.name}</td>
        <td>${product.description}</td>
        <td>${product.price.toFixed(2)}</td>
        <td>${product.category}</td>
        <td>
          ${
            product.image
              ? `<img src="${product.image}" alt="${product.name}" width="50">`
              : 'Ei kuvaa'
          }
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
function deleteProduct(index: number): void {
  if (confirm('Haluatko varmasti poistaa tämän tuotteen?')) {
    products.splice(index, 1);
    renderProductTable();
  }
}

// Muokkaa tuotetta
function editProduct(index: number): void {
  const product = products[index];

  // Täytä lomake tuotteen tiedoilla
  (document.getElementById('product-name') as HTMLInputElement).value =
    product.name;
  (document.getElementById('product-description') as HTMLInputElement).value =
    product.description;
  (document.getElementById('product-price') as HTMLInputElement).value =
    product.price.toString();
  (document.getElementById('product-category') as HTMLInputElement).value =
    product.category;
  (document.getElementById('product-image') as HTMLInputElement).value =
    product.image;

  // Poista vanha tuote
  products.splice(index, 1);
  renderProductTable();
}

// Tekee tuotteista globaalin muuttujan, jotta niitä voidaan käyttää muualla
(window as any).deleteProduct = deleteProduct;
(window as any).editProduct = editProduct;
