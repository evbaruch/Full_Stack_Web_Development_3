import Network from "../JS/Network.js";

class FXMLHttpRequest {
  constructor() {
      this.readyState = 0;
      this.status = 0;
      this.responseText = "";
      this.onload = null;
  }

  open(method, url) {
      this.method = method;
      this.url = url;
      this.readyState = 1;
      //this._triggerOnLoad();// why is this here?
  }

  send(data = null) {
      this.readyState = 2;
      //this._triggerOnLoad();
      
      Network.sendRequest(this, data);
  }

  _triggerOnLoad() {
      if (this.onload) {
          this.onload();
      }
  }
}

export default FXMLHttpRequest;