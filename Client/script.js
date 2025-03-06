import FXMLHttpRequest from "../JS/FAJAX.JS";

let contacts = [];
let userID = null;
let editIndex = null;

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
    }
  };
  xhr.send();
  renderList();
}

function addContact() {
  const name = document.getElementById("contactName").value.trim();
  const phone = document.getElementById("contactPhone").value.trim();
  const email = document.getElementById("contactEmail").value.trim();
  if (name && phone && email) {
    contacts.push({ name, phone, email });

    const xhr = new FXMLHttpRequest();
    console.log(userID);
    xhr.open("POST", `http://localhost:3000/contacts/${userID}`);
    xhr.onload = () => {
      if (xhr.readyState === 4 && xhr.status === 201) {
        console.log(xhr.responseText);
      }
    };
    xhr.send({ name, phone, email });

    document.getElementById("contactName").value = "";
    document.getElementById("contactPhone").value = "";
    document.getElementById("contactEmail").value = "";
    renderList();
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
      deleteButton.setAttribute("data-index", index);
      list.appendChild(clone);
    }
  });
}

function goToEditContact(event) {
  editIndex = event.target.getAttribute("data-index");
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
    contacts[editIndex] = { name: newName, phone: newPhone, email: newEmail };

    const xhr = new FXMLHttpRequest();
    xhr.open("PUT", `http://localhost:3000/contacts/${editIndex}`);
    xhr.onload = () => {
      console.log("Contact updated successfully");
    };
    xhr.send({ name: newName, phone: newPhone, email: newEmail });

    renderList();
    showTemplate("read");
  }
}

function deleteContact(event) {
  const index = event.target.getAttribute("data-index");
  contacts.splice(index, 1);

  const xhr = new FXMLHttpRequest();
  xhr.open("DELETE", `http://localhost:3000/contacts/${index}`);
  xhr.onload = () => {
    if (xhr.readyState === 4 && xhr.status === 200) {
      console.log("Contact deleted successfully");
    }
  };
  xhr.send();

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
        userID = JSON.parse(xhr.responseText)[0];
        console.log(userID);
        alert("Signup successful");
        showTemplate("read");
        loadContacts();
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

// Attach functions to the window object to make them globally accessible
window.showTemplate = showTemplate;
window.addContact = addContact;
window.goToEditContact = goToEditContact;
window.saveEditContact = saveEditContact;
window.deleteContact = deleteContact;
window.signup = signup;
window.login = login;
window.logout = logout;
