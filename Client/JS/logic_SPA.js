import FXMLHttpRequest from "../JS/FAJAX.JS";

let userID = null;
let editIndex = null;
let contactId = null;

// Global object to store callback functions
const callbackRegistry = {};

function loadContacts() {
  const loadContactsCallback = (xhr) => {
    if (xhr.readyState === 4 && xhr.status === 200) {
      console.log(xhr.responseText);
      contacts = JSON.parse(xhr.responseText);
      renderList();
    } else if (xhr.readyState === 4) {
      alert(
        `Failed to load contacts: \nerror code ${xhr.status} \n${
          JSON.parse(xhr.responseText).message
        }`
      );
    }
  };

  handleNetworkRequest(
    "GET",
    `http://localhost:3000/contacts/${userID}/all`,
    { currentUser: userID },
    loadContactsCallback,
    "retry load all contacts"
  );
}

function addContact() {
  const name = document.getElementById("contactName").value.trim();
  const phone = document.getElementById("contactPhone").value.trim();
  const email = document.getElementById("contactEmail").value.trim();
  if (name && phone && email) {
    const addContactCallback = (xhr) => {
      if (xhr.readyState === 4 && xhr.status === 201) {
        let contactId = JSON.parse(xhr.responseText).contactId;
        contacts.push({ name, phone, email, contactId });
        document.getElementById("contactName").value = "";
        document.getElementById("contactPhone").value = "";
        document.getElementById("contactEmail").value = "";
        showTemplate("read");
      }
      // else if (xhr.readyState === 4 && xhr.status === 409) {
      //   loadContacts();
      //   showTemplate("read");
      // } 
      else if (xhr.readyState === 4) {
        alert(
          `Failed to add contact: \nerror code ${xhr.status} 
          \n${JSON.parse(xhr.responseText).message}`
        );
      }
    };

    handleNetworkRequest(
      "POST",
      `http://localhost:3000/contacts/${userID}`,
      { name, phone, email, userID },
      addContactCallback,
      `retry add for ${name}`
    );
  }
}

function saveEditContact() {
  const newName = document.getElementById("editContactName").value.trim();
  const newPhone = document.getElementById("editContactPhone").value.trim();
  const newEmail = document.getElementById("editContactEmail").value.trim();
  if (newName && newPhone && newEmail) {
    const saveEditContactCallback = (xhr) => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        console.log("Contact updated successfully");
        contacts[editIndex] = {
          name: newName,
          phone: newPhone,
          email: newEmail,
          contactId: contactId,
        };
        showTemplate("read");
      } 
      else if (xhr.readyState === 4 && xhr.status === 409) {
        loadContacts();
        showTemplate("read");
      }
      else if (xhr.readyState === 4) {
        alert(
          `Failed to save contact: \nerror code ${xhr.status} 
          \n${JSON.parse(xhr.responseText).message}`
        );
      }
    };

    handleNetworkRequest(
      "PUT",
      `http://localhost:3000/contacts/${userID}/${contactId}`,
      {
        name: newName,
        phone: newPhone,
        email: newEmail,
        userID: userID,
        contactId: contactId,
      },
      saveEditContactCallback,
      `retry save for ${newName}`
    );
  }
}

function deleteContact(event) {
  const index = event.target.getAttribute("data-index");
  contactId = event.target.getAttribute("data-contact-id");
  let name = contacts[index].name;

  const deleteContactCallback = (xhr) => {
    if (xhr.readyState === 4 && xhr.status === 200) {
      console.log("Contact deleted successfully");
      contacts.splice(index, 1);
      renderList();
    }
    else if (xhr.readyState === 4 && xhr.status === 404) {
      loadContacts();
    }
     else if (xhr.readyState === 4) {
      alert(
        `Failed to delete contact: \nerror code ${xhr.status} \n${
          JSON.parse(xhr.responseText).message
        }`
      );
    }
  };

  handleNetworkRequest(
    "DELETE",
    `http://localhost:3000/contacts/${userID}/${contactId}`,
    { userID: userID, contactId: contactId },
    deleteContactCallback,
    `retry delete for ${name}`
  );
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
        alert(
          `Failed to signup: \nerror code ${xhr.status} \n${
            JSON.parse(xhr.responseText).message
          }`
        );
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
        alert(
          `Failed to login: \nerror code ${xhr.status} \n${
            JSON.parse(xhr.responseText).message
          }`
        );
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
  renderList();
  // Redirect to the login template
  showTemplate("signin");
}

// search function
function searchContact() {
  const search = document.getElementById("searchInput").value.trim();

  const searchContactCallback = (xhr) => {
    if (xhr.readyState === 4 && xhr.status === 200) {
      console.log(xhr.responseText);
      contacts = JSON.parse(xhr.responseText);
      renderList();
    } else if (xhr.readyState === 4) {
      alert(
        `Failed to search contacts: \nerror code ${xhr.status} \n${
          JSON.parse(xhr.responseText).message
        }`
      );
    }
  };

  handleNetworkRequest(
    "GET",
    `http://localhost:3000/contacts/${userID}/search`,
    { currentUser: userID, search },
    searchContactCallback,
    `retry search for ${search}`
  );
}

function handleNetworkRequest(method, url, data, callback, buttenText) {
  const button = document.getElementById("retryButton");
  button.classList.add("hidden");
  const loader = document.getElementById("loader");
  loader.classList.remove("hidden");

  // Store all parameters in data attributes to be used in the retry function
  button.setAttribute("data-method", method);
  button.setAttribute("data-url", url);
  button.setAttribute("data-data", JSON.stringify(data));
  const callbackId = `callback_${Date.now()}`;
  callbackRegistry[callbackId] = callback;
  button.setAttribute("data-callback-id", callbackId);

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
      button.textContent = buttenText;
      loader.classList.add("hidden");
    } else {
      loader.classList.add("hidden");
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
  const callbackId = button.getAttribute("data-callback-id");

  // Retrieve the callback function from the registry
  const callback = callbackRegistry[callbackId];

  // Retry the network request
  handleNetworkRequest(method, url, data, callback, button.textContent);
}

// When using a module system in JavaScript, such as ES6 modules,
// the functions and variables defined within a module are not automatically added to the global scope.
// This means that they are not accessible from the HTML file directly. To understand why this happens and how to resolve it,
// let's delve into the details.

// What is a Module System?
// A module system allows you to break your code into smaller,
// reusable pieces called modules. Each module can export functions, objects, or variables,
// and other modules can import and use them. This helps in organizing code, improving maintainability,
// and avoiding global namespace pollution.

// How Modules Work
// In a module system, each module has its own scope.
// This means that the functions and variables defined within a module are not accessible outside of that
// module unless they are explicitly exported. Similarly, to use functions or variables from another module,
// you need to import them.


window.addContact = addContact;
window.saveEditContact = saveEditContact;
window.deleteContact = deleteContact;
window.signup = signup;
window.login = login;
window.logout = logout;
window.searchContact = searchContact;
window.handleNetworkRequest = handleNetworkRequest;
window.handleRetryClick = handleRetryClick;
window.loadContacts = loadContacts;
