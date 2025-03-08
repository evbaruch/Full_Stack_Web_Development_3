import FXMLHttpRequest from "../JS/FAJAX.JS";

let contacts = [];
let userID = null;
let editIndex = null;
let contactId = null;

function showTemplate(templateId) {
  document
    .querySelectorAll(".template-section")
    .forEach((section) => section.classList.add("hidden"));
  document.getElementById(templateId).classList.remove("hidden");

  // Hide nav bar when in signin or signup mode
  if (templateId === "signin" || templateId === "signup") {
    document.getElementById("nav-bar").style.display = "none";
  } else {
    document.getElementById("nav-bar").style.display = "flex";
  }
}

function loadContacts() {
  const xhr = new FXMLHttpRequest();
  xhr.open("GET", `http://localhost:3000/contacts/${userID}/all`);
  xhr.onload = () => {
    if (xhr.readyState === 4 && xhr.status === 200) {
      console.log(xhr.responseText);
      contacts = JSON.parse(xhr.responseText);
      renderList();
    } else if (xhr.readyState === 4) {
      alert(xhr.responseText);
    }
  };
  xhr.send({ currentUser: userID });
  renderList();
}

function addContact() {
  const name = document.getElementById("contactName").value.trim();
  const phone = document.getElementById("contactPhone").value.trim();
  const email = document.getElementById("contactEmail").value.trim();
  if (name && phone && email) {
    const xhr = new FXMLHttpRequest();
    console.log(userID);
    xhr.open("POST", `http://localhost:3000/contacts/${userID}`);
    xhr.onload = () => {
      if (xhr.readyState === 4 && xhr.status === 201) {
        let contactId = JSON.parse(xhr.responseText).contactId;
        contacts.push({ name, phone, email, contactId });
        renderList();
      } else if (xhr.readyState === 4) {
        alert(xhr.responseText);
      }
    };
    xhr.send({ name, phone, email, userID });
    document.getElementById("contactName").value = "";
    document.getElementById("contactPhone").value = "";
    document.getElementById("contactEmail").value = "";
    showTemplate("read");
  }
}

function renderList() {
  const list = document.getElementById("contactList");
  list.innerHTML = "";
  const template = document.getElementById("contactTemplate").content;
  contacts.forEach((contact, index) => {
    const clone = document.importNode(template, true);
    const contactName = clone.querySelector(".contact-name");
    const contactPhone = clone.querySelector(".contact-phone");
    const contactEmail = clone.querySelector(".contact-email");
    const editButton = clone.querySelector(
      ".contact-actions button:nth-child(1)"
    );
    const deleteButton = clone.querySelector(
      ".contact-actions button:nth-child(2)"
    );

    if (
      contactName &&
      contactPhone &&
      contactEmail &&
      editButton &&
      deleteButton
    ) {
      contactName.textContent = contact.name;
      contactPhone.textContent = contact.phone;
      contactEmail.textContent = contact.email;
      editButton.setAttribute("data-index", index);
      editButton.setAttribute("data-contact-id", contact.contactId);
      deleteButton.setAttribute("data-index", index);
      deleteButton.setAttribute("data-contact-id", contact.contactId);
      list.appendChild(clone);
    }
  });
}

function goToEditContact(event) {
  editIndex = event.target.getAttribute("data-index");
  contactId = event.target.getAttribute("data-contact-id");
  document.getElementById("editContactName").value = contacts[editIndex].name;
  document.getElementById("editContactPhone").value = contacts[editIndex].phone;
  document.getElementById("editContactEmail").value = contacts[editIndex].email;
  showTemplate("edit");
}

function saveEditContact() {
  const newName = document.getElementById("editContactName").value.trim();
  const newPhone = document.getElementById("editContactPhone").value.trim();
  const newEmail = document.getElementById("editContactEmail").value.trim();
  if (newName && newPhone && newEmail) {
    const xhr = new FXMLHttpRequest();
    xhr.open("PUT", `http://localhost:3000/contacts/${userID}/${contactId}`);
    xhr.onload = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        console.log("Contact updated successfully");
        contacts[editIndex] = {
          name: newName,
          phone: newPhone,
          email: newEmail,
          contactId: contactId,
        };
        renderList();
        showTemplate("read");
      } else if (xhr.readyState === 4) {
        alert(xhr.responseText);
      }
    };
    xhr.send({
      name: newName,
      phone: newPhone,
      email: newEmail,
      userID: userID,
      contactId: contactId,
    });
  }
}

function deleteContact(event) {
  const index = event.target.getAttribute("data-index");
  contactId = event.target.getAttribute("data-contact-id");
  const xhr = new FXMLHttpRequest();
  xhr.open("DELETE", `http://localhost:3000/contacts/${userID}/${contactId}`);
  xhr.onload = () => {
    if (xhr.readyState === 4 && xhr.status === 200) {
      console.log("Contact deleted successfully");
      contacts.splice(index, 1);
      renderList();
    } else if (xhr.readyState === 4) {
      alert(xhr.responseText);
    }
  };
  xhr.send({ userID: userID, contactId: contactId });

  renderList();
}

function signup() {
  const username = document.getElementById("signupUsername").value.trim();
  const password = document.getElementById("signupPassword").value.trim();
  if (username && password) {
    const xhr = new FXMLHttpRequest();
    xhr.open("POST", "http://localhost:3000/users/signup");
    xhr.onload = () => {
      if (xhr.readyState === 4 && xhr.status === 201) {
        console.log(xhr.responseText);
        userID = JSON.parse(xhr.responseText).id;
        console.log(userID);
        alert("Signup successful");
        showTemplate("read");
        loadContacts();
      } else if (xhr.readyState === 4) {
        alert(xhr.responseText);
      }
    };
    xhr.send({ username, password });
  } else {
    alert("Please enter a username and password");
  }
}

function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  if (username && password) {
    const xhr = new FXMLHttpRequest();
    xhr.open("GET", "http://localhost:3000/users");
    xhr.onload = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        console.log(xhr.responseText);
        userID = JSON.parse(xhr.responseText)[0];
        console.log(userID);
        alert("Login successful");
        showTemplate("read");
        loadContacts();
      } else if (xhr.readyState === 4) {
        alert(xhr.responseText);
      }
    };
    xhr.send({ username, password });
  } else {
    alert("Please enter a username and password");
  }
}

function logout() {
  userID = null;
  contacts = [];
  // Redirect to the login template
  showTemplate("signin");
}

// search function
function searchContact() {
  const search = document.getElementById("searchInput").value.trim();
  const xhr = new FXMLHttpRequest();
  xhr.open("GET", `http://localhost:3000/contacts/${userID}/search`);
  xhr.onload = () => {
    if (xhr.readyState === 4 && xhr.status === 200) {
      console.log(xhr.responseText);
      contacts = JSON.parse(xhr.responseText);
      renderList();
    } else if (xhr.readyState === 4) {
      alert(xhr.responseText);
    }
  };
  xhr.send({ currentUser: userID, search });
  renderList();
}

function handleNetworkRequest(method, url, data, callback) {
  const button = document.getElementById("retryButton");
  button.classList.add("hidden");

  // Store all parameters in data attributes to be used in the retry function
  button.setAttribute("data-method", method);
  button.setAttribute("data-url", url);
  button.setAttribute("data-data", JSON.stringify(data));
  button.setAttribute("data-callback", callback.name);

  button.style.pointerEvents = "none";

  const xhr = new FXMLHttpRequest();
  xhr.open(method, url);
  xhr.onload = () => {
    callback(xhr);
  };
  xhr.send(data);
  setTimeout(() => {
    if (xhr.readyState !== 4) {
      button.classList.remove("hidden");
      button.style.pointerEvents = "auto";
    }
  }, 4000);
}

function handleRetryClick() {
  // TODO: add a animation of loading
  const button = document.getElementById("retryButton");

  // Retrieve stored parameters from data attributes
  const method = button.getAttribute("data-method");
  const url = button.getAttribute("data-url");
  const data = JSON.parse(button.getAttribute("data-data"));
  const callbackName = button.getAttribute("data-callback");

  // Find the callback function by name
  const callback = window[callbackName];

  // Retry the network request
  handleNetworkRequest(method, url, data, callback);
}

// When using a module system in JavaScript, such as ES6 modules,
// the functions and variables defined within a module are not automatically added to the global scope.
//  This means that they are not accessible from the HTML file directly. To understand why this happens and how to resolve it,
//  let's delve into the details.

// What is a Module System?
// A module system allows you to break your code into smaller,
//  reusable pieces called modules. Each module can export functions, objects, or variables,
//  and other modules can import and use them. This helps in organizing code, improving maintainability,
//  and avoiding global namespace pollution.

// How Modules Work
// In a module system, each module has its own scope.
//  This means that the functions and variables defined within a module are not accessible outside of that
//  module unless they are explicitly exported. Similarly, to use functions or variables from another module,
//  you need to import them.

window.showTemplate = showTemplate;
window.addContact = addContact;
window.goToEditContact = goToEditContact;
window.saveEditContact = saveEditContact;
window.deleteContact = deleteContact;
window.signup = signup;
window.login = login;
window.logout = logout;
window.searchContact = searchContact;
window.handleNetworkRequest = handleNetworkRequest;
window.handleRetryClick = handleRetryClick;
