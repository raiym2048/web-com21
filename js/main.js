// account logic
// show modal logic
let registerUserModalBtn = document.querySelector("#registerUser-modal");
let loginUserModalBtn = document.querySelector("#loginUser-modal");
let registerUserModalBlock = document.querySelector("#registerUser-block");
let loginUserModalBlock = document.querySelector("#loginUser-block");
let registerUserBtn = document.querySelector("#registerUser-btn");
let loginUserBtn = document.querySelector("#loginUser-btn");
let logoutUserBtn = document.querySelector("#logoutUser-btn");

registerUserModalBtn.addEventListener("click", () => {
  registerUserModalBlock.setAttribute("style", "display: block !important!;");
  registerUserBtn.setAttribute("style", "display: block;");
  loginUserModalBlock.setAttribute("style", "display: none !important;");
  loginUserBtn.setAttribute("style", "display: none;");
});

loginUserModalBtn.addEventListener("click", () => {
  registerUserModalBlock.setAttribute("style", "display: none !important;");
  registerUserBtn.setAttribute("style", "display: none;");
  loginUserModalBlock.setAttribute("style", "display: block !important;");
  loginUserBtn.setAttribute("style", "display: block;");
});

// register logic
// npx json-server -w db.json -p 8000
const USERS_API = "http://localhost:7000/users";

// inputs group
let usernameInp = document.querySelector("#reg-username");
let ageInp = document.querySelector("#reg-age");
let passwordInp = document.querySelector("#reg-password");
let passwordConfirmInp = document.querySelector("#reg-passwordConfirm");
let isAdminInp = document.querySelector("#isAdmin");

async function checkUniqueUserName(userName) {
  let res = await fetch(USERS_API);
  let users = await res.json();
  return users.some(item => item.username === userName);
}

async function registerUser() {
  if (
    !usernameInp.value.trim() ||
    !ageInp.value.trim() ||
    !passwordInp.value.trim() ||
    !passwordConfirmInp.value.trim()
  ) {
    alert("Some inputs are empty!");
    return;
  }

  let uniqueUsername = await checkUniqueUserName(usernameInp.value);

  if (uniqueUsername) {
    alert("User with this username already exists!");
    return;
  }

  if (passwordInp.value !== passwordConfirmInp.value) {
    alert("Passwords don't match!");
    return;
  }

  let userObj = {
    username: usernameInp.value,
    age: ageInp.value,
    password: passwordInp.value,
    isAdmin: isAdminInp.checked,
  };

  fetch(USERS_API, {
    method: "POST",
    body: JSON.stringify(userObj),
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });

  alert("Registered successfully!");

  usernameInp.value = "";
  ageInp.value = "";
  passwordInp.value = "";
  passwordConfirmInp.value = "";
  isAdminInp.checked = false;
}

registerUserBtn.addEventListener("click", registerUser);

// login logic
let = document.querySelector("#showUsername");

function checkLoginLogoutStatus() {
  let user = localStorage.getItem("user");
  if (!user) {
    loginUserModalBtn.parentNode.style.display = "block";
    logoutUserBtn.parentNode.style.display = "none";
    showUsername.innerText = "No user";
  } else {
    loginUserModalBtn.parentNode.style.display = "none";
    logoutUserBtn.parentNode.style.display = "block";
    showUsername.innerText = JSON.parse(user).user;
  }
  showAdminPanel();
}
checkLoginLogoutStatus();

let loginUsernameInp = document.querySelector("#login-username");
let loginPasswordInp = document.querySelector("#login-password");

function checkUserInUsers(username, users) {
  return users.some(item => item.username === username);
}

function checkUserPassword(user, password) {
  return user.password === password;
}

function initStorage() {
  if (!localStorage.getItem("user")) {
    localStorage.setItem("user", "{}");
  }
}

function setUserToStorage(username, isAdmin) {
  localStorage.setItem(
    "user",
    JSON.stringify({ user: username, isAdmin: isAdmin })
  );
}

async function loginUser() {
  let res = await fetch(USERS_API);
  let users = await res.json();

  if (!loginUsernameInp.value.trim() || !loginPasswordInp.value.trim()) {
    alert("Some inputs are empty!");
    return;
  }

  if (!checkUserInUsers(loginUsernameInp.value, users)) {
    alert("User not found!");
    return;
  }

  let userObj = users.find(item => item.username === loginUsernameInp.value);

  if (!checkUserPassword(userObj, loginPasswordInp.value)) {
    alert("Wrong password!");
    return;
  }

  initStorage();

  setUserToStorage(userObj.username, userObj.isAdmin);

  loginUsernameInp.value = "";
  loginPasswordInp.value = "";

  checkLoginLogoutStatus();

  let btnCloseModal = document.querySelector("#btn-close-modal");
  btnCloseModal.click();

  render();
}

loginUserBtn.addEventListener("click", loginUser);

// logout logic
logoutUserBtn.addEventListener("click", () => {
  localStorage.removeItem("user");
  checkLoginLogoutStatus();
  render();
});
// account logic end

// create product logic
function checkUserForProductCreate() {
  let user = JSON.parse(localStorage.getItem("user"));
  if (user) return user.isAdmin;
  return false;
}

function showAdminPanel() {
  let adminPanel = document.querySelector("#admin-panel");
  if (!checkUserForProductCreate()) {
    adminPanel.setAttribute("style", "display: none !important;");
  } else {
    adminPanel.setAttribute("style", "display: block !important;");
  }
}

// inputs group
let productTitle = document.querySelector("#product-title");
let productPrice = document.querySelector("#product-price");
let productDesc = document.querySelector("#product-desc");
let productImage = document.querySelector("#product-image");
let productCategory = document.querySelector("#product-category");

const PRODUCTS_API = "http://localhost:7000/products";

async function createProduct() {
  if (
    !productTitle.value.trim() ||
    !productPrice.value.trim() ||
    !productDesc.value.trim() ||
    !productImage.value.trim() ||
    !productCategory.value.trim()
  ) {
    alert("Some inputs are empty!");
    return;
  }

  let productObj = {
    title: productTitle.value,
    price: productPrice.value,
    desc: productDesc.value,
    image: productImage.value,
    category: productCategory.value,
  };

  await fetch(PRODUCTS_API, {
    method: "POST",
    body: JSON.stringify(productObj),
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });

  productTitle.value = "";
  productPrice.value = "";
  productDesc.value = "";
  productImage.value = "";
  productCategory.value = "";

  render();
}

let addProductBtn = document.querySelector("#add-product-btn");
addProductBtn.addEventListener("click", createProduct);

// read
let currentPage = 1;
let search = "";
let category = "";

async function render() {
  let productsList = document.querySelector("#products-list");
  productsList.innerHTML = "";
  let requestAPI = `${PRODUCTS_API}?q=${search}&category=${category}&_page=${currentPage}&_limit=3`;
  if (!category) {
    requestAPI = `${PRODUCTS_API}?q=${search}&_page=${currentPage}&_limit=3`;
  }
  let res = await fetch(requestAPI);
  let data = await res.json();

  data.forEach(item => {
    productsList.innerHTML += `
        <div class="card m-5" style="width: 18rem;">
            <img src=${item.image} class="card-img-top" alt="..." height="150">
            <div class="card-body">
                <h5 class="card-title">${item.title}</h5>
                <p class="card-text">${item.desc}</p>
                <p class="card-text">${item.price}</p>
                <p class="card-text">${item.category}</p>
                ${
                  checkUserForProductCreate()
                    ? `<a href="#" class="btn btn-danger btn-delete" id="${item.id}">DELETE</a>
                <a href="#" class="btn btn-dark btn-edit" id="${item.id}">EDIT</a>`
                    : ""
                }
            </div>
        </div>
        `;
  });

  if (data.length === 0) return;
  addCategoryToDropdownMenu();
  addDeleteEvent();
  addEditEvent();
}
render();

async function addCategoryToDropdownMenu() {
  let res = await fetch(PRODUCTS_API);
  let data = await res.json();
  let categories = new Set(data.map(item => item.category));
  let categoriesList = document.querySelector(".dropdown-menu");
  categoriesList.innerHTML =
    '<li><a class="dropdown-item" href="#">all</a></li>';
  categories.forEach(item => {
    categoriesList.innerHTML += `<li><a class="dropdown-item" href="#">${item}</a></li>`;
  });

  addClickEventToDropdownItem();
}

// delete

async function deleteProduct(e) {
  let productId = e.target.id;

  await fetch(`${PRODUCTS_API}/${productId}`, {
    method: "DELETE",
  });

  render();
}

function addDeleteEvent() {
  let deleteProductBtn = document.querySelectorAll(".btn-delete");
  deleteProductBtn.forEach(item => {
    item.addEventListener("click", deleteProduct);
  });
}

// update

let saveChangesBtn = document.querySelector(".save-changes-btn");

async function addProductDataToForm(e) {
  let productId = e.target.id;
  let res = await fetch(`${PRODUCTS_API}/${productId}`);
  let productObj = await res.json();

  productTitle.value = productObj.title;
  productPrice.value = productObj.price;
  productDesc.value = productObj.desc;
  productImage.value = productObj.image;
  productCategory.value = productObj.category;

  saveChangesBtn.setAttribute("id", productObj.id);

  checkCreateAndSaveBtn();
}

function addEditEvent() {
  let btnEditProduct = document.querySelectorAll(".btn-edit");
  btnEditProduct.forEach(item => {
    item.addEventListener("click", addProductDataToForm);
  });
}

async function saveChanges(e) {
  let updatedProductObj = {
    id: e.target.id,
    title: productTitle.value,
    price: productPrice.value,
    desc: productDesc.value,
    image: productImage.value,
    category: productCategory.value,
  };
  await fetch(`${PRODUCTS_API}/${e.target.id}`, {
    method: "PUT",
    body: JSON.stringify(updatedProductObj),
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
  productTitle.value = "";
  productPrice.value = "";
  productDesc.value = "";
  productImage.value = "";
  productCategory.value = "";

  saveChangesBtn.removeAttribute("id");

  checkCreateAndSaveBtn();

  render();
}

saveChangesBtn.addEventListener("click", saveChanges);

//filtering

function filterOnCategory(e) {
  category = e.target.innerText;
  if (e.target.innerText === "all") {
    category = "";
  } else {
    category = e.target.innerText;
  }
  render();
}
function addClickEventToDropdownItem() {
  let categoryItem = document.querySelectorAll(".dropdown-item");
  categoryItem.forEach(item =>
    item.addEventListener("click", filterOnCategory)
  );
}

// search
let searchInp = document.querySelector("#search-inp");
searchInp.addEventListener("input", () => {
  search = searchInp.value;
  currentPage = 1;
  render();
});

//pagination
let nextPage = document.querySelector("#next-page");
let prevPage = document.querySelector("#prev-page");

async function checkPages() {
  let res = await fetch(PRODUCTS_API);
  let data = await res.json();
  let pages = Math.ceil(data.length / 3);

  if (currentPage === 1) {
    prevPage.style.display = "none";
    nextPage.style.display = "block";
  } else if (currentPage === pages) {
    prevPage.style.display = "block";
    nextPage.style.display = "none";
  } else {
    prevPage.style.display = "block";
    nextPage.style.display = "block";
  }
}
checkPages();

nextPage.addEventListener("click", () => {
  currentPage++;
  render();
  checkPages();
});
prevPage.addEventListener("click", () => {
  currentPage--;
  render();
  checkPages();
});

//home
let homeBtn = document.querySelector("#home-btn");
homeBtn.addEventListener("click", () => {
  currentPage = 1;
  category = "";
  search = "";
  render();
  checkPages();
});
