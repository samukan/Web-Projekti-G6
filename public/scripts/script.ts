// public/scripts/script.ts
// En tiiä mitä tällä tiedostolla enää tekää ku toiminallisuus jaettu useampaan tiedostoon. Tässä on kuitenkin teemakytkin ja ostoskorin päivitys.

// Bootstrap jutut on vähän mystisiä, joten ne pitää vaan hyväksyä näin.
declare const bootstrap: any; // Jos tän poistaa niin tulee erroria tai ehkä ei
import {
  setupAddToCartButtons,
  updateCartModal,
  updateCartCount,
  clearCart,
} from './cart.js';

// Teemakytkin, TÄÄ ON TÄRKEE. EI SAA RIKKOA.
const themeToggleBtn = document.getElementById(
  'theme-toggle'
) as HTMLButtonElement | null;

if (themeToggleBtn) {
  // Tarkistetaan tallennettu teema localStoragesta
  const currentTheme = localStorage.getItem('theme');

  if (currentTheme === 'dark') {
    document.body.classList.add('dark-theme');
  }

  themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    let theme = 'light';
    if (document.body.classList.contains('dark-theme')) {
      theme = 'dark';
    }
    localStorage.setItem('theme', theme);
  });
}

// Kun sivu latautuu
document.addEventListener('DOMContentLoaded', () => {
  // Päivitä ostoskori
  updateCartModal();
  updateCartCount();

  // Aseta "Lisää ostoskoriin" -napit, jos niitä on sivulla
  if (document.querySelectorAll('.add-to-cart').length > 0) {
    setupAddToCartButtons();
  }

  // Liitä tapahtumakuuntelija 'Tyhjennä ostoskori' -painikkeelle
  const clearCartButton = document.getElementById('clear-cart');
  if (clearCartButton) {
    clearCartButton.addEventListener('click', () => {
      clearCart();
    });
  }
});
