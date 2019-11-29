let pattern = /(.*:\/\/)(.*)@(.*)/;
function getAuth(url){
	return url.replace(pattern,"$2");
}
function removeAuth(url){
	return url.replace(pattern,"$1$3");
}
function Aria2(url){
	this.url = removeAuth(url);
	this.auth = getAuth(url);
	if(url.endsWith('jsonrpc')){
		this.rpcClient = new JsonRPC(this.url);
	}
}
let systemMethods = ['multicall','listMethods','listNotifications'];
for(let method of systemMethods){
	Aria2.prototype[method] = function(){
		return this.rpcClient.call('system.'+method,[...arguments]);
	}
}
let aria2Methods = ['addUri','addTorrent','addMetalink','remove','forceRemove','pause','pauseAll','forcePause','forcePauseAll','unpause','unpauseAll','tellStatus','getUris','getFiles','getPeers','getServers','tellActive','tellWaiting','tellStopped','changePosition','changeUri','getOption','changeOption','getGlobalOption','changeGlobalOption','getGlobalStat','purgeDownloadResult','removeDownloadResult','getVersion','getSessionInfo','shutdown','forceShutdown','saveSession'];
for(let method of aria2Methods){
	Aria2.prototype[method] = function(){
		return this.rpcClient.call('aria2.'+method,[this.auth].concat([...arguments]));
	}
}
