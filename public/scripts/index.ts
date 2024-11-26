// public/scripts/index.ts

import {setupAddToCartButtons} from './cart.js';

// Ruokalistan kohteen rajapinta koska meidän täytyy tietää mitä backend haluaa
interface MenuItem {
  item_id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  popular: boolean; // Onko tämä tuote niin suosittu, että se saa hitti-ilmiön?
}

const suositutTuotteetContainer = document.getElementById(
  'suositut-tuotteet-container'
);

async function fetchPopularProducts() {
  try {
    // Yritetään hakea ruokalista backendistä ja rukoillaan että serveri herää
    const response = await fetch('/api/menu');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const menuItems: MenuItem[] = await response.json();

    // Suodatetaan suositut tuotteet.
    const popularItems = menuItems.filter((item) => item.popular);

    displayPopularProducts(popularItems);
  } catch (error) {
    console.error('Virhe haettaessa suosituksia:', error);
    if (suositutTuotteetContainer) {
      suositutTuotteetContainer.innerHTML =
        '<p>Suositusten lataaminen epäonnistui.</p>';
    }
  }
}

function displayPopularProducts(popularItems: MenuItem[]) {
  if (!suositutTuotteetContainer) return; // Jos kenttiä ei lyödy niin tästä tulee surullinen

  const itemsPerSlide = 4; // Tuotteiden määrä per slaidi
  const slides: MenuItem[][] = [];

  for (let i = 0; i < popularItems.length; i += itemsPerSlide) {
    slides.push(popularItems.slice(i, i + itemsPerSlide));
  }

  let carouselInnerHtml = '';

  slides.forEach((slideItems, index) => {
    let slideHtml = `
      <div class="carousel-item${index === 0 ? ' active' : ''}">
        <div class="row row-cols-1 row-cols-md-4 g-4">
    `;

    slideItems.forEach((item) => {
      // Varmistetaan, että price on numero ennen toFixed-kutsua ettei tuu "Hinta: NaN€"
      const price =
        typeof item.price === 'string' ? parseFloat(item.price) : item.price;

      slideHtml += `
        <div class="col">
          <div class="card h-100 text-center shadow-sm">
            <img
              src="${item.image_url}"
              class="card-img-top"
              alt="${item.name}"
            />
            <div class="card-body">
              <h5 class="card-title">${item.name}</h5>
              <p class="card-text">${item.description}</p>
              <p class="card-text">Hinta: ${price.toFixed(2)}€</p>
            </div>
            <div class="card-footer">
              <button
                class="btn btn-success w-100 add-to-cart"
                data-product="${item.name}"
                data-price="${price}"
              >
                Lisää ostoskoriin
              </button>
            </div>
          </div>
        </div>
      `;
    });

    slideHtml += `
        </div>
      </div>
    `;

    carouselInnerHtml += slideHtml;
  });

  const carouselHtml = `
    <!-- Bootstrap Carousel -->
    <div
      id="suositutTuotteetCarousel"
      class="carousel slide"
      data-bs-ride="carousel"
      data-bs-interval="8000"
    >
      <div class="carousel-inner">
        ${carouselInnerHtml}
      </div>

      <!-- Carousel controls -->
      <button
        class="carousel-control-prev"
        type="button"
        data-bs-target="#suositutTuotteetCarousel"
        data-bs-slide="prev"
      >
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Edellinen</span>
      </button>
      <button
        class="carousel-control-next"
        type="button"
        data-bs-target="#suositutTuotteetCarousel"
        data-bs-slide="next"
      >
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Seuraava</span>
      </button>
    </div>
  `;

  suositutTuotteetContainer.innerHTML = carouselHtml;

  // Lisää event listenerit
  setupAddToCartButtons();
}

fetchPopularProducts();
