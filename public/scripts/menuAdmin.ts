// public/scripts/menuAdmin.ts

declare const bootstrap: any;

import {showToast} from './auth.js';

interface MenuItem {
  item_id: number;
  name: string;
  description: string;
  price: number | string;
  category: string;
  image_url: string;
  popular: boolean;
  dietary_info?: string; // Lisätty erityisruokavaliot
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
    showToast(
      'Sinun täytyy kirjautua sisään päästäksesi tälle sivulle.',
      'warning'
    );
    setTimeout(() => {
      window.location.href = '/login.html';
    }, 1500);
    return;
  }

  try {
    const response = await fetch('/api/auth/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      throw new Error('Token ei kelpaa');
    }

    const data = await response.json();

    if (!data.isAdmin) {
      showToast('Sinulla ei ole oikeuksia tälle sivulle.', 'danger');
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    } else {
      // Käyttäjä on admin
      fetchMenuItems();
    }
  } catch (error) {
    console.error('Autentikointivirhe:', error);
    showToast('Autentikointi epäonnistui. Kirjaudu uudelleen.', 'danger');
    setTimeout(() => {
      window.location.href = '/login.html';
    }, 1500);
  }
}
// Alustetaan kun sivu latautuu
document.addEventListener('DOMContentLoaded', () => {
  checkAuthentication();
  setupImagePreview();
});

// Lisää uuden tuotteen
addProductForm.addEventListener('submit', addProductHandler);

// Lisää kuvan esikatselu
function setupImagePreview(): void {
  const imageInput = document.getElementById(
    'product-image'
  ) as HTMLInputElement;
  const currentImageEl = document.getElementById(
    'current-image'
  ) as HTMLImageElement;

  if (imageInput && currentImageEl) {
    imageInput.addEventListener('change', () => {
      const file = imageInput.files && imageInput.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          if (e.target && typeof e.target.result === 'string') {
            currentImageEl.setAttribute('src', e.target.result);
            currentImageEl.style.display = 'block';
          }
        };
        reader.readAsDataURL(file);
      } else {
        currentImageEl.removeAttribute('src');
        currentImageEl.style.display = 'none';
      }
    });
  }
}

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
  const popular = (
    document.getElementById('product-popular') as HTMLInputElement
  ).checked;
  const dietaryInfo = (
    document.getElementById('product-dietary-info') as HTMLInputElement
  ).value; // Lisätty

  const imageInput = document.getElementById(
    'product-image'
  ) as HTMLInputElement;
  const existingImageUrlInput = document.getElementById(
    'existing-image-url'
  ) as HTMLInputElement;
  let image_url = existingImageUrlInput.value; // Ota nykyinen kuva URL

  const token = localStorage.getItem('token');
  if (!token) {
    showToast(
      'Sinun täytyy kirjautua sisään lisätäksesi tuotteita.',
      'warning'
    );
    window.location.href = '/login.html';
    return;
  }

  // Tarkista, onko käyttäjä valinnut uuden kuvan
  if (imageInput.files && imageInput.files.length > 0) {
    const file = imageInput.files[0];
    const formData = new FormData();
    formData.append('image', file);

    try {
      // Lataa kuva
      const uploadResponse = await fetch('/api/upload/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        showToast('Virhe kuvan lataamisessa: ' + errorData.message, 'danger');
        return;
      }

      const {imageUrl} = await uploadResponse.json();
      image_url = imageUrl; // Päivitä kuvan URL
    } catch (error) {
      console.error('Virhe kuvan lataamisessa:', error);
      showToast('Virhe kuvan lataamisessa.', 'danger');
      return;
    }
  }

  try {
    // Lisää tuote
    const response = await fetch('/api/admin/menu', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
        description,
        price,
        category,
        image_url,
        popular,
        dietary_info: dietaryInfo,
      }),
    });

    if (response.ok) {
      showToast('Ruokalistan kohde lisätty onnistuneesti!', 'success');
      addProductForm.reset();
      const currentImageEl = document.getElementById(
        'current-image'
      ) as HTMLImageElement;
      if (currentImageEl) {
        currentImageEl.src = '';
        currentImageEl.style.display = 'none';
      }
      fetchMenuItems();
    } else {
      const errorData = await response.json();
      showToast(
        'Virhe lisättäessä ruokalistan kohdetta: ' + errorData.message,
        'danger'
      );
    }
  } catch (error) {
    console.error('Virhe lisättäessä tuotetta:', error);
    showToast('Tuntematon virhe lisättäessä tuotetta.', 'danger');
  }
}

// Renderöi tuotelista taulukkoon
async function fetchMenuItems(): Promise<void> {
  const token = localStorage.getItem('token');

  try {
    const response = await fetch('/api/admin/menu', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const menuItems: MenuItem[] = await response.json();
      renderProductTable(menuItems);
      showToast('Ruokalista ladattu onnistuneesti!', 'success');
    } else {
      if (response.status === 401 || response.status === 403) {
        showToast('Autentikointi epäonnistui. Kirjaudu uudelleen.', 'warning');
        setTimeout(() => {
          window.location.href = '/login.html';
        }, 1500);
        return;
      }
      const errorData = await response.json();
      showToast(
        'Virhe haettaessa ruokalistan kohteita: ' + errorData.message,
        'danger'
      );
    }
  } catch (error) {
    console.error('Virhe haettaessa ruokalistan kohteita:', error);
    showToast('Virhe haettaessa ruokalistan kohteita.', 'danger');
  }
}

function renderProductTable(menuItems: MenuItem[]): void {
  productTableBody.innerHTML = '';

  menuItems.forEach((item) => {
    const row = document.createElement('tr');

    row.innerHTML = `
    <td>${item.name}</td>
    <td>${item.description}</td>
    <td>${Number(item.price).toFixed(2)}</td>
    <td>${item.category}</td>
    <td>${item.dietary_info || '-'}</td>
    <td>
      ${
        item.image_url
          ? `<img src="${item.image_url}" alt="${item.name}" width="50">`
          : 'Ei kuvaa'
      }
    </td>
    <td>
      <button class="btn btn-sm ${
        item.popular ? 'btn-success' : 'btn-secondary'
      } toggle-popular-button" data-id="${item.item_id}">
        ${item.popular ? 'Poista suosikeista' : 'Lisää suosikkeihin'}
      </button>
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

  const editButtons = document.querySelectorAll('.edit-button');
  const deleteButtons = document.querySelectorAll('.delete-button');
  const togglePopularButtons = document.querySelectorAll(
    '.toggle-popular-button'
  );

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

  togglePopularButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const id = button.getAttribute('data-id');
      togglePopularStatus(id);
    });
  });
}

// Poista tuote
async function deleteMenuItem(id: string | null): Promise<void> {
  if (!id) return;

  if (!confirm('Haluatko varmasti poistaa tämän tuotteen?')) return;

  const token = localStorage.getItem('token');

  try {
    const response = await fetch(`/api/admin/menu/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      showToast('Ruokalistan kohde poistettu.', 'success');
      fetchMenuItems();
    } else {
      const errorData = await response.json();
      showToast(
        'Virhe poistettaessa ruokalistan kohdetta: ' + errorData.message,
        'danger'
      );
    }
  } catch (error) {
    console.error('Virhe poistettaessa ruokalistan kohdetta:', error);
    showToast('Virhe poistettaessa ruokalistan kohdetta.', 'danger');
  }
}

async function editMenuItem(id: string | null): Promise<void> {
  if (!id) return;

  const token = localStorage.getItem('token');

  try {
    const response = await fetch(`/api/menu/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const item: MenuItem = await response.json();

      (document.getElementById('product-name') as HTMLInputElement).value =
        item.name;
      (
        document.getElementById('product-description') as HTMLInputElement
      ).value = item.description;
      (document.getElementById('product-price') as HTMLInputElement).value =
        item.price.toString();
      (document.getElementById('product-category') as HTMLSelectElement).value =
        item.category;
      (
        document.getElementById('product-dietary-info') as HTMLInputElement
      ).value = item.dietary_info || ''; // Lisätty

      // Näytä nykyinen kuva
      const currentImageEl = document.getElementById(
        'current-image'
      ) as HTMLImageElement;
      if (currentImageEl) {
        currentImageEl.src = item.image_url;
        currentImageEl.style.display = 'block';
      }

      // Tallenna nykyinen kuva URL piilotettuun kenttään
      const existingImageUrlEl = document.getElementById(
        'existing-image-url'
      ) as HTMLInputElement;
      if (existingImageUrlEl) {
        existingImageUrlEl.value = item.image_url;
      }

      (document.getElementById('product-popular') as HTMLInputElement).checked =
        item.popular;

      // Muokkaa lomakkeen lähettämistä päivitykseen
      addProductForm.removeEventListener('submit', addProductHandler);
      const updateHandler = async (e: Event) => {
        e.preventDefault();
        await updateProductHandler(id);
        addProductForm.removeEventListener('submit', updateHandler);
        addProductForm.addEventListener('submit', addProductHandler);
        const submitButton = addProductForm.querySelector(
          'button[type="submit"]'
        ) as HTMLButtonElement;
        submitButton.textContent = 'Lisää tuote';
        addProductForm.reset();
        const currentImageEl = document.getElementById(
          'current-image'
        ) as HTMLImageElement;
        if (currentImageEl) {
          currentImageEl.src = '';
          currentImageEl.style.display = 'none';
        }
      };
      addProductForm.addEventListener('submit', updateHandler);

      const submitButton = addProductForm.querySelector(
        'button[type="submit"]'
      ) as HTMLButtonElement;
      submitButton.textContent = 'Päivitä tuote';
    } else {
      const errorData = await response.json();
      showToast(
        'Virhe haettaessa ruokalistan kohdetta: ' + errorData.message,
        'danger'
      );
    }
  } catch (error) {
    console.error('Virhe haettaessa ruokalistan kohdetta:', error);
    showToast('Virhe haettaessa ruokalistan kohdetta.', 'danger');
  }
}

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
  const popular = (
    document.getElementById('product-popular') as HTMLInputElement
  ).checked;
  const dietaryInfo = (
    document.getElementById('product-dietary-info') as HTMLInputElement
  ).value;

  // Get existing image URL
  const existingImageUrl = (
    document.getElementById('existing-image-url') as HTMLInputElement
  ).value;
  const imageInput = document.getElementById(
    'product-image'
  ) as HTMLInputElement;

  let image_url = existingImageUrl; // Default to existing image

  // Only handle new image if one was selected
  if (imageInput.files && imageInput.files.length > 0) {
    const file = imageInput.files[0];
    const formData = new FormData();
    formData.append('image', file);

    try {
      const uploadResponse = await fetch('/api/upload/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        showToast('Virhe kuvan lataamisessa: ' + errorData.message, 'danger');
        return;
      }

      const {imageUrl} = await uploadResponse.json();
      image_url = imageUrl; // Only update image_url if upload successful
    } catch (error) {
      console.error('Virhe kuvan lataamisessa:', error);
      showToast('Virhe kuvan lataamisessa.', 'danger');
      return;
    }
  }

  const token = localStorage.getItem('token');

  try {
    const response = await fetch(`/api/admin/menu/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
        description,
        price,
        category,
        image_url,
        popular,
        dietary_info: dietaryInfo,
      }),
    });

    if (response.ok) {
      showToast('Ruokalistan kohteen tiedot päivitetty.', 'success');
      addProductForm.reset();
      const currentImageEl = document.getElementById(
        'current-image'
      ) as HTMLImageElement;
      if (currentImageEl) {
        currentImageEl.src = '';
        currentImageEl.style.display = 'none';
      }
      fetchMenuItems();
    } else {
      const errorData = await response.json();
      showToast(
        'Virhe päivittäessä ruokalistan kohdetta: ' + errorData.message,
        'danger'
      );
    }
  } catch (error) {
    console.error('Virhe päivittäessä ruokalistan kohdetta:', error);
    showToast('Virhe päivittäessä ruokalistan kohdetta.', 'danger');
  }
}

async function togglePopularStatus(id: string | null): Promise<void> {
  if (!id) return;

  const token = localStorage.getItem('token');

  try {
    const response = await fetch(`/api/menu/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const item: MenuItem = await response.json();
      const updatedItem = {...item, popular: !item.popular};

      const updateResponse = await fetch(`/api/admin/menu/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedItem),
      });

      if (updateResponse.ok) {
        showToast('Tuotteen suosikkistatusta päivitetty.', 'success');
        fetchMenuItems();
      } else {
        const errorData = await updateResponse.json();
        showToast(
          'Virhe päivittäessä ruokalistan kohdetta: ' + errorData.message,
          'danger'
        );
      }
    } else {
      const errorData = await response.json();
      showToast(
        'Virhe haettaessa ruokalistan kohdetta: ' + errorData.message,
        'danger'
      );
    }
  } catch (error) {
    console.error('Virhe popular-statuksen päivittämisessä:', error);
    showToast('Virhe popular-statuksen päivittämisessä.', 'danger');
  }
}

export {};
