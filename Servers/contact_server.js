import DataBase from "../JS/DataBase.js";

const ContactServer = {
  /**
   * Handle incoming requests and route them to the appropriate database operations.
   * @param {string} method - The HTTP method (GET, POST, PUT, DELETE).
   * @param {string} url - The URL of the request.
   * @param {object} data - The data sent with the request.
   * @returns {object} - The response object containing status and data.
   */
  handleRequest(method, url, data) {
    const parts = url.split("/");
    const userId = parts[2];

    switch (method) {
      case "GET":
        if (parts.length === 4) {
          if (userId !== data.currentUser) {
            return { status: 403, data: { message: "Access denied" } };
          }
          if (parts[3] === "all") {
            // Get all contacts for the user
            const contacts = DataBase.getContacts(userId);
            return { status: 200, data: contacts };
          } else if (parts[3] === "search") {
            // Search contacts for the user
            const contacts = DataBase.searchContacts(userId, data.search);
            return { status: 200, data: contacts };
          }
        }
        return { status: 404, data: { message: "User not found" } };

      case "POST":
        // Add a new contact for the user
        const newContact = DataBase.addContact(data.userID, data);
        return { status: 201, data: newContact };

      case "PUT":
        // Update an existing contact for the user
        const updatedContact = DataBase.updateContact(data.userID, parts[3], data);
        if (updatedContact) {
          return { status: 200, data: updatedContact };
        }
        return { status: 404, data: { message: "Contact not found" } };

      case "DELETE":
        // Delete a contact for the user
        const deleted = DataBase.deleteContact(data.userID, data.contactId);
        if (deleted) {
          return { status: 200, data: { message: "Contact deleted" } };
        }
        return { status: 404, data: { message: "Contact not found" } };

      default:
        return { status: 400, data: { message: "Invalid Contact Request" } };
    }
  },
};

export default ContactServer;