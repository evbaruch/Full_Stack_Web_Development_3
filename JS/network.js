import Server from "../Server/server.js";

const DROP_PROBABILITY = 0; // 0.2; // 20% chance of dropping the request or response
const Network = {
  sendRequest(request, data) {
    const delayToServer = Math.random() * 500 + 1000; // at least 1 second up to 1.5 seconds
    const dropProbabilityToServer = Math.random();

    setTimeout(() => {
      if (dropProbabilityToServer < DROP_PROBABILITY) {
        // 20% chance of dropping the request
        console.warn("FAJAX: Request lost in the network simulation.");
        request.readyState = 4;
        request.status = 504;
        request.responseText = JSON.stringify({
          message: "Request lost in the network simulation.",
        });
        request._triggerOnLoad();
        return;
      }

      request.readyState = 3;
      //request._triggerOnLoad();

      Server.handleRequest(request.method, request.url, data, (response) => {
        const dropProbabilityToClient = Math.random();
        const delayToClient = Math.random() * 500 + 1000; // at least 1 second up to 1.5 seconds
        setTimeout(() => {
          if (dropProbabilityToClient < DROP_PROBABILITY) {
            // // 20% chance of dropping the response
            console.warn("FAJAX: Response lost in the network simulation.");
            request.readyState = 4;
            request.status = 504;
            request.responseText = JSON.stringify({
              message: "Response lost in the network simulation.",
            });
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

export default Network;
