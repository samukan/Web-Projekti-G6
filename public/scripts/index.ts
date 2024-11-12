// public/scripts/index.ts

import {setupAddToCartButtons} from './cart.js';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  popular: boolean;
}

const suositutTuotteetContainer = document.getElementById(
  'suositut-tuotteet-container'
);

async function fetchPopularProducts() {
  try {
    const response = await fetch('/api/menu');
    const menuItems: MenuItem[] = await response.json();

    // Suodatetaan suositut tuotteet (En tiedä miten tämä toimii, ei varmaan toimi)
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
  if (!suositutTuotteetContainer) return;

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
      slideHtml += `
        <div class="col">
          <div class="card h-100 text-center shadow-sm">
            <img
              src="${item.image}"
              class="card-img-top"
              alt="${item.name}"
            />
            <div class="card-body">
              <h5 class="card-title">${item.name}</h5>
              <p class="card-text">Hinta: ${item.price.toFixed(2)}€</p>
            </div>
            <div class="card-footer">
              <button
                class="btn btn-success w-100 add-to-cart"
                data-product="${item.name}"
                data-price="${item.price}"
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
