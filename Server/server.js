const Server = {
    handleRequest(method, url, data, callback) {
        console.log(`Server received request: ${method} ${url}`, data);
        
        let response = { status: 400, data: { message: "Invalid Request" } };
        
        if (url.startsWith("/users")) {
            response = UserDB.handleRequest(method, url, data);
        } else if (url.startsWith("/contacts")) {
            response = ContactDB.handleRequest(method, url, data);
        }
        
        callback(response);
    }
};

// User Database
const UserDB = {
    handleRequest(method, url, data) {
        let users = JSON.parse(localStorage.getItem("users")) || [];
        
        if (method === "GET") {
            return { status: 200, data: users };
        } else if (method === "POST") {
            users.push(data);
            localStorage.setItem("users", JSON.stringify(users));
            return { status: 201, data: data };
        }
        return { status: 400, data: { message: "Invalid User Request" } };
    }
};

// Contact Database
const ContactDB = {
    handleRequest(method, url, data) {
        let contacts = JSON.parse(localStorage.getItem("contacts")) || [];
        
        if (method === "GET") {
            const parts = url.split("/");
            if (parts.length === 3 && parts[2] === "all") {
                return { status: 200, data: contacts };
            } else if (parts.length === 3) {
                const userContacts = contacts.filter(c => c.userId === parts[2]);
                return { status: 200, data: userContacts };
            }
        } else if (method === "POST") {
            contacts.push(data);
            localStorage.setItem("contacts", JSON.stringify(contacts));
            return { status: 201, data: data };
        } else if (method === "PUT") {
            const index = contacts.findIndex(c => c.id === data.id);
            if (index !== -1) {
                contacts[index] = data;
                localStorage.setItem("contacts", JSON.stringify(contacts));
                return { status: 200, data: data };
            }
            return { status: 404, data: { message: "Contact not found" } };
        } else if (method === "DELETE") {
            const filteredContacts = contacts.filter(c => c.id !== data.id);
            if (filteredContacts.length !== contacts.length) {
                localStorage.setItem("contacts", JSON.stringify(filteredContacts));
                return { status: 200, data: { message: "Contact deleted" } };
            }
            return { status: 404, data: { message: "Contact not found" } };
        }
        return { status: 400, data: { message: "Invalid Contact Request" } };
    }
};

export default Server;