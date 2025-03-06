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
        let users = JSON.parse(localStorage.getItem("users")) || {};
        
        if (method === "GET") {
            return { status: 200, data: Object.values(users) };
        } else if (method === "POST") {
            const userId = Date.now().toString();
            users[userId] = { id: userId, ...data };
            localStorage.setItem("users", JSON.stringify(users));
            return { status: 201, data: users[userId] };
        }
        return { status: 400, data: { message: "Invalid User Request" } };
    }
};

// Contact Database
const ContactDB = {
    handleRequest(method, url, data) {
        let contacts = JSON.parse(localStorage.getItem("contacts")) || {};
        
        if (method === "GET") {
            const parts = url.split("/");
            if (parts.length === 4 && parts[2] !== "all") {
                const userId = parts[2];
                if (userId !== data.currentUser) {
                    return { status: 403, data: { message: "Access denied" } };
                }
                return { status: 200, data: contacts[userId] || [] };
            }
        } else if (method === "POST") {
            if (!contacts[data.userId]) contacts[data.userId] = [];
            contacts[data.userId].push(data);
            localStorage.setItem("contacts", JSON.stringify(contacts));
            return { status: 201, data: data };
        } else if (method === "PUT") {
            if (!contacts[data.userId]) return { status: 404, data: { message: "User not found" } };
            const index = contacts[data.userId].findIndex(c => c.id === data.id);
            if (index !== -1) {
                contacts[data.userId][index] = data;
                localStorage.setItem("contacts", JSON.stringify(contacts));
                return { status: 200, data: data };
            }
            return { status: 404, data: { message: "Contact not found" } };
        } else if (method === "DELETE") {
            if (!contacts[data.userId]) return { status: 404, data: { message: "User not found" } };
            const initialLength = contacts[data.userId].length;
            contacts[data.userId] = contacts[data.userId].filter(c => c.id !== data.id);
            if (contacts[data.userId].length !== initialLength) {
                localStorage.setItem("contacts", JSON.stringify(contacts));
                return { status: 200, data: { message: "Contact deleted" } };
            }
            return { status: 404, data: { message: "Contact not found" } };
        }
        return { status: 400, data: { message: "Invalid Contact Request" } };
    }
};

export default Server;