const baseUrl = "https://ecommercebackend.fundamentos-29.repl.co/";
const carToggle = document.querySelector('.car__toggle');
const carBlock = document.querySelector('.car__block');
const productsList = document.querySelector('#products-container');
const car = document.querySelector('#car');
const carList = document.querySelector('#car__list');
emptyCarButton = document.querySelector('#empty__cart')
let carProducts = [];
const modalContainer = document.querySelector('#modal-container');
const modalElement = document.querySelector('#modal');
let modalDetails = [];
carToggle.addEventListener('click', () => {
  carBlock.classList.toggle("nav__car__visible")
})
eventListenersLoader()
function eventListenersLoader() {
  productsList.addEventListener('click', addProduct)
  car.addEventListener('click', deleteProduct)
  emptyCarButton.addEventListener('click', emptyCar)
  document.addEventListener('DOMContentLoaded', () => {
    carProducts = JSON.parse(localStorage.getItem('cart')) || [];
    carElementsHTML();
  })
  productsList.addEventListener('click', modalProduct);
  modalContainer.addEventListener('click', closeModal);
}
function getProducts() {
  axios.get(baseUrl)
    .then(function (response){
      const products = response.data
      printProducts(products)
    })
    .catch(function(error){
      console.log(error)
    })
}
getProducts()
function printProducts(products){
  let html = '';
  for(let i = 0; i < products.length; i++){
    html += `
    <div class='product__container'>
      <div class='product__container__img'>
        <img src="${products[i].image}" alt="image">
      </div>
      <div class="product__container__name">
        <p>${products[i].name}</p>
      </div>
      <div class="product__container__price">
        <p>$ ${products[i].price.toFixed(2)}</p>
      </div>
      <div class="product__container__button">
        <button class="car__button add__to__car" id="add__to__car" data-id="${products[i].id}">Add to car</button>
        <button class="product__details" data-id="${products[i].id}">View Details</button>
      </div>
    </div>
    `
  }
  productsList.innerHTML = html
}
function addProduct(event){
  if(event.target.classList.contains('add__to__car')){
    const product = event.target.parentElement.parentElement
    carProductsElements(product)
  }
}
function carProductsElements(product){
  const infoProduct = {
    id: product.querySelector('button').getAttribute('data-id'),
    image: product.querySelector('img').src,
    name: product.querySelector('.product__container__name p').textContent,
    price: product.querySelector('.product__container__price p').textContent,
    quantity: 1
  }
  if(carProducts.some(product => product.id === infoProduct.id)){
    const product = carProducts.map(product => {
      if(product.id === infoProduct.id){
        product.quantity ++;
        return product;
      } else {
        return product;
      }
    })
    carProducts = [...product]
  } else {
    carProducts = [...carProducts, infoProduct]
  }
  console.log(carProducts)
  carElementsHTML()
}
function carElementsHTML(){
  carList.innerHTML = "";
  carProducts.forEach(product => {
    const div = document.createElement('div');
    div.innerHTML = `
      <div class="car__product">
        <div class="car__product__image">
          <img src="${product.image}">
        </div>
        <div class="car__product__description">
          <p>${product.name}</p>
          <p>Precio: ${product.price}</p>
          <p>Cantidad: ${product.quantity}</p>
        </div>
        <div class="car__product__button">
          <button class="delete__product" data-id="${product.id}">
            Delete
          </button>
        </div>
      </div>
      <hr>
    `;
    carList.appendChild(div);
  })
  productsStorage()
}
function productsStorage() {
  localStorage.setItem('cart', JSON.stringify(carProducts))
}
function deleteProduct(event){
  if(event.target.classList.contains('delete__product')){
    const productId = event.target.getAttribute('data-id')
    carProducts = carProducts.filter(product => product.id !== productId)
    carElementsHTML()
  }
}
function emptyCar() {
  carProducts = [];
  carElementsHTML();
}
function modalProduct(event){
  if(event.target.classList.contains('product__details')){
    modalContainer.classList.add('show__modal')
    const product = event.target.parentElement.parentElement
    modalDetailsElement(product)
  }
}
function closeModal(event){
  if(event.target.classList.contains('icon__modal')){
    modalContainer.classList.remove('show__modal')
    modalElement.innerHTML = "";
    modalDetails = []
  }
}
function modalDetailsElement(product){
  const infoDetails = [{
    id: product.querySelector('button').getAttribute('data-id'),
    image: product.querySelector('img').src,
    name: product.querySelector('.product__container__name p').textContent,
    price: product.querySelector('.product__container__price p').textContent,
  }]
  modalDetails = [...infoDetails]
  modalElementHTML();
}
function modalElementHTML() {
let DetailsHTML = "";
for(let detail of modalDetails){
  DetailsHTML += `
    <div class="details_product">
      <div class="description">
        <div class="description1">
          <p>${detail.name}</p>
          <p>${detail.price}</p>
        </div>
        <div class="description_img1">
          <p>Colores</p>
          <div>
            <img src="${detail.image}">
          </div>
        </div>
        <div class="sizes">
          <div>
            <p>Tallas</p>
          </div>
        </div>
        <div class="first__sizes">
          <div>
            <p>S</p>
          </div>
          <div>
            <p>M</p>
          </div>
          <div>
            <p>L</p>
          </div>
          <div>
            <p>XL</p>
          </div>
          <div>
            <p>2XL</p>
          </div>
          <div>
            <p>3XL</p>
          </div>
        </div>
      </div>
      <div class="description_img2">
        <div class="modal__vector"></div>
        <img src="${detail.image}">
      </div>
    </div>
  `;
}
modalElement.innerHTML = DetailsHTML;
}
