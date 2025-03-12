import UserServer from "../Servers/user_server.js";
import ContactServer from "../Servers/contact_server.js";

const DROP_PROBABILITY = 0.2; // 20% chance of dropping the request or response

const Network = {
  /**
   * Simulate sending a network request with potential delays and drops.
   * @param {object} request - The request object containing method, url, etc.
   * @param {object} data - The data to be sent with the request.
   */
  sendRequest(request, data) {
    const delayToServer = Math.random() * 500 + 1000; // at least 1 second up to 1.5 seconds
    const dropProbabilityToServer = Math.random();

    setTimeout(() => {
      if (dropProbabilityToServer < DROP_PROBABILITY) {
        // 20% chance of dropping the request
        console.warn("FAJAX: Request lost in the network simulation.");
        request._triggerOnLoad();
        return;
      }

      request.readyState = 3;
      request._triggerOnLoad();

      handleRequest(request.method, request.url, data, (response) => {
        const dropProbabilityToClient = Math.random();
        const delayToClient = Math.random() * 500 + 1000; // at least 1 second up to 1.5 seconds
        setTimeout(() => {
          if (dropProbabilityToClient < DROP_PROBABILITY) {
            // 20% chance of dropping the response
            console.warn("FAJAX: Response lost in the network simulation.");
            request._triggerOnLoad();
            return;
          }
          request.status = response.status;
          request.responseText = JSON.stringify(response.data);
          request.readyState = 4;
          request._triggerOnLoad();
        }, delayToClient);
      });
    }, delayToServer);
  },
};

/**
 * Handle incoming requests and route them to the appropriate server.
 * @param {string} method - The HTTP method (GET, POST, PUT, DELETE).
 * @param {string} url - The URL of the request.
 * @param {object} data - The data sent with the request.
 * @param {function} callback - The callback function to handle the response.
 */
function handleRequest(method, url, data, callback) {
  console.log(`Server received request: ${method} ${url}`, data);

  let response = { status: 400, data: { message: "Invalid Request" } };
  url = url.replace(/^https?:\/\/localhost:\d+/, "");

  if (url.startsWith("/users")) {
    response = UserServer.handleRequest(method, url, data);
  } else if (url.startsWith("/contacts")) {
    response = ContactServer.handleRequest(method, url, data);
  }

  callback(response);
}

export default Network;