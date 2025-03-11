import DataBase from "../JS/DataBase.js";

const UserServer = {
  handleRequest(method, url, data) {
    let users = DataBase.getItem("users");
    switch (method) {
      case "GET":
        let user = DataBase.findUser(users, data.username, data.password);
        return { status: 200, data: user ? Object.values(user) : null };
      case "POST":
        const newUser = DataBase.addUser(users, data);
        return { status: 201, data: newUser };
      default:
        return { status: 400, data: { message: "Invalid User Request" } };
    }
  },
};

export default UserServer;