const productList = document.querySelector('.products');
const productTemplate = document.querySelector('.product');
const typeButtonList = document.querySelector('.buttons');
const typeButtonTemplate = document.querySelector('.type');
const search = document.querySelector('.search');
const darkMode = document.querySelector('#dark-mode');
const root = document.querySelector(':root');
const menu = document.querySelector('.menu');
const nav = document.querySelector('nav');
let navOpen = false;
const basePageUrl = 'https://store.finalfantasyxiv.com/ffxivstore/en-gb/product/';
let items = {
    all: [],
    outfit: [],
    mount: [],
    minion: [],
    emote: [],
    boost: [],
    roll: [],
    dye: [],
    other: [],
};

const setProducts = (products) => {
    closeNav();
    productList.innerHTML = '';
    products.forEach(product => {
        let element = productTemplate.content.cloneNode(true);
        element.querySelector('.image').src = product.thumbnailUrl;
        element.querySelector('.name').innerText = product.name;
        element.querySelector('.link').href = basePageUrl + product.id;
        element.querySelector('.price').innerText = product.priceText;
        productList.appendChild(element);
    });
}

const sortProducts = (products) => {
    products.forEach(product => {
        items.all.push(product);
        if(includes(product, 'attire') 
            || includes(product, 'uniform') 
            || includes(product, 'lord\'s')
            || includes(product, 'lady\'s')
            || includes(product, 'for men')
            || includes(product, 'for women')) {
            items.outfit.push(product);
        } else if(includes(product, 'mount:')) {
            items.mount.push(product);
        } else if (includes(product, 'orchestrion roll')){
            items.roll.push(product);
        } else if (includes(product, 'minion:')) {
            items.minion.push(product);
        } else if (includes(product, 'emote:')) {
            items.emote.push(product);
        } else if (includes(product, 'tales of adventure:')) {
            items.boost.push(product)
        } else if(includes(product, 'pots of') || includes(product, 'pot of')) {
            items.dye.push(product);
        } else {
            items.other.push(product);
        }
    });
    // console.log(items);
}

const includes = (product, keyword) => {
    return product.name.toLowerCase().includes(keyword);
}

const addTypeButtons = () => {
    for(const [k, v] of Object.entries(items)) {
        let element = typeButtonTemplate.content.cloneNode(true);
        let button = element.querySelector('.type-button');
        button.innerText = k;
        button.addEventListener('click', () => setProducts(items[k]));
        typeButtonList.appendChild(element);
    }
}

const debounce = (func, wait) => {
    let timeout;
  
    return function executedFunction(...args) {
        const later = () => {
        clearTimeout(timeout);
        func(...args);
        };

        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    }
}

const searchFunction = debounce(function(e) {
    let tempProducts = response.products.filter(product => includes(product, e.target.value));
    setProducts(tempProducts);
}, 250);

const setDarkMode = (mode) => {
    closeNav();
    localStorage.setItem('darkMode', mode);
    darkMode.checked = mode;
    
    if (mode) {
        root.style.setProperty('--bg', '#232323');
        root.style.setProperty('--bg2', '#323232');
        root.style.setProperty('--color', '#ffffff');
        root.style.setProperty('--bgi', '#ffffff');
    } else {
        root.style.setProperty('--bg', '#ffffff');
        root.style.setProperty('--bg2', '#f7f9fa');
        root.style.setProperty('--color', '#737b80');
        root.style.setProperty('--bgi', '#232323');
    }
}

const toggleNav = () => {
    navOpen = !navOpen;
    navOpen ? nav.classList.remove('open') : nav.classList.add('open');
}

const closeNav = () => {
    navOpen = false;
    nav.classList.remove('open');
}

const storedDarkMode = JSON.parse(localStorage.getItem('darkMode'));
setDarkMode(storedDarkMode);

search.addEventListener('keyup', (e) => searchFunction(e));
darkMode.addEventListener('change', (e) => setDarkMode(e.target.checked));
menu.addEventListener('click', () => toggleNav());

addTypeButtons();
sortProducts(response.products);
setProducts(response.products);
