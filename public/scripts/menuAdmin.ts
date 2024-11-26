// public/scripts/menuAdmin.ts

// Ruokalistan kohteen rajapinta
interface MenuItem {
  item_id: number;
  name: string;
  description: string;
  price: number | string;
  category: string;
  image_url: string;
  popular: boolean;
}

// Viittaukset DOM-elementteihin
const addProductForm = document.getElementById(
  'add-product-form'
) as HTMLFormElement;
const productTableBody = document.querySelector(
  '#product-table tbody'
) as HTMLTableSectionElement;

// Funktio autentikoinnin tarkistamiseen
async function checkAuthentication(): Promise<void> {
  const token = localStorage.getItem('token');

  if (!token) {
    alert('Sinun täytyy kirjautua sisään päästäksesi tälle sivulle.');
    window.location.href = '/login.html';
    return;
  }

  try {
    const response = await fetch('/api/auth/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Token ei kelpaa');
    }

    const data = await response.json();

    if (!data.isAdmin) {
      alert('Sinulla ei ole oikeuksia tälle sivulle.');
      window.location.href = '/';
    } else {
      // Käyttäjä on autentikoitu ja on admin, jatka sivun latausta
      fetchMenuItems();
    }
  } catch (error) {
    console.error('Autentikointivirhe:', error);
    alert('Autentikointi epäonnistui. Kirjaudu uudelleen.');
    window.location.href = '/login.html';
  }
}

// Alustetaan kun sivu latautuu
document.addEventListener('DOMContentLoaded', () => {
  checkAuthentication();
});

// Lisää uuden tuotteen
addProductForm.addEventListener('submit', addProductHandler);

// Käsittelee uuden tuotteen lisäämisen
async function addProductHandler(e: Event): Promise<void> {
  e.preventDefault();

  const name = (document.getElementById('product-name') as HTMLInputElement)
    .value;
  const description = (
    document.getElementById('product-description') as HTMLInputElement
  ).value;
  const price = parseFloat(
    (document.getElementById('product-price') as HTMLInputElement).value
  );
  const category = (
    document.getElementById('product-category') as HTMLSelectElement
  ).value;
  const image_url = (
    document.getElementById('product-image') as HTMLInputElement
  ).value;
  const popular = (
    document.getElementById('product-popular') as HTMLInputElement
  ).checked;

  try {
    const response = await fetch('/api/menu', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        name,
        description,
        price,
        category,
        image_url,
        popular,
      }),
    });

    if (response.ok) {
      alert('Ruokalistan kohde lisätty!');
      addProductForm.reset();
      fetchMenuItems();
    } else {
      if (response.status === 401 || response.status === 403) {
        alert('Autentikointi epäonnistui. Kirjaudu uudelleen.');
        window.location.href = '/login.html';
        return;
      }
      const errorData = await response.json();
      alert('Virhe lisättäessä ruokalistan kohdetta: ' + errorData.message);
    }
  } catch (error) {
    console.error('Virhe lisättäessä ruokalistan kohdetta:', error);
    alert('Virhe lisättäessä ruokalistan kohdetta.');
  }
}

// Renderöi tuotelista taulukkoon
async function fetchMenuItems(): Promise<void> {
  try {
    const response = await fetch('/api/menu', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (response.ok) {
      const menuItems: MenuItem[] = await response.json();
      renderProductTable(menuItems);
    } else {
      if (response.status === 401 || response.status === 403) {
        alert('Autentikointi epäonnistui. Kirjaudu uudelleen.');
        window.location.href = '/login.html';
        return;
      }
      const errorData = await response.json();
      alert('Virhe haettaessa ruokalistan kohteita: ' + errorData.message);
    }
  } catch (error) {
    console.error('Virhe haettaessa ruokalistan kohteita:', error);
    alert('Virhe haettaessa ruokalistan kohteita.');
  }
}

// Renderöi tuotelista taulukkoon – taikatemppuja koodilla
function renderProductTable(menuItems: MenuItem[]): void {
  productTableBody.innerHTML = '';

  menuItems.forEach((item) => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.description}</td>
      <td>${Number(item.price).toFixed(
        2
      )}</td> <!-- Muutettu Number(item.price).toFixed(2) -->
      <td>${item.category}</td>
      <td>
        ${
          item.image_url
            ? `<img src="${item.image_url}" alt="${item.name}" width="50">`
            : 'Ei kuvaa'
        }
      </td>
      <td>
        <button class="btn btn-sm btn-warning me-2 edit-button" data-id="${
          item.item_id
        }">Muokkaa</button>
        <button class="btn btn-sm btn-danger delete-button" data-id="${
          item.item_id
        }">Poista</button>
      </td>
    `;

    productTableBody.appendChild(row);
  });

  // Lisää event listenerit muokkaus ja poistopainikkeille
  const editButtons = document.querySelectorAll('.edit-button');
  const deleteButtons = document.querySelectorAll('.delete-button');

  editButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const id = button.getAttribute('data-id');
      editMenuItem(id);
    });
  });

  deleteButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const id = button.getAttribute('data-id');
      deleteMenuItem(id);
    });
  });
}

// Poista tuote
async function deleteMenuItem(id: string | null): Promise<void> {
  if (!id) return;

  if (!confirm('Haluatko varmasti poistaa tämän tuotteen?')) return;

  try {
    const response = await fetch(`/api/menu/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (response.ok) {
      alert('Ruokalistan kohde poistettu.');
      fetchMenuItems(); // Päivitä taulukko
    } else {
      const errorData = await response.json();
      alert('Virhe poistettaessa ruokalistan kohdetta: ' + errorData.message);
    }
  } catch (error) {
    console.error('Virhe poistettaessa ruokalistan kohdetta:', error);
    alert('Virhe poistettaessa ruokalistan kohdetta.');
  }
}

// Muokkaa tuote
async function editMenuItem(id: string | null): Promise<void> {
  if (!id) return;

  try {
    // Hae tuotteen tiedot yksittäisen id:n perusteella
    const response = await fetch(`/api/menu/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (response.ok) {
      const item: MenuItem = await response.json();

      // Täytä lomake tuotteen tiedoilla
      (document.getElementById('product-name') as HTMLInputElement).value =
        item.name;
      (
        document.getElementById('product-description') as HTMLInputElement
      ).value = item.description;
      (document.getElementById('product-price') as HTMLInputElement).value =
        item.price.toString();
      (document.getElementById('product-category') as HTMLSelectElement).value =
        item.category;
      (document.getElementById('product-image') as HTMLInputElement).value =
        item.image_url;

      // Muuta lomakkeen toiminnallisuutta päivitykseen
      addProductForm.removeEventListener('submit', addProductHandler);
      const updateHandler = async (e: Event) => {
        e.preventDefault();
        await updateProductHandler(id);
      };
      addProductForm.addEventListener('submit', updateHandler);

      // Muuta painikkeen tekstiä
      const submitButton = addProductForm.querySelector(
        'button[type="submit"]'
      ) as HTMLButtonElement;
      submitButton.textContent = 'Päivitä tuote';
    } else {
      const errorData = await response.json();
      alert('Virhe haettaessa ruokalistan kohdetta: ' + errorData.message);
    }
  } catch (error) {
    console.error('Virhe haettaessa ruokalistan kohdetta:', error);
    alert('Virhe haettaessa ruokalistan kohdetta.');
  }
}

// Käsittelee tuotteen päivityksen
async function updateProductHandler(id: string | null): Promise<void> {
  if (!id) return;

  const name = (document.getElementById('product-name') as HTMLInputElement)
    .value;
  const description = (
    document.getElementById('product-description') as HTMLInputElement
  ).value;
  const price = parseFloat(
    (document.getElementById('product-price') as HTMLInputElement).value
  );
  const category = (
    document.getElementById('product-category') as HTMLSelectElement
  ).value;
  const image_url = (
    document.getElementById('product-image') as HTMLInputElement
  ).value;

  try {
    const response = await fetch(`/api/menu/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({name, description, price, category, image_url}),
    });

    if (response.ok) {
      alert('Ruokalistan kohteen tiedot päivitetty.');
      addProductForm.reset();
      fetchMenuItems();

      addProductForm.removeEventListener('submit', updateProductHandler as any);
      addProductForm.addEventListener('submit', addProductHandler);

      // Palauttaa painikkeen tekstin
      const submitButton = addProductForm.querySelector(
        'button[type="submit"]'
      ) as HTMLButtonElement;
      submitButton.textContent = 'Lisää tuote';
    } else {
      const errorData = await response.json();
      alert('Virhe päivittäessä ruokalistan kohdetta: ' + errorData.message);
    }
  } catch (error) {
    console.error('Virhe päivittäessä ruokalistan kohdetta:', error);
    alert('Virhe päivittäessä ruokalistan kohdetta.');
  }
}
