import { productsData } from "./productsdata.js";
const productsDom = document.querySelector(".products-center");
const carttotal = document.querySelector(".cart-total");
const cartitem = document.querySelector(".cart-items");
const cartcontent = document.querySelector(".cart-content");
const clearcart = document.querySelector(".clear-cart");
class Products {
  getproducts() {
    return productsData;
  }
}
let cart = [];
let buttonsDom = [];
class UI {
  //!show products and add dom
  displayProducts(products) {
    let result = "";
    products.forEach((item) => {
      result += `<div class="product">
    <div class="img-container">
      <img src=${item.imgurl} class="product-img" />
    </div>
    <div class="product-desc">
      <p class="product-price">${item.price}</p>
      <p class="product-title">$ ${item.title}</p>
    </div>
    <button class="btn add-to-cart" data-id=${item.id}>
      add to cart
    </button>
  </div>
    `;
      productsDom.innerHTML = result;
    });
  }

  //*check product exist in cart orNO
  getAddtocartBtns() {
    const addtocartBtns = [...document.querySelectorAll(".add-to-cart")];

    buttonsDom = addtocartBtns;
    addtocartBtns.forEach((btn) => {
      //*click on button give me id

      const id = btn.dataset.id;
      console.log(id);
      //*check product exist in cart orNO if exist text button is:incart ;))
      const isincart = cart.find((p) => p.id == parseInt(id));
      if (isincart) {
        btn.innerHTML = "incart";
        btn.disabled = true;
      }
      btn.addEventListener("click", (event) => {
        event.target.innerText = "in cart";
        //*get product from products
        const addedtoproduct = { ...Storage.getproduct(id), quantity: 1 };
        //*add to cart
        cart = [...cart, addedtoproduct];
        console.log(cart);
        //*save to loclal
        Storage.savecart(cart);
        this.setcartValue(cart);
        this.addcartItem(addedtoproduct);
      });
    });
  }

  //*carttotal and cartitem
  setcartValue(cart) {
    let tempCartitems = 0;
    let totalprice = cart.reduce((acc, curr) => {
      tempCartitems += curr.quantity;
      return acc + curr.quantity * curr.price;
    }, 0);

    cartitem.innerText = tempCartitems;
    carttotal.innerText = `totalprice: ${totalprice.toFixed(2)} $`;
  }

  addcartItem(cartItem) {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = ` <img class="cart-item-img" src=${cartItem.imgurl} />
<div class="cart-item-desc">
  <h4>${cartItem.title}</h4>
  <h5> $ ${cartItem.price}</h5>
</div>
<div class="cart-item-conteoller">
  <i class="fas fa-chevron-up "data-id=${cartItem.id}></i>
  <p>${cartItem.quantity}</p>
  <i class="fas fa-chevron-down "data-id=${cartItem.id}></i>
  
</div>
<i class="fa fa-trash"  data-id=${cartItem.id}></i>`;
    cartcontent.appendChild(div);
  }

  setup() {
    //*get cart from storage
    cart = Storage.getCart() || [];
    //*add cart item
    cart.forEach((cartitem) => this.addcartItem(cartitem));
    //*setvalue=price
    this.setcartValue(cart);
  }
  cartlogic() {
    //*clear cart
    clearcart.addEventListener("click", () => {
      cart.forEach((citem) => this.removeitem(citem.id));
      this.clearcart();
    });

    //*cart functinality:
    cartcontent.addEventListener("click", (event) => {
      if (event.target.classList.contains("fa-chevron-up")) {
        console.log(event.target.dataset.id);
        //element clicked:
        const addQuantity = event.target;
        //*get item from cart
        const addeditem = cart.find(
          (citem) => citem.id == addQuantity.dataset.id
        );
        addeditem.quantity++;
        this.setcartValue(cart);
        //*update storage
        Storage.savecart(cart);
        //*get add to cart buttons and update text btns and disbled:
        addQuantity.nextElementSibling.innerText = addeditem.quantity;
      }

      //*delete item from cart and localstorage
      else if (event.target.classList.contains("fa-trash")) {
        const removeItem = event.target;
        console.log(removeItem);
        const _removeditem = cart.find(
          (citem) => citem.id === parseInt(removeItem.dataset.id)
        );
        this.removeitem(_removeditem.id);
        Storage.savecart(cart);

        //*delete in dom
        cartcontent.removeChild(removeItem.parentElement);
      } else if (event.target.classList.contains("fa-chevron-down")) {
        console.log(event.target.dataset.id);
        //*when element clicked for sub
        const subQuantity = event.target;
        //*get item from cart is dec
        const substracteditem = cart.find(
          (citem) => citem.id == subQuantity.dataset.id
        );
        if (substracteditem.quantity === 1) {
          this.removeitem(substracteditem.id);
          cartcontent.removeChild(subQuantity.parentElement.parentElement);
        }
        substracteditem.quantity--;
        //*update storage
        Storage.savecart(cart);
        this.setcartValue(cart);

        //*get add to cart buttons and update text btns and disbled:
        subQuantity.previousElementSibling.innerText = substracteditem.quantity;
      }
    });
  }
  clearcart() {
    while (cartcontent.children.length) {
      cartcontent.removeChild(cartcontent.children[0]);
    }
    closeModalFunction();
  }
  removeitem(id) {
    //*update cart
    cart = cart.filter((citem) => citem.id !== id);
    //console.log(cart);
    //*totalprice and cart items
    this.setcartValue(cart);
    //*update storage
    Storage.savecart(cart);
    //*get add to cart buttons and update text btns and disbled:
    this.getsinglebtn(id);
  }
  getsinglebtn(id) {
    const btnaddtocart = buttonsDom.find(
      (btn) => parseInt(btn.dataset.id) === parseInt(id)
    );
    btnaddtocart.innerText = "add to cart";
    btnaddtocart.disabled = false;
  }
}
class Storage {
  //?save products in localstorage:

  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }

  //?get product from products in localstorage

  static getproduct(id) {
    const _products = JSON.parse(localStorage.getItem("products"));
    return _products.find((product) => product.id === parseInt(id));
  }

  //?svae cart to local
  static savecart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  //?get cart
  static getCart() {
    return JSON.parse(localStorage.getItem("cart"));
  }
}
//!when refresh page get products and show them

document.addEventListener("DOMContentLoaded", () => {
  const products = new Products();
  const productsData = products.getproducts();
  const ui = new UI();
  ui.setup();

  ui.displayProducts(productsData);
  ui.getAddtocartBtns();
  ui.cartlogic();
  Storage.saveProducts(productsData);
});

const cartBtn = document.querySelector(".cart-btn");
const cartModal = document.querySelector(".cart");
const backDrop = document.querySelector(".backdrop");
const closeModal = document.querySelector(".cart-item-confirm");

function showModalFunction() {
  backDrop.style.display = "block";
  cartModal.style.opacity = "1";
  cartModal.style.top = "20%";
}

function closeModalFunction() {
  backDrop.style.display = "none";
  cartModal.style.opacity = "0";
  cartModal.style.top = "-100%";
}

cartBtn.addEventListener("click", showModalFunction);
closeModal.addEventListener("click", closeModalFunction);
backDrop.addEventListener("click", closeModalFunction);
