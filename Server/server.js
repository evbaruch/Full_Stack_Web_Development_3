const Server = {
  handleRequest(method, url, data, callback) {
    console.log(`Server received request: ${method} ${url}`, data);

    let response = { status: 400, data: { message: "Invalid Request" } };
    url = url.replace("http://localhost:3000", "");
    if (url.startsWith("/users")) {
      // Example: GET /users, POST /users
      response = UserDB.handleRequest(method, url, data);
    } else if (url.startsWith("/contacts")) {
      // Example: GET /contacts/user_id/all, POST /contacts
      response = ContactDB.handleRequest(method, url, data);
    }

    callback(response);
  },
};

// User Database
const UserDB = {
  handleRequest(method, url, data) {
    let users = JSON.parse(localStorage.getItem("users")) || {};
    if (method === "GET") {
      // Example: GET /users
      let user = Object.values(users).find(
        (u) => u.username === data.username && u.password === data.password
      );
      return { status: 200, data: Object.values(user) };
    } else if (method === "POST") {
      // Example: POST /users { name: "John Doe" }
      const userId = Date.now().toString();
      users[userId] = { id: userId, ...data };
      localStorage.setItem("users", JSON.stringify(users));
      return { status: 201, data: users[userId] };
    }
    return { status: 400, data: { message: "Invalid User Request" } };
  },
};

// Contact Database
const ContactDB = {
  handleRequest(method, url, data) {
    let contacts = JSON.parse(localStorage.getItem("contacts")) || {};
    const parts = url.split("/");
    if (method === "GET") {
      if (parts.length === 4 && parts[2] !== "all") {
        // Example: GET /contacts/user_id
        const userId = parts[2];
        if (userId !== data.currentUser) {
          return { status: 403, data: { message: "Access denied" } };
        }
        if (parts[3] === "all") {
          return { status: 200, data: contacts[userId] || [] };
        } else if (parts[3] === "search") {
          let contact = contacts[userId].filter(
            (c) =>
              c.name.toLowerCase().includes(data.search.toLowerCase()) ||
              c.phone.toLowerCase().includes(data.search.toLowerCase()) ||
              c.email.toLowerCase().includes(data.search.toLowerCase())
          );
          return { status: 200, data: contact };
        }
        return { status: 404, data: { message: "User not found" } };
      }
    } else if (method === "POST") {
      // Example: POST /contacts { userId: "123", name: "Alice" }
      if (!contacts[data.userID]) {
        contacts[data.userID] = [];
      }
      data.contactId = Date.now().toString();
      contacts[data.userID].push(data);
      localStorage.setItem("contacts", JSON.stringify(contacts));
      return { status: 201, data: data };
    } else if (method === "PUT") {
      // Example: PUT /contacts { userId: "123", id: "456", name: "Bob" }
      if (!contacts[data.userID])
        return { status: 404, data: { message: "User not found" } };
      const index = contacts[data.userID].findIndex(
        (c) => c.contactId === data.contactId
      );
      if (index !== -1) {
        contacts[data.userID][index] = data;
        localStorage.setItem("contacts", JSON.stringify(contacts));
        return { status: 200, data: data };
      }
      return { status: 404, data: { message: "Contact not found" } };
    } else if (method === "DELETE") {
      // Example: DELETE /contacts { userId: "123", id: "456" }
      if (!contacts[data.userID])
        return { status: 404, data: { message: "User not found" } };
      if (parts[2] !== data.userID)
        return { status: 403, data: { message: "Access denied" } };

      const index = contacts[data.userID].findIndex(
        (c) => c.contactId === data.contactId
      );
      if (index !== -1) {
        contacts[data.userID].splice(index, 1);
        localStorage.setItem("contacts", JSON.stringify(contacts));
        return { status: 200, data: { message: "Contact deleted" } };
      }
      return { status: 404, data: { message: "Contact not found" } };
    }
    return { status: 400, data: { message: "Invalid Contact Request" } };
  },
};

export default Server;
