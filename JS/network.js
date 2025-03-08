import Server from "../Server/server.js";

const Network = {
  sendRequest(request, data) {
    const delay = Math.random() * 2000 + 1000;
    const dropProbability = Math.random();

    setTimeout(() => {
      if (dropProbability < 0.2) {
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
        request.status = response.status;
        request.responseText = JSON.stringify(response.data);
        request.readyState = 4;
        request._triggerOnLoad();
      });
    }, delay);
  },
};

export default Network;
