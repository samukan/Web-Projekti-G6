// Hae modaali-elementit
var loginModal = document.getElementById("login-modal");
var cartModal = document.getElementById("cart-modal");

// Hae napit, jotka avaavat modalit
var loginBtn = document.getElementById("login-btn");
var cartBtn = document.getElementById("cart-btn");

// Hae elementit, jotka sulkevat modalit
var closeLogin = document.getElementById("close-login");
var closeCart = document.getElementById("close-cart");

//Hakee teema ikonit
var themeIcon = document.querySelector(".theme-icon");

// Avaa 'Kirjaudu sisään' -modaali kun nappia painetaan
loginBtn.onclick = function (e) {
  e.preventDefault();
  loginModal.style.display = "block";
};

// Avaa 'Ostoskori' -modaali kun nappia painetaan
cartBtn.onclick = function (e) {
  e.preventDefault();
  cartModal.style.display = "block";
};

// Sulje 'Kirjaudu sisään' -modaali kun X-painiketta painetaan
closeLogin.onclick = function () {
  loginModal.style.display = "none";
};

// Sulje 'Ostoskori' -modaali kun X-painiketta painetaan
closeCart.onclick = function () {
  cartModal.style.display = "none";
};

// Sulje modaali kun käyttäjä klikkaa modalin ulkopuolelle
window.onclick = function (event) {
  if (event.target == loginModal) {
    loginModal.style.display = "none";
  }
  if (event.target == cartModal) {
    cartModal.style.display = "none";
  }
};

// Teema-kytkin
const themeToggleButton = document.getElementById("theme-toggle");
const savedTheme = localStorage.getItem("theme");

// Jos teemaa on tallennettu localStorageen, käytetään sitä
if (savedTheme) {
  document.body.classList.remove("light-theme", "dark-theme");
  document.body.classList.add(savedTheme);
  themeToggleButton.checked = savedTheme === "dark-theme";
} else {
  // Oletusteema on vaalea
  document.body.classList.add("light-theme");
}

// Teeman vaihtaminen
themeToggleButton.addEventListener("change", () => {
  if (themeToggleButton.checked) {
    document.body.classList.remove("light-theme");
    document.body.classList.add("dark-theme");
    localStorage.setItem("theme", "dark-theme");
  } else {
    document.body.classList.remove("dark-theme");
    document.body.classList.add("light-theme");
    localStorage.setItem("theme", "light-theme");
  }
});

// Tapahtumankuuntelija ikonille
themeIcon.addEventListener("click", function () {
  themeToggle.checked = !themeToggle.checked;
  themeToggle.dispatchEvent(new Event("change"));
});
