import FXMLHttpRequest from "../../JS/fajax.js";
import { contacts, editIndex, contactId } from "./display_SPA.js";

let userID = null;

// Global object to store callback functions
const callbackRegistry = {};

/**
 * Load all contacts for the current user.
 * URL: GET http://localhost:3000/contacts/{userID}/all
 * Data: { currentUser: userID }
 */
function loadContacts() {
  const loadContactsCallback = (xhr) => {
    if (xhr.readyState === 4 && xhr.status === 200) {
      console.log(xhr.responseText);
      contacts.length = 0;
      contacts.push(...JSON.parse(xhr.responseText));
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

/**
 * Add a new contact for the current user.
 * URL: POST http://localhost:3000/contacts/{userID}
 * Data: { name, phone, email, userID }
 */
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
      } else if (xhr.readyState === 4) {
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

/**
 * Save edited contact for the current user.
 * URL: PUT http://localhost:3000/contacts/{userID}/{contactId}
 * Data: { name: newName, phone: newPhone, email: newEmail, userID, contactId }
 */
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
      } else if (xhr.readyState === 4 && xhr.status === 409) {
        loadContacts();
        showTemplate("read");
      } else if (xhr.readyState === 4) {
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

/**
 * Delete a contact for the current user.
 * URL: DELETE http://localhost:3000/contacts/{userID}/{contactIdToDelete}
 * Data: { userID, contactId: contactIdToDelete }
 */
function deleteContact(event) {
  const index = event.target.getAttribute("data-index");
  const contactIdToDelete = event.target.getAttribute("data-contact-id");
  let name = contacts[index].name;

  const deleteContactCallback = (xhr) => {
    if (xhr.readyState === 4 && xhr.status === 200) {
      console.log("Contact deleted successfully");
      contacts.splice(index, 1);
      renderList();
    } else if (xhr.readyState === 4 && xhr.status === 404) {
      loadContacts();
    } else if (xhr.readyState === 4) {
      alert(
        `Failed to delete contact: \nerror code ${xhr.status} \n${
          JSON.parse(xhr.responseText).message
        }`
      );
    }
  };

  handleNetworkRequest(
    "DELETE",
    `http://localhost:3000/contacts/${userID}/${contactIdToDelete}`,
    { userID: userID, contactId: contactIdToDelete },
    deleteContactCallback,
    `retry delete for ${name}`
  );
}

/**
 * Sign up a new user.
 * URL: POST http://localhost:3000/users/signup
 * Data: { username, password }
 */
function signup() {
  const username = document.getElementById("signupUsername").value.trim();
  const password = document.getElementById("signupPassword").value.trim();
  if (username && password) {
    const signupCallback = (xhr) => {
      if (xhr.readyState === 4 && xhr.status === 201) {
        console.log(xhr.responseText);
        userID = JSON.parse(xhr.responseText).id;
        console.log(userID);
        showTemplate("read");
        loadContacts();
      } else if (xhr.readyState === 4 && xhr.status === 409) {
        alert(
          `Failed to signup: \nerror code ${xhr.status} \n${
            JSON.parse(xhr.responseText).message
          }`
        );
      }
    };
    handleNetworkRequest(
      "POST",
      "http://localhost:3000/users/signup",
      { username, password },
      signupCallback,
      "retry signup"
    );
  } else {
    alert("Please enter a username and password");
  }
}

/**
 * Log in an existing user.
 * URL: GET http://localhost:3000/users
 * Data: { username, password }
 */
function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  if (username && password) {
    const LoginCallback = (xhr) => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        console.log(xhr.responseText);
        userID = JSON.parse(xhr.responseText)[0];
        console.log(userID);
        showTemplate("read");
        loadContacts();
      }
    };
    handleNetworkRequest(
      "GET",
      "http://localhost:3000/users",
      { username, password },
      LoginCallback,
      "retry login"
    );
  } else {
    alert("Please enter a username and password");
  }
}

/**
 * Log out the current user.
 */
function logout() {
  userID = null;
  contacts.length = 0;
  renderList();
  // Redirect to the login template
  showTemplate("signin");
}

/**
 * Search for contacts.
 * URL: GET http://localhost:3000/contacts/{userID}/search
 * Data: { currentUser: userID, search }
 */
function searchContact() {
  const search = document.getElementById("searchInput").value.trim();

  const searchContactCallback = (xhr) => {
    if (xhr.readyState === 4 && xhr.status === 200) {
      console.log(xhr.responseText);
      contacts.length = 0;
      contacts.push(...JSON.parse(xhr.responseText));
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

/**
 * Handle network requests with retry functionality.
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE)
 * @param {string} url - URL for the request
 * @param {object} data - Data to be sent with the request
 * @param {function} callback - Callback function to handle the response
 * @param {string} buttonText - Text for the retry button
 */
function handleNetworkRequest(method, url, data, callback, buttonText) {
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
      button.textContent = buttonText;
      loader.classList.add("hidden");
    } else {
      loader.classList.add("hidden");
    }
  }, 4000);
}

/**
 * Handle retry button click to retry the network request.
 */
function handleRetryClick() {
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