function JsonRPC(url){
	this.url = url;
	let protocol = url.slice(0,url.indexOf(':'));
	this.session = new WebSocket(url);
	let requestID = 0;
	this.requests = {};
	this.session.onmessage = e => {
		let response = JSON.parse(e.data);
		this.requests[response.id](response.result);
		delete this.requests[response.id];
	}
	this.call = (method, params) => new Promise(resolve => {
		let request = {
			'jsonrpc': '2.0',
			'id':requestID,
			'method': method,
			'params': params
		};
		this.session.send(JSON.stringify(request));
		this.requests[requestID] = resolve;
		++requestID;
	});
}
