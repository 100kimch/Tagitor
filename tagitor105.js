var guide = "Put texts here.";
document.getElementById('textEditor').innerText = guide;

layout();
function layout(){
	var pScrWidth = screen.availWidth;
	var pScrHeight = screen.availHeight;
	var pDiv = window.innerWidth;
	var container = document.getElementById('container');
	var mainEditor = document.getElementById('mainEditor');
	var textEditor = document.getElementById('textEditor');
	
	container.style.width = pDiv - 40 - 17 + 'px';
	var pWidth = pDiv * 0.6;
	mainEditor.style.width = pWidth + 'px';
	mainEditor.style.height = pScrHeight / pScrWidth * pWidth + 'px';
	mainEditor.style.marginLeft = pDiv * 0.2 + 'px';
	textEditor.style.width = '100%';
	
}