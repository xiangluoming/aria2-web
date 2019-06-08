let newDownloadWindow = document.querySelector('section.new-download')
let downloadingWindow = document.querySelector('section.downloading')
let downloadedWindow = document.querySelector('section.downloaded')
let deletedWindow = document.querySelector('section.deleted')
let settingWindow = document.querySelector('section.setting')
document.querySelector('nav .new-download').onclick = function(){
	for(let section of document.querySelectorAll('main section')){
		section.style.display = 'none';
	}
	newDownloadWindow.style.display = 'block';
}
document.querySelector('nav .downloading').onclick = function(){
	for(let section of document.querySelectorAll('main section')){
		section.style.display = 'none';
	}
	downloadingWindow.style.display = 'block';
}
document.querySelector('nav .downloaded').onclick = function(){
	for(let section of document.querySelectorAll('main section')){
		section.style.display = 'none';
	}
	downloadedWindow.style.display = 'block';
}
document.querySelector('nav .deleted').onclick = function(){
	for(let section of document.querySelectorAll('main section')){
		section.style.display = 'none';
	}
	deletedWindow.style.display = 'block';
}
document.querySelector('nav .setting').onclick = function(){
	for(let section of document.querySelectorAll('main section')){
		section.style.display = 'none';
	}
	settingWindow.style.display = 'block';
}
if(!localStorage.getItem('serverUrls'))
	localStorage.setItem('serverUrls','ws://localhost:6800/jsonrpc');
let serverUrls = localStorage.getItem('serverUrls').split(',');
let datalist = document.querySelector('#historyUrl');
for(let url of serverUrls){
	let option = document.createElement('option');
	option.innerText = url;
	datalist.appendChild(option);
}
let aria2 = new Aria2(serverUrls[0]);
let inputUrl = document.querySelector('#server-url');
inputUrl.value = serverUrls[0];
document.querySelector('section.setting button').onclick = function(){
	let serverUrl = inputUrl.value;
	if(!(serverUrl in serverUrls)){
	serverUrls.unshift(serverUrl);
	localStorage.setItem('serverUrls',serverUrls);
	}
	aria2 = new Aria2(serverUrl);
}
function updateDownloading(result){
	for(let item of result){
	}
}
function updateGlobalStat(result){
	document.querySelector('#global-speed-up').textContent = result.uploadSpeed;
	document.querySelector('#global-speed-down').textContent = result.downloadSpeed;
}

function updateAria2Version(result){
	let aria2Version = document.querySelector('#aria2-version');
	aria2Version.textContent = result.version;
	aria2Version.title = 'enabledFeatures: '+result.enabledFeatures.toString();
}
setTimeout(()=>{aria2.getVersion()},1000);
let globalStatInterval = window.setInterval(()=>{aria2.getGlobalStat()},1000);
