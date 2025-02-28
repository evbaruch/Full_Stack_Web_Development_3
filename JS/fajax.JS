import server from "../../../server/server.js"; // TODO: Change this to the correct path

class Fajax {
  constructor() {
    this.method = null;
    this.url = null;
    this.data = null;
    this.message = null;
    this.onload = null;
    this.status = null;
    this.response = null;
  }

  open(method, url) {
    this.method = method;
    this.url = url;
  }

  send(data) {
    this.data = data;
    // Simulate server request
    const { pathname } = new URL(this.url, "http://mycontacts.com");
    const [, resource, action] = pathname.split("/");
    let response = null;

    switch (resource) {
      case "contacts":
        switch (action) {
          case "":
            if (this.method === "GET") {
              response = JSON.parse(server.getContacts());
              this.status = 200;
            } else if (this.method === "POST") {
              response = JSON.parse(server.postContact(this.data));
              this.status = 201;
            }

            // parse the response
            if (response.status == "error") {
              this.status = 404;
              this.message = response.message;
              this.response = null;
            } else {
              // this.status = 200;
              this.response = response.data;
              this.message = response.message;
            }
            break;
          default:
            let id = Number(action) ? Number(action) : 1;
            // action is not null
            if (this.method === "GET") {
              response = JSON.parse(server.getContactByName(id));
            } else if (this.method === "PUT") {
              // console.log(this.data);
              response = JSON.parse(server.putContact(id, this.data));
            } else if (this.method === "DELETE") {
              response = JSON.parse(server.deleteContact(id));
            }

            // parse the response
            if (response.status === "error") {
              this.status = 404;
              this.message = response.message;
              this.response = null;
            } else {
              this.status = 200;
              this.message = response.message;
              this.response = response.data;
            }
            break;
        }
        break;
      case "users":
        switch (action) {
          case "":
            if (this.method === "POST") {
              response = JSON.parse(server.postUser(this.data));
            }

            // parse the response
            if (response.status === "error") {
              this.status = 404;
              this.message = response.message;
              // this.response = null;
            } else {
              this.status = 200;
              // this.response = response.data;
              this.message = response.message;
            }
            break;
          default:
            // Handle error
            break;
        }
        break;
      case "auth":
        if (this.method === "GET") {
          response = JSON.parse(server.getCurrentUser());
        }
        if (this.method == "POST") {
          response = JSON.parse(server.postCurrentUser(this.data));
        }
        if (this.method == "DELETE") {
          response = JSON.parse(server.deleteCurrentUser());
        }

        // parse the response
        if (response.status === "error") {
          this.status = 404;
          this.message = response.message;
          this.response = null;
        } else {
          this.status = 200;
          this.response = response.data;
          this.message = response.message;
        }
      default:
        // Handle error
        break;
    }

    if (this.onload) {
      this.onload();
    }
  }
}

export default Fajax;