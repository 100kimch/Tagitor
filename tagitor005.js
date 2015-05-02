var guide = "Put texts here.";
document.getElementById('textEditor').innerText = guide;

layout();
function layout(){
	var pDiv = window.innerWidth;
	var mainEditor = document.getElementById('mainEditor');
	var textEditor = document.getElementById('textEditor');
	
	mainEditor.style.width = pDiv *  0.6  - 100 - 80  - 10 + 'px';
	textEditor.style.width = pDiv * 0.4 + 'px';
}

//window.onload = setInterval("layout()", 2000);
//window.onload = layout();
//setInterval("check()", 100);

var raw;
var toggleBar = {  numbering: false, showing: false, font: true };

//스타일 저장변수
var numbering = new Array();

//Print
document.getElementById('textEditor').addEventListener("keyup", function() {
	//TODO: 사이즈 정확히 하기
	if(!toggleBar.showing)
		toggleBar.showing = showBar();
	
	if(toggleBar.numbering){
		//http://stackoverflow.com/questions/13486479/how-to-get-an-array-of-unique-values-from-an-array-containing-duplicates-in-java
		numbering = numbering.reverse().filter(function(e, i, arr){
			return arr.indexOf(e, i+1) === -1;
		}).reverse();
		for(var i = 0; i<6; ++i){
			var nListBox = document.getElementById('nBox1'+i);
			nListBox.innerText = numbering[i] ? numbering[i] : '';
		}
	}
	
	raw = preview(document.getElementById('textEditor').innerText);
}, true);

/*
document.getElementById('mainEditor').addEventListener("click", function(){
	
});
*/

function preview(raw){
	var mainEditor = document.getElementById('mainEditor');
	
	mainEditor.innerHTML ='';

	//raw =  (((raw).replace(/\&/g, '&amp')).replace(/\</g, '&lt')).replace(/\>/g,'&gt');

	var contents = raw.split(/\n/gi);
	var contentsTag = raw.split(/\n/gi);
	
	var jhTag = /\[*\]/;
	var jhUl = /^\-|^\=|^\*/;
	var jhOl = /\d\.\d\.\d\.|\d\.\d\.|\d\.|\(\d\)|\d\)|\[\d\]|\d\]|\/\d\//;
	var jhClock = /\d\:\d\d|\d\:|\d시/;
	var jhLetter = /^to\.|에게$|께$|님$/i;
	
	var offset = -1;
	
	toggleBar.numbering = false;
	numbering.length = 0;
	
	for(var key in contents){
		//contents[key].substr(0, 1)
		contentsTag[key] = 'h5';
		if(key == 0 & contents[key].length  < 30){
			contentsTag[key] = 'h1';
		}
		if(contentsTag[key - 1] == 'ol' || contentsTag[key - 1] == 'ul'){
			contentsTag[key] = 'h4';
		}
		if(jhUl.test(contents[key])){
			contentsTag[key] = 'ul';
			numbering.push(contents[key].match(jhUl));
		}else if(jhClock.test(contents[key])){
			contentsTag[key] = 'li';
		}else if(jhLetter.test(contents[key])){
			contentsTag[key] = 'h3';
		}else if(jhOl.test(contents[key])){
			contentsTag[key] = 'ol';
			toggleBar.numbering = true;
			var olNum = contents[key].match(jhOl)[0].replace(/\d/g, '1');
			numbering.push(olNum);
		}
		
		// set includes tag and contents
		var set = document.createElement('div');
		set.id = 'set' + key;
		set.className = 'jh' + contentsTag[key];
			
		// left tag showing contents' property
		var con_tag = document.createElement('div');
		//con_tag.id = 'con_tag' + key;
		con_tag.className = 'tag';
		con_tag.innerText = translateToKor(contentsTag[key]);
		
		// contents on mainEditor
		var con = document.createElement(contentsTag[key]);
		//con.id = 'jh' + key;
		con.className = 'contents';
		con.innerText = contents[key];
		
		//set includes tag and edit bar
		var edit_set = document.createElement('div');
		edit_set.id = 'edit_set' + key;
		edit_set.style.display = 'none';
		
		// left tag showing edit bar's property
		var edit_tag = document.createElement('div');
		//edit_tag.id = 'edit_tag' + key;
		edit_tag.className = 'tag';
		edit_tag.innerText = '수정';
		
		// live edit bar
		var edit = document.createElement('div');
		//edit.id = 'edit' + key;
		edit.className = 'editbar';
		//edit.style.display = 'none';
		
		mainEditor.appendChild(set);
			set.appendChild(con_tag);
			set.appendChild(con);
			set.appendChild(edit_set);
				edit_set.appendChild(edit_tag)
				edit_set.appendChild(edit);
		
		
		
		document.getElementById('set' + key).addEventListener("click", function(){
			var jhIndex = this.id.split('set')[1];
			var edit = document.getElementById('edit_set' + jhIndex);
			
			if(edit.style.display == 'none'){
				edit.style.display = 'block';
			}

			alignTag(contentsTag);
			
			// hide edit bar when clicking other element
			document.body.addEventListener("click", function(){
				edit.style.display = 'none';
				alignTag(contentsTag);
			}, true);

		}, true);
	}
	
	editbar(contents, contentsTag);
	alignTag(contentsTag);
	
	return raw;
}

function translateToKor(Eng){
	var set = {
		'h1':	'제목',
		'h2':	'내용',
		'h3':	'시간',
		'h4':	'내용',
		'h5':	'단락',
		'ul':	'단원',
		'ol':	'목록',
		'li':		'리스트'
	};
	return set[Eng];
}

function editbar(contents, contentsTag){

	var k = 0;		

	while(document.getElementById('edit_set' + k)){
		(function(){
			var j = k;

			var index = document.getElementById('edit'+j);
			var mainEditor = document.getElementById('mainEditor');
			//console.log(document.getElementById('edit' + jhIndex));
			
			if(contentsTag[j] == "h1"){
				editFontSize(j, contents, contentsTag);

			}
			
			if(contentsTag[j] == "h5"){
				editFontSize(j, contents, contentsTag);

			}
			
			if(contentsTag[j] == "ol"){
				editLiStyle(j);
			}
		}(k));
		++k;
	}
}

function editFontSize(j, contents, contentsTag){
	for(var i = 0; i < 5; ++i){
		var index = document.querySelector('#edit_set'+j+'>.editbar');
		var mainEditor = document.getElementById('mainEditor');
	
		var box0 = document.createElement('button');
		box0.className = 'box0';
		box0.id = 'box0'+j+i;
		//px 자르기 위해 parseInt 써줌
		//원래는 mainEditor.clientWidth =-10이나 오차
		box0.style.width = parseInt(mainEditor.clientWidth - 12) * 0.2  - 10 + 'px';
		
		var box1 = document.createElement('div');
		box1.className = 'box1';
		box1.id = 'box1'+j+i;
		box1.innerText = contents[j].substring(0, 12);
		box1.style.fontSize = 14 + i * 4 + 'pt';

		var box2 = document.createElement('div');
		box2.className = 'box2';
		box2.innerText = box1.style.fontSize;
		
		index.appendChild(box0);
			box0.appendChild(box1);
			box0.appendChild(box2);
		
		(function(j, i){
			document.getElementById('box0'+j+i).addEventListener("click", function(){
				document.querySelector('#set'+j+'>.contents').style.fontSize =
					document.getElementById('box1'+j+i).style.fontSize;
				
				alignTag(contentsTag);
			}, true);
		}(j, i, contents, contentsTag));

		
	}
}

function editLiStyle(j){
	var index = document.querySelector('#edit_set'+j+'>.editbar');
	var mainEditor = document.getElementById('mainEditor');
	
	var box0 = document.createElement('textarea');
	box0.className = 'box0';
	box0.id = 'box0'+j;
	box0.style.width = 50 + 'px';
	box0.innerText ='hi';
	
	index.appendChild(box0);
}

function alignTag(contentsTag){
	var sSet, lSet;
	var i, j;
	var sTag = {1:'ol', 2:'ul'};
	
	for(key in sTag){
		i = contentsTag.indexOf(sTag[key], 0);

		while(i !== -1){
			sSet = lSet = document.querySelector('#set'+i);
			
			var j = i + 1;
			while(contentsTag[j] == 'h4'){
				lSet = document.querySelector('#set'+j);
				++j;
			}
			
			document.querySelector('#set' +i+ '>.tag').style.height = 
				lSet.offsetHeight + getAbsolutePos(lSet).y - getAbsolutePos(sSet).y + 'px';
			
			i = contentsTag.indexOf(sTag[key], i+1);
		}
	}
	
	
	i = contentsTag.indexOf('h1', 0);
	while(i !== -1){
		sSet = document.querySelector('#set'+i);
		lSet = document.querySelector('#set'+contentsTag.indexOf('h1', i+1));

		if(lSet == null)
			lSet = document.querySelector('#set' + (contentsTag.length - 1));
		
		document.querySelector('#set' +i+ '>.tag').style.height = 
			lSet.offsetHeight + 10 + getAbsolutePos(lSet).y - getAbsolutePos(sSet).y + 'px';
		
		i = contentsTag.indexOf('h1', i+1);
	}
}

function onKeyDown(){
	if(event.keyCode == 9){
		event.returnValue = false;
		event.preventDefault();
	}
}

setNumbering();
function setNumbering() {
	var bar = document.getElementById('toolBar');
	var nBar = document.getElementById('numberingBar');
	nBar.innerText ='';
	//nbar.style.display = 'block';

	var nTag = document.createElement('div');
	nTag.id = 'numberingTag';
	nTag.style.float = 'left';
	nTag.innerText = '목록 수정';
	
	var nListBox0 = document.createElement('div');
	nListBox0.id = 'numberingBox';
	nListBox0.style.float = 'left';
	
	nBar.appendChild(nTag)
	nBar.appendChild(nListBox0);

	for(var i =0; i<6; ++i){
		var nListBox1 = document.createElement('div');
		nListBox1.className = 'nBox1';
		nListBox1.id = 'nBox1'+i;
		nBar.appendChild(nListBox1);
	}	
	
}

setFont();
function setFont() {
	var bar = document.getElementById('toolBar');
	var fBar = document.getElementById('fontBar');
	bar.innerText = '';
	
	var tag = document.createElement('div');
	tag.id = 'fontTag';
	tag.innerText = '폰트 수정';
	
	fBar.appendChild(tag);
}

function showSubBar(str){
	var bar = document.getElementById(str);
	
	setTimeout(function(bar){
		bar.opacity = 1;
	}, 1500);
}

function showBar(){
	toggleBar.showing = true;
	if(toggleBar.numbering || toggleBar.font)
		showToolBar();
	else
		hideToolBar();
	
	if(document.getElementById('textEditor').innerText !== guide){
		toggleBar.font = true;
		showSubBar('fontBar');
	}
		
	if(toggleBar.numbering)
		showSubBar('numberingBar');
	if(!toggleBar.numbering)
		hideNumbering();
	
	return false;
}

function showToolBar(){
	setTimeout(function(){
		toolBar.style.height = '49px';
		window.scrollTo(0, getAbsolutePos(toolBar).y);
	}, 500);
}

function hideNumbering(){
	var nbar = document.getElementById('numberingBar');

		//bar.style.display = 'none';
		//document.getElementById('numberingBar').style.display = 'none';
	nbar.style.opacity = 0;
	window.scrollTo(0, 0);
}

function hideToolBar(){
	var bar = document.getElementById('toolBar');
	setTimeout(function(){
		bar.style.height = '0px';
	}, 500);
	window.scrollTo(0, 0);
}

// to select texts in div
//http://stackoverflow.com/questions/4578398/selecting-all-text-within-a-div-on-a-single-left-click-with-javascript
function selectAll(el) {
    if (typeof window.getSelection != "undefined" && typeof document.createRange != "undefined") {
        var range = document.createRange();
        range.selectNodeContents(el);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    } else if (typeof document.selection != "undefined" && typeof document.body.createTextRange != "undefined") {
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(el);
        textRange.select();
    }
}

function getAbsolutePos(obj) {
	var position = new Object;
	position.x = 0;
	position.y = 0;
	if( obj ) {
		position.x = obj.offsetLeft + obj.clientLeft;
		position.y = obj.offsetTop + obj.clientTop;
		if( obj.offsetParent ) {
			var parentpos = getAbsolutePos(obj.offsetParent);
			position.x += parentpos.x;
			position.y += parentpos.y;
		}
	}
	return position;
}

function getAbsoluteLeft(node){
	var iLeft=0;
	while(node.tagName!="BODY"){
		iTop += node.offsetLeft;
		node = node.offsetParent;
	}
	return iLeft;
}



/*
function getCaret(node) {
	if (node.selectionStart) {
			return node.selectionStart;
	} else if (!document.selection) {
	return 0;
	}

	var c = "\001",
	sel = document.selection.createRange(),
	dul = sel.duplicate(),
	len = 0;

	dul.moveToElementText(node);
	sel.text = c;
	len = dul.text.indexOf(c);
	sel.moveStart('character',-1);
	sel.text = "";
	return len;
}
*/

/*
window.addEventListener("load", function() {
	var input = document.getElementById('textEditor');
	var output = document.getElementById('mainEditor');
	
	input[0].addEventListener ("keydown", function() {
		preview();
		//to change caret: this.selectionStart = 2;
	
	}, false);
	
	output[0].addEventListener ("keydown", function() {
		
	})
	
}, false);
*/