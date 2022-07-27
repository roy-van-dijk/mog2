const productList = document.querySelector(".products");
const productTemplate = document.querySelector(".product");
const typeButtonList = document.querySelector(".buttons");
const typeButtonTemplate = document.querySelector(".type");
const search = document.querySelector(".search");
const darkMode = document.querySelector("#dark-mode");
const currencySelector = document.querySelector(".currency-selector");
const root = document.querySelector(":root");
const menu = document.querySelector(".menu");
const nav = document.querySelector("nav");
let selectedCurrency = "eur";
let navOpen = false;
const basePageUrl =
  "https://store.finalfantasyxiv.com/ffxivstore/en-gb/product/";
let response = {};
let items = {
  new: [],
  sale: [],
  all: [],
  outfit: [],
  emote: [],
  boost: [],
  mount: [],
  minion: [],
  roll: [],
  dye: [],
  other: [],
};

const setProducts = (products) => {
  closeNav();
  productList.classList.remove("empty");
  productList.innerHTML = "";
  products.forEach((product) => {
    let element = productTemplate.content.cloneNode(true);
    element.querySelector(".image").src = product.thumbnailUrl;
    element.querySelector(".name").innerText = product.name;
    element.querySelector(".link").href = basePageUrl + product.id;
    element.querySelector(".normal-price").innerText = product.priceText;
    element.querySelector(".sale-price").innerText = product.salePriceText;

    if (product.topLeftIcon === "sale") {
      element.querySelector(".product-item").classList.add("sale");
    }
    productList.appendChild(element);
  });
  window.scrollTo(0, 0);
  if (productList.children.length === 0) {
    productList.classList.add("empty");
    productList.innerHTML = "<li>No results found.</li>";
  }
};

const sortProducts = (products) => {
  Object.keys(items).forEach((item) => (items[item] = []));
  products.forEach((product) => {
    items.all.push(product);
    if (
      includes(product, "attire") ||
      includes(product, "uniform") ||
      includes(product, "lord's") ||
      includes(product, "lady's") ||
      includes(product, "men's") ||
      includes(product, "women's") ||
      includes(product, "for men") ||
      includes(product, "for women") ||
      includes(product, " suit") ||
      includes(product, " garments") ||
      includes(product, " robe") ||
      includes(product, "slippers") ||
      includes(product, "earrings") ||
      includes(product, "pendant") ||
      includes(product, "choker") ||
      includes(product, " cap") ||
      includes(product, " mask") ||
      includes(product, " happi") ||
      includes(product, " tabi") ||
      includes(product, "southern seas ") ||
      includes(product, " ring")
    ) {
      items.outfit.push(product);
    } else if (includes(product, "mount:")) {
      items.mount.push(product);
    } else if (includes(product, "orchestrion roll")) {
      items.roll.push(product);
    } else if (includes(product, "minion:")) {
      items.minion.push(product);
    } else if (includes(product, "emote:")) {
      items.emote.push(product);
    } else if (includes(product, "tales of adventure:")) {
      items.boost.push(product);
    } else if (includes(product, "pots of") || includes(product, "pot of")) {
      items.dye.push(product);
    } else {
      items.other.push(product);
    }

    if (product.topLeftIcon === "sale") {
      items.sale.push(product);
    }
    if (product.topLeftIcon === "new") {
      items.new.push(product);
    }
  });
};

const includes = (product, keyword) => {
  return product.name.toLowerCase().includes(keyword);
};

const addTypeButtons = () => {
  typeButtonList.innerHTML = "";
  for (const [k, v] of Object.entries(items)) {
    let element = typeButtonTemplate.content.cloneNode(true);
    let button = element.querySelector(".type-button");
    button.innerText = k;
    button.dataset.type = k;
    if (k === "sale" || k === "new") {
      button.classList.add("special");
      button.append(` (${v.length})`);
    }
    if (k === "all") {
      button.classList.add("active");
    }

    if (k === "sale" && items.sale.length === 0) {
      continue;
    }

    if (k === "new" && items.new.length === 0) {
      continue;
    }

    typeButtonList.appendChild(element);
  }

  let buttons = document.querySelectorAll(".type-button");
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      setProducts(items[button.dataset.type]);
      buttons.forEach((b) => b.classList.remove("active"));
      button.classList.add("active");
      search.value = "";
    });
  });
};

const debounce = (func, wait) => {
  let timeout;

  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const refreshApiResponse = async () => {
  const apiResponse = await fetch(
    `./js/responses/response-${selectedCurrency}.json`
  );
  const data = await apiResponse.json();
  response = data;
};

const searchFunction = debounce(function (e) {
  let tempProducts = response.products.filter((product) =>
    includes(product, e.target.value.toLowerCase())
  );
  setProducts(tempProducts);
  document
    .querySelectorAll(".buttons .type-button")
    .forEach((b) => b.classList.remove("active"));
}, 250);

const setDarkMode = (mode) => {
  closeNav();
  localStorage.setItem("darkMode", mode);
  darkMode.checked = mode;

  if (mode) {
    root.style.setProperty("--bg", "#232323");
    root.style.setProperty("--bg2", "#323232");
    root.style.setProperty("--color", "#ffffff");
    root.style.setProperty("--bgi", "#ffffff");
  } else {
    root.style.setProperty("--bg", "#ffffff");
    root.style.setProperty("--bg2", "#f7f9fa");
    root.style.setProperty("--color", "#737b80");
    root.style.setProperty("--bgi", "#232323");
  }
};

const setCurrency = async (currency) => {
  closeNav();
  if (currency === null) {
    currency = selectedCurrency;
  }

  localStorage.setItem("currency", currency);
  currencySelector.value = currency;
  selectedCurrency = currency;
  await refreshApiResponse();
  setProducts(response.products);
  addTypeButtons();
  sortProducts(response.products);
};

const toggleNav = () => {
  navOpen ? nav.classList.remove("open") : nav.classList.add("open");
  navOpen = !navOpen;
};

const closeNav = () => {
  navOpen = false;
  nav.classList.remove("open");
};

const main = () => {
  sortProducts(response.products);
  addTypeButtons();
};

const storedDarkMode = JSON.parse(localStorage.getItem("darkMode"));
setDarkMode(storedDarkMode);

const storedCurrency = localStorage.getItem("currency");
setCurrency(storedCurrency);

search.addEventListener("keyup", (e) => searchFunction(e));
darkMode.addEventListener("change", (e) => setDarkMode(e.target.checked));
currencySelector.addEventListener("change", (e) => setCurrency(e.target.value));
menu.addEventListener("click", () => toggleNav());

(async () => {
  await refreshApiResponse();
  main();
})();
