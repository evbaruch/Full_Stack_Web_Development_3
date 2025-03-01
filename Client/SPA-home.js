let contacts = [];
let editIndex = null;

function showTemplate(templateId) {
    document.querySelectorAll('.template-section').forEach(section => section.classList.add('hidden'));
    document.getElementById(templateId).classList.remove('hidden');

    // Hide nav buttons when in edit mode
    document.getElementById('nav-bar').style.display = templateId === 'edit' ? 'none' : 'flex';
}

function addContact() {
    const name = document.getElementById('contactName').value.trim();
    const phone = document.getElementById('contactPhone').value.trim();
    if (name && phone) {
        contacts.push({ name, phone });
        document.getElementById('contactName').value = '';
        document.getElementById('contactPhone').value = '';
        renderList();
        showTemplate('read');
    }
}

function renderList() {
  const list = document.getElementById('contactList');
  list.innerHTML = '';
  const template = document.getElementById('contactTemplate').content;
  contacts.forEach((contact, index) => {
      const clone = document.importNode(template, true);
      const contactName = clone.querySelector('.contact-name');
      const contactPhone = clone.querySelector('.contact-phone');
      const editButton = clone.querySelector('.contact-actions button:nth-child(1)');
      const deleteButton = clone.querySelector('.contact-actions button:nth-child(2)');
      
      if (contactName && contactPhone && editButton && deleteButton) {
          contactName.textContent = contact.name;
          contactPhone.textContent = contact.phone;
          editButton.setAttribute('data-index', index);
          deleteButton.setAttribute('data-index', index);
          list.appendChild(clone);
      }
  });
}

function goToEditContact(event) {
    editIndex = event.target.getAttribute('data-index');
    document.getElementById('editContactName').value = contacts[editIndex].name;
    document.getElementById('editContactPhone').value = contacts[editIndex].phone;
    showTemplate('edit');
}

function saveEditContact() {
    const newName = document.getElementById('editContactName').value.trim();
    const newPhone = document.getElementById('editContactPhone').value.trim();
    if (newName && newPhone) {
        contacts[editIndex] = { name: newName, phone: newPhone };
        renderList();
        showTemplate('read');
    }
}

function deleteContact(event) {
    const index = event.target.getAttribute('data-index');
    contacts.splice(index, 1);
    renderList();
}
