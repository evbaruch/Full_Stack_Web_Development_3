const DataBase = {
  getItem(key) {
    return JSON.parse(localStorage.getItem(key)) || {};
  },

  setItem(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },

  findUser(users, username, password) {
    return Object.values(users).find(
      (u) => u.username === username && u.password === password
    );
  },

  addUser(users, data) {
    const userId = Date.now().toString();
    users[userId] = { id: userId, ...data };
    this.setItem("users", users);
    return users[userId];
  },

  getContacts(userId) {
    const contacts = this.getItem("contacts");
    return contacts[userId] || [];
  },

  addContact(userId, data) {
    const contacts = this.getItem("contacts");
    if (!contacts[userId]) {
      contacts[userId] = [];
    }
    data.contactId = Date.now().toString();
    contacts[userId].push(data);
    this.setItem("contacts", contacts);
    return data;
  },

  updateContact(userId, contactId, data) {
    const contacts = this.getItem("contacts");
    const index = contacts[userId].findIndex((c) => c.contactId === contactId);
    if (index !== -1) {
      contacts[userId][index] = data;
      this.setItem("contacts", contacts);
      return data;
    }
    return null;
  },

  deleteContact(userId, contactId) {
    const contacts = this.getItem("contacts");
    const index = contacts[userId].findIndex((c) => c.contactId === contactId);
    if (index !== -1) {
      contacts[userId].splice(index, 1);
      this.setItem("contacts", contacts);
      return true;
    }
    return false;
  },

  searchContacts(userId, searchTerm) {
    const searchRegex = new RegExp(searchTerm, "i");
    const contacts = this.getContacts(userId).filter(
      (c) =>
        searchRegex.test(c.name) ||
        searchRegex.test(c.phone) ||
        searchRegex.test(c.email)
    );
    return contacts;
  }
};

export default DataBase;