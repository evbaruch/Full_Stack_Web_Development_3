import DataBase from "../JS/DataBase.js";

const UserServer = {
  /**
   * Handle incoming requests and route them to the appropriate database operations.
   * @param {string} method - The HTTP method (GET, POST).
   * @param {string} url - The URL of the request.
   * @param {object} data - The data sent with the request.
   * @returns {object} - The response object containing status and data.
   */
  handleRequest(method, url, data) {
    let users = DataBase.getItem("users");
    switch (method) {
      case "GET":
        // Find a user with the provided username and password
        let user = DataBase.findUser(users, data.username, data.password);
        return { status: 200, data: user ? Object.values(user) : null };
      case "POST":
        // Add a new user with the provided data
        const newUser = DataBase.addUser(users, data);
        return { status: 201, data: newUser };
      default:
        // Return an error for invalid requests
        return { status: 400, data: { message: "Invalid User Request" } };
    }
  },
};

export default UserServer;