// public/scripts/script.ts
// En tiiä mitä tällä tiedostolla enää tekää ku toiminallisuus jaettu useampaan tiedostoon. Tässä on kuitenkin teemakytkin ja ostoskorin päivitys.

// kukaan ei jaksa koodata kaikkea samassa tiedostossa joten import
declare const bootstrap: any;
import {setupAddToCartButtons, updateCartModal} from './cart.js';

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

  // Aseta "Lisää ostoskoriin" -napit, jos niitä on sivulla
  if (document.querySelectorAll('.add-to-cart').length > 0) {
    setupAddToCartButtons();
  }
});
