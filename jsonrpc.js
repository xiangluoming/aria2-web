function JsonRPC(url){
	this.url = url;
	let protocol = url.slice(0,url.indexOf(':'));
	if(protocol === "ws"){
		this.session = new WebSocket(url);
	}
	this.session.onmessage = e => {this.onmessage(e);}
	this.call = function(method,params){
		let request = {
			'jsonrpc': '2.0',
			'id': method,
			'method': method,
			'params': params
		};
		this.session.send(JSON.stringify(request));
	}
}
