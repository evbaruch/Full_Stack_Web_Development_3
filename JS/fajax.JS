import Network from "./network.js";

class FXMLHttpRequest {
    constructor() {
        this.readyState = 0;
        this.status = 0;
        this.responseText = "";
        this.onload = null;
    }

    /**
     * Initialize a request.
     * @param {string} method - The HTTP method (GET, POST, PUT, DELETE).
     * @param {string} url - The URL of the request.
     */
    open(method, url) {
        this.method = method;
        this.url = url;
        this.readyState = 1;
        this._triggerOnLoad();
    }

    /**
     * Send the request with optional data.
     * @param {object} data - The data to be sent with the request.
     */
    send(data = null) {
        this.readyState = 2;
        this._triggerOnLoad();

        Network.sendRequest(this, data);
    }

    /**
     * Trigger the onload event if it is defined.
     * This method simulates the onload event of a real XMLHttpRequest.
     */
    _triggerOnLoad() {
        if (this.onload) {
            this.onload();
        }
    }
}

export default FXMLHttpRequest;