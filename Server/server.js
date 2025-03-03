const Server = {
    handleRequest(method, url, data, callback) {
        console.log(`Server received request: ${method} ${url}`, data);
        
        let response = { status: 200, data: { message: "Response from server" } };
        callback(response);
    }
};