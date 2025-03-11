import DataBase from "../JS/DataBase.js";

const ContactServer = {
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
            const contacts = DataBase.getContacts(userId);
            return { status: 200, data: contacts };
          } else if (parts[3] === "search") {
            const contacts = DataBase.searchContacts(userId, data.search);
            return { status: 200, data: contacts };
          }
        }
        return { status: 404, data: { message: "User not found" } };

      case "POST":
        const newContact = DataBase.addContact(data.userID, data);
        return { status: 201, data: newContact };

      case "PUT":
        const updatedContact = DataBase.updateContact(data.userID, parts[3], data);
        if (updatedContact) {
          return { status: 200, data: updatedContact };
        }
        return { status: 404, data: { message: "Contact not found" } };

      case "DELETE":
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