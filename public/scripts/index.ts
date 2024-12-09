// public/scripts/index.ts

// Ruokalistan kohteen rajapinta
interface MenuItem {
  item_id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  popular: boolean; // Onko tämä tuote niin suosittu, että se saa hitti-ilmiön?
  dietary_info?: string;
}

const suositutTuotteetContainer = document.getElementById(
  'suositut-tuotteet-container'
);

// Importoi setupAddToCartButtons-funktio
import {setupAddToCartButtons} from './addToCart.js';

async function fetchPopularProducts() {
  try {
    // Yritetään hakea ruokalista backendistä
    const response = await fetch('/api/menu');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const menuItems: MenuItem[] = await response.json();

    // Suodatetaan suositut tuotteet
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
        <div class="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-4">
    `;

    slideItems.forEach((item) => {
      const price =
        typeof item.price === 'string' ? parseFloat(item.price) : item.price;

      slideHtml += `
        <div class="col">
          <div class="card h-100 text-center shadow-sm">
            <img
              src="${item.image_url}"
              class="card-img-top product-image"
              alt="${item.name}"
            />
            <div class="card-body d-flex flex-column">
              <h3 class="card-title">${item.name}</h3>
              <p class="card-text flex-grow-1">${item.description}</p>
              ${
                item.dietary_info
                  ? `<p class="card-text"><small class="text-muted"><i class="fas fa-leaf"></i> ${item.dietary_info}</small></p>`
                  : ''
              }
              <p class="card-text">Hinta: ${price.toFixed(2)}€</p>
            </div>
            <div class="card-footer">
              <button
                class="btn btn-success w-100 add-to-cart"
                data-product="${item.name}"
                data-price="${price}"
              >
                <i class="fas fa-cart-plus"></i> Lisää ostoskoriin
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

  // Aseta tapahtumankuuntelijat uusille "Lisää ostoskoriin" -napeille
  setupAddToCartButtons();
}

fetchPopularProducts();

export {};
