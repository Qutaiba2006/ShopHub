const sectionOfProducts = document.getElementById("product");
const categories = ["smartphones", "laptops", "tablets", "mobile-accessories"];
let products = [];
const renderProduct = (items) => {
  sectionOfProducts.innerHTML = "";
  items.forEach((elem) => {
    const addElement = document.createElement("div");
    addElement.className = "card themjs";
    addElement.style.width = "18rem";
    addElement.innerHTML = `
       <img src="${elem.thumbnail}" class="card-img-top" alt="elem.title">
       <div class="card-body d-flex flex-column">
         <h5 class="card-title">${elem.title}</h5>
         <p class="card-text">${elem.description}</p>
         <div class="d-flex mt-auto align-items-center justify-content-between">
         <p class="card-text">${elem.price}$</p>
         <button type="button" class="btn btn-primary addToCart "><i class="bi bi-cart"></i></button>
         </div>
         </div>ّ
      `;
    const button = addElement.querySelector(".addToCart");
    button.addEventListener("click", () => {
      addToCart(elem.id);
    });
    sectionOfProducts.append(addElement);
  });
};
const getItems = async () => {
  try {
    const responses = await Promise.all(
      categories.map((c) =>
        fetch(`https://dummyjson.com/products/category/${c}`),
      ),
    );
    const data = await Promise.all(responses.map((r) => r.json()));
    products = data.flatMap((d) => d.products);
    renderProduct(products);
  } catch (err) {
    console.log("error");
  }
};
getItems();
const changeThem = document.getElementById("them");
changeThem.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark");
  document
    .querySelector("nav")
    .setAttribute("data-bs-theme", isDark ? "dark" : "light");
  document.getElementById("image").src = isDark ? "Dark.jpg" : "Light.jpg";
});
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const result = products.filter((elem) => {
    return elem.title.toLowerCase().includes(searchInput.value.toLowerCase());
  });
  if (result.length === 0)
    sectionOfProducts.innerHTML = "<h1>no products found</h1>";
  else renderProduct(result);
});
const cartLink = document.getElementById("cartLink");
const cartPage = document.getElementById("cartPage");
const home = document.getElementById("home");
cartLink.addEventListener("click", (e) => {
  e.preventDefault();
  if (cartPage.classList.contains("d-none")) {
    cartPage.classList.remove("d-none");
    home.classList.add("d-none");
    sectionOfProducts.classList.add("d-none");
  } else {
    cartPage.classList.add("d-none");
    home.classList.remove("d-none");
    sectionOfProducts.classList.remove("d-none");
  }
});
let cart = [];
const sectionOfCart = document.getElementById("cartItem");
const renderCart = (items) => {
  sectionOfCart.innerHTML = "";
  items.forEach((elem) => {
    const addElement = document.createElement("div");
    addElement.className = "card themjs";
    addElement.style.width = "18rem";
    addElement.innerHTML = `
       <img src="${elem.thumbnail}" class="card-img-top" alt="elem.title">
       <div class="card-body d-flex flex-column">
         <h5 class="card-title">${elem.title}</h5>
         <div class="d-flex mt-auto align-items-center justify-content-between">
         <p class="card-text">${elem.price * elem.quantity}$</p>
         <p>quantity: ${elem.quantity}</p>
         </div>
         </div>
      `;
    sectionOfCart.append(addElement);
    const total = items.reduce((sum, elem) => {
      return sum + elem.price * elem.quantity;
    }, 0);
    document.getElementById("cartTotal").textContent =
      `Total: $${total.toFixed(2)}`;
  });
};
const addToCart = (id) => {
  const selectProduct = products.find((elem) => {
    return elem.id === id;
  });
  const found = cart.find((elem) => {
    return elem.id === id;
  });
  if (found) {
    found.quantity++;
  } else {
    let x = {
      id: selectProduct.id,
      title: selectProduct.title,
      price: selectProduct.price,
      thumbnail: selectProduct.thumbnail,
      quantity: 1,
    };
    cart.push(x);
  }
  renderCart(cart);
};
const checkoutButton = document.getElementById("checkoutButton");
const checkoutMessage = document.getElementById("checkoutMessage");
checkoutButton.addEventListener("click", () => {
  if (cart.length === 0) {
    checkoutMessage.textContent = "Your cart is empty!";
    return;
  }
  const total = cart.reduce((sum, elem) => {
    return sum + elem.price * elem.quantity;
  }, 0);
  const confirmOrder = confirm(
    `Your total is $${total.toFixed(2)}. Confirm checkout?`,
  );
  if (!confirmOrder) return;
  cart = [];
  renderCart(cart);
  checkoutMessage.textContent = "Your order has been placed successfully!";
});
