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
	if(!serverUrls.includes(serverUrl)){
		serverUrls.unshift(serverUrl);
		localStorage.setItem('serverUrls',serverUrls);
	}
	aria2 = new Aria2(serverUrl);
}
function updateDownloading(result){
	for(let item of result){
		let itemName = item.bittorrent.info.name;
		let itemNode = document.createElement('li');
		itemNode.innerHTML = `
	<div class='item-head'>
		<div>
			<div>${itemName}(${item.files.length}个文件)</div>
			<progress max='${item.totalLength}' value='${item.completedLength}'>${item.completedLength/item.totalLength}</progress>
		</div>
		<div>
			<div class='link-status'>seeders:<span class='seeders'>${item.numSeeders}</span>linkers:<span class='linkers'>${item.connections}</span></div>
			<div>down:<span class='speed-down'>${item.downloadSpeed}</span>up<span class='speed-up'>${item.uploadSpeed}</span></div>
		</div>
	</div>
	<div class='item-details'>
		<div class='tab-header'>
			<ul>
				<li>基本</li>
				<li>进度</li>
				<li>文件</li>
				<li>选项</li>
			</ul>
		</div>
		<div class='tab-page'>
			<div>
				gid:${item.gid}<br>
				hash:${item.infoHash}<br>
				创建日期:${Date(item.bittorrent.creationDate)}<br>
				保存目录:${item.dir}
			</div>
			<div>${item.bitfield}</div>
			<div>文件</div>
			<div>选项</div>
		</div>
	</div>
			`;
		itemNode.firstElementChild.onclick = function(){
			if(itemNode.lastElementChild.style.display === 'none')
				itemNode.lastElementChild.style.display = 'flex'
			else
				itemNode.lastElementChild.style.display = 'none';
		};
		downloadingWindow.firstElementChild.appendChild(itemNode);
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
setTimeout(()=>{
	aria2.getVersion().then(updateAria2Version);
	aria2.tellActive().then(updateDownloading);
},1000);
let globalStatInterval = window.setInterval(()=>{aria2.getGlobalStat().then(updateGlobalStat)},1000);
