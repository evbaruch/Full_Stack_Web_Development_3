export let contacts = [];
export let editIndex = null;
export let contactId = null;

// showing the login template by default
document.addEventListener("DOMContentLoaded", () => {
  showTemplate("signin");
});

function showTemplate(templateId) {
  const content = document.getElementById("content");
  content.innerHTML = "";
  const template = document.getElementById(`${templateId}-template`).content;
  const clone = document.importNode(template, true);
  content.appendChild(clone);

  // Hide nav bar when in signin or signup mode
  if (templateId === "signin" || templateId === "signup") {
    document.getElementById("nav-bar").style.display = "none";
  } else {
    document.getElementById("nav-bar").style.display = "flex";
  }

  // Call renderList if the read template is shown
  if (templateId === "read") {
    renderList();
  }
}

function renderList() {
  const list = document.getElementById("contactList");
  if (!list) {
    console.error("contactList element not found");
    return;
  }
  list.innerHTML = "";
  const template = document.getElementById("contact-template").content;
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
  if (contacts.length === 0) {
    list.innerHTML = `
      <div class='empty-list'>
        <p>No contacts found </p> 
      </div>`;
  }
}

function goToEditContact(event) {
  editIndex = event.target.getAttribute("data-index");
  contactId = event.target.getAttribute("data-contact-id");
  showTemplate("edit");
  document.getElementById("editContactName").value = contacts[editIndex].name;
  document.getElementById("editContactPhone").value = contacts[editIndex].phone;
  document.getElementById("editContactEmail").value = contacts[editIndex].email;
}

window.renderList = renderList;
window.showTemplate = showTemplate;
window.goToEditContact = goToEditContact;
