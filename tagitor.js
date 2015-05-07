/* String Variables
It's a temporary state.
XML will substitute these.
*/
var guide = "<div>Put texts here.</div>"
var tagname = {
	'h1': '제목',
	'h2': '내용',
	'h3': '시간',
	'h4': '내용',
	'h5': '단락',
	'ul':	'단원',
	'ol':	'목록',
	'li': '리스트'
}
var raw, texts;
var toggle = { "bar": [
	{name: "main", now: false, req: false},
	{name: "font", now: false, req: false},
	{name: "numbering", now: false, req: false},
	{name: "table", now: false, req: false},
	{name: "graph", now: false, req: false},
	{name: "image", now: false, req: false},
	{name: "formula", now: false, req: false}
]};
var jhTag = {
	'jhTitle':	'제목',
	'jhNorm':	'내용',
	'h3':	'시간',
	'h4':	'내용',
	'h5':	'단락',
	'jhUl':	'단원',
	'jhOl':	'목록',
	'li':		'리스트'
}

var numbering = new Array();
var jh = {
	"Tag": /\[*\]/,
	"Ul": /^\-|^\=|^\*/,
	"Ol":/\d\.\d\.\d\.|\d\.\d\.|\d\.|\(\d\)|\d\)|\[\d\]|\d\]|\/\d\//,
	"Clock":/\d\:\d\d|\d\:|\d시/,
	"Letter":/^to\.|에게$|께$|님$/i,
};

//Executions
onToolBar("focus", 1);
onToolBar("mouseover", 1);
onToolBar("focusout", 0.7);
onToolBar("mouseout", 0.7);


//Setting Layout
document.getElementById('textEditor').innerHTML = guide;

layout();
function layout(){
	var pDiv = window.innerWidth;
	var mainEditor = document.getElementById('mainEditor');
	var textEditor = document.getElementById('textEditor');
	
	mainEditor.style.width = pDiv * 0.6 - 100 - 80 - 10 + 'px';
	textEditor.style.width = pDiv * 0.4 + 'px';
}

//functions
function setTag(editor){
	var selected = getSelectionContainerElement();
	
	selected.className = ' jhNorm';
	
	function setTag(tag){
		selected.className = ' ' + tag;
	}
	
	function addTag(tag){
		selected.className += ' ' + tag;
	}
	
	function removeTag(tag){
		selected.className = selected.className.replace(' ' + tag, '');
	}
	
	//console.log(selected, selected.previousSibling);
	
	if(!selected.previousSibling || selected.innerText < 30){
		setTag('jhTitle');
	}else{
		removeTag('jhTitle');
	}
	if(jh.Ol.test(selected.innerHTML)){	
		setTag('jhUl');
		toggle.bar[2].req = true;
	}
	if(jh.Ul.test(selected.innerHTML)){
		setTag('jhOl');
		toggle.bar[2].req = true;
	}
	if(jh.Clock.test(selected.innerHTML)){
		setTag('jhClock');
	}
	
		//var node = document.getSelection().anchorNode();
	
	//console.log(getSelectionContainerElement(),
	//getSelectionContainerElement().nextElementSibling);
	
	/*
	try{
		console.log(getSelectionContainerElement().previousSibling.previousSibling);
	}catch(e){
		console.log('There is no sibling node');
	}
	*/
}

function onToolBar(event, opacity){
	var toolBar = document.getElementById('toolBar');
	
	toolBar.addEventListener(event, function(){
		document.getElementById('toolBar').style.opacity = opacity;
	}, true);
}

function checkToggle(){
	for(var key in toggle.bar){
		if(toggle.bar[key].now !== toggle.bar[key].req){
			if(toggle.bar[key].now){
				hideBar(toggle.bar[key]);
			} else {
				showBar(toggle.bar[key]);
			}
		}
	}
	
	
	if(numbering){
		//http://stackoverflow.com/questions/13486479/how-to-get-an-array-of-unique-values-from-an-array-containing-duplicates-in-java
		numbering = numbering.reverse().filter(function(e, i, arr){
			return arr.indexOf(e, i+1) === -1;
		}).reverse();
		for(var i = 0; i<6; ++i){
			var nListBox = document.getElementById('nBox1'+i);
			nListBox.innerText = numbering[i] ? numbering[i] : '';
		}
	}
}

function preview(texts){
	var mainEditor = document.getElementById('mainEditor');
	
	var text =
		texts.replace(/\<\/div\>/gi, '</div>##SP').replace('<br>', '').split(/##SP/gi);
	
	
	mainEditor.innerHTML = '';
	//raw =  (((raw).replace(/\&/g, '&amp')).replace(/\</g, '&lt')).replace(/\>/g,'&gt');
	
	for (var key in text)
		setLine(text[key]);
	
}

function setLine(text){
	var mainEditor = document.getElementById('mainEditor');
	var selectedTag = text.substring(text.indexOf('\"', text.indexOf('class')) + 2,
		text.indexOf('\"', text.indexOf('\"', text.indexOf('class')) + 1));
	
	var set = document.createElement('div');
	set.className = selectedTag;
	
	var tag = document.createElement('div');
	tag.className = 'tag';
	tag.innerText  = jhTag[selectedTag.substring(0, 7)];
	
	mainEditor.appendChild(set);
		set.appendChild(tag);
		set.innerHTML += text;
}

//TODO: Edit functions below.

function setEvent(contentsTag, key){
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

//TODO: 최적화할 것
function editBar(contents, contentsTag){
	var k = 0;
	
	while(document.getElementById('edit_set' + k)){
		(function(){
			var j = k;
			
			var index = document.getElementById('edit'+j);
			var mainEditor = document.getElementById('mainEditor');
			
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
	for(var i=0; i<5; ++i){
		var index = document.querySelector('#edit_set'+j+'>.editbar');
		var mainEditor = document.getElementById('mainEditor');
		var fontSize = 10 + i * 4;
			
		var box0 = document.createElement('button');
		box0.className = 'box0';
		box0.id = 'box0'+j+i;
		//px 자르기 위해 parseInt 써줌
		//원래는 mainEditor.clientWidth = -10이나 오차
		box0.style.width = 
			parseInt(mainEditor.clientWidth - 12) * 0.2 - 10 + 'px';
		
		var box1 = document.createElement('div');
		box1.className = 'box1';
		box1.id = 'box1' +j+i;
		box1.innerText = contents[j].substring(0, 12);
		box1.style.fontSize = fontSize + 'pt';
		
		var box2 = document.createElement('div');
		box2.className = 'box2';
		box2.innerText = box1.style.fontSize;
		
		index.appendChild(box0);
			box0.appendChild(box1);
			box0.appendChild(box2);
			
		(function(j, i){
			document.getElementById('box0'+j+i)
				.addEventListener("click", function(){
			
				document.querySelector('#set'+j+'>.contents').style.fontSize = 
					fontSize + 'pt';
					
				document.querySelector('#set'+j+'>.tag').style.height =
				document.querySelector('#set'+j+'>.contents').style.height = 
					fontSize + 10 + 'px';
					
				alignTag(contentsTag);
					
				}, true)
		} (j, i, contents, contentsTag));
		
	}
}

function editLiStyle(j){
	var index = document.querySelector('#edit_set'+j+'>.editbar');
	var mainEditor = document.getElementById('mainEditor');
	
	var box0 = document.createElement('textarea');
	box0.className = 'box0';
	box0.id = 'box0'+j;
	box0.style.width = 50 + 'px';
	box0.innerText = 'hi';
	
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
		
		addCell();
	}
	
	if(event.keyCode==13){
		rawToData(document.getElementById('textEditor'));
	}
}

function addCell(){
	function setTable(){
		var cell = document.createElement('div');
		cell.className = 'cell';
		
		
	}
}

setMainBar();
function setMainBar(){
	var bar = document.getElementById('toolBar');
	var mBar = document.getElementById('main');
	mBar.innerText ='';
	
	var tag = document.createElement('div');
	tag.id = 'mainTag';
	tag.className = 'subTag';
	tag.innerText = '일반';
	
	var box0 = document.createElement('div');
	box0.id='File';
	box0.className = 'subBox';
	box0.style.float = 'left';
	
	var box00 = document.createElement('div');
	box00.className = 'subTitle';
	box00.innerText = '파일명: ';
	box00.style.float = 'left';
	
	var box01 = document.createElement('input');
	box01.type = 'text'
	box01.name = 'FileName';
	box01.style.float = 'left';
	
	var box1 = document.createElement('button');
	box1.id = 'Add';
	box1.className = 'subButton';
	box1.innerText = 'Add features..';
	box1.style.float = 'left';
	
	var box2 = document.createElement('button');
	box2.id = 'Login';
	box2.className = 'subButton';
	box2.innerText = 'Login';
	box2.style.float = 'left';
	
	var box3 = document.createElement('button');
	box3.className = 'subButton';
	box3.innerText = 'Save';
	box3.style.float = 'left';
	
	mBar.appendChild(tag);
	mBar.appendChild(box0);
		box0.appendChild(box00);
		box0.appendChild(box01);
	mBar.appendChild(box1);
	mBar.appendChild(box2);
	mBar.appendChild(box3);
}

setNumberingBar();
function setNumberingBar(){
	var bar = document.getElementById('toolBar');
	var nBar = document.getElementById('numbering');
	nBar.innerText ='';
	//nbar.style.display = 'block';

	var nTag = document.createElement('div');
	nTag.id = 'numberingTag';
	nTag.className = 'subTag';
	nTag.style.float = 'left';
	nTag.innerText = '목록 수정';
	
	nBar.appendChild(nTag);

	for(var i =0; i<6; ++i){
		var nListBox0 = document.createElement('textarea');
		nListBox0.id = 'nBox1'+i;
		
		nBar.appendChild(nListBox0);
		
		//if(i!==5){
		var nListBox1 = document.createElement('div');
		nListBox1.className = 'addButton';
		nBar.appendChild(nListBox1);
		//}
	}
}

setFont();
function setFont() {
	var bar = document.getElementById('toolBar');
	var fBar = document.getElementById('font');
	fBar.innerText = '';
	
	var tag = document.createElement('div');
	tag.id = 'fontTag';
	tag.className = 'subTag';
	tag.innerText = '폰트 수정';
	
	var box01 = document.createElement('div');
	box01.id = 'fontColors';
	box01.className = 'subBox';
	box01.style.float = 'left';
	
	var box010 = document.createElement('div');
	box010.className = 'subTitle';
	box010.innerText = '색: ';
	box010.style.float = 'left';
	
	var box02 = document.createElement('div');
	box02.id = 'fontSize';
	box02.className = 'subBox';
	box02.style.float = 'left';
	
	var box020 = document.createElement('div');
	box020.className = 'subTitle';
	box020.innerText = 'Size: ';
	box020.style.float = 'left';
	
	var box021 = document.createElement('div');
	box021.className = 'subBox';
	
	
	fBar.appendChild(tag);
	fBar.appendChild(box01);
		box01.appendChild(box010);
	fBar.appendChild(box02);
		box02.appendChild(box020);
		box02.appendChild(box021);
	
	for(var i = 1; i < 10; ++i){
		var box011 = document.createElement('button');
		box011.className = 'subColor';
		box011.style.backgroundColor = (('#' + i) + i) + i;
		box011.style.float = 'left';

		box01.appendChild(box011);
	}

}

function showBar(selected){
	selected.now = true;	
	var toolBar = document.getElementById('toolBar');
	var bar = document.getElementById(selected.name);
	
	toolBar.style.height =
		toggle.bar[0].now * 40 +
		toggle.bar[1].now * 40 +
		toggle.bar[2].now * 40 + 'px';
	
	window.scrollTo(0, getAbsolutePos(toolBar).y);

	setTimeout(function(){
		bar.style.display = 'block';	
		bar.style.opacity = 1;
	}, 600);
}

function hideBar (selected) {
	selected.now = false;
	var toolBar = document.getElementById('toolBar');
	var bar = document.getElementById(selected.name);

	bar.style.opacity = 0;
	
	setTimeout(function(){		
		bar.style.display = 'none';
		toolBar.style.height =
			toggle.bar[0].now * 40 +
			toggle.bar[1].now * 40 +
			toggle.bar[2].now * 40 + 'px';
	}, 600);
}


//Events
document.getElementById('textEditor')
.addEventListener("keyup", function(){
	//TODO: make size compatible
	checkToggle();
	
	//TODO: toggle.bar[0].req = toggle.bar[1].req = true??
	toggle.bar[0].req = true;
	toggle.bar[1].req = true;
	
	raw = preview(document.getElementById('textEditor').innerHTML);
}, true);

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

function getSelectionContainerElement() {
    var range, sel, container;
    if (document.selection && document.selection.createRange) {
        // IE case
        range = document.selection.createRange();
        return range.parentElement();
    } else if (window.getSelection) {
        sel = window.getSelection();
        if (sel.getRangeAt) {
            if (sel.rangeCount > 0) {
                range = sel.getRangeAt(0);
            }
        } else {
            // Old WebKit selection object has no getRangeAt, so
            // create a range from other selection properties
            range = document.createRange();
            range.setStart(sel.anchorNode, sel.anchorOffset);
            range.setEnd(sel.focusNode, sel.focusOffset);

            // Handle the case when the selection was selected backwards (from the end to the start in the document)
            if (range.collapsed !== sel.isCollapsed) {
                range.setStart(sel.focusNode, sel.focusOffset);
                range.setEnd(sel.anchorNode, sel.anchorOffset);
            }
        }

        if (range) {
           container = range.commonAncestorContainer;

           // Check if the container is a text node and return its parent if so
           return container.nodeType === 3 ? container.parentNode : container;
        }   
    }
}

function getCaretCharacterOffsetWithin(element) {
    var caretOffset = 0;
    var doc = element.ownerDocument || element.document;
    var win = doc.defaultView || doc.parentWindow;
    var sel;
    if (typeof win.getSelection != "undefined") {
        sel = win.getSelection();
        if (sel.rangeCount > 0) {
            var range = win.getSelection().getRangeAt(0);
            var preCaretRange = range.cloneRange();
            preCaretRange.selectNodeContents(element);
            preCaretRange.setEnd(range.endContainer, range.endOffset);
            caretOffset = preCaretRange.toString().length;
        }
    } else if ( (sel = doc.selection) && sel.type != "Control") {
        var textRange = sel.createRange();
        var preCaretTextRange = doc.body.createTextRange();
        preCaretTextRange.moveToElementText(element);
        preCaretTextRange.setEndPoint("EndToEnd", textRange);
        caretOffset = preCaretTextRange.text.length;
    }
    return caretOffset;
}

function showCaretPos() {
    var el = document.getElementById("textEditor");
    var caretPosEl = document.getElementById("caretPos");
    caretPosEl.innerHTML = "Caret position: " + getCaretCharacterOffsetWithin(el);
}

document.body.onkeyup = showCaretPos;
document.body.onmouseup = showCaretPos;


function onKeyDown(){
	if(event.keyCode == 9){
		event.returnValue = false;
		event.preventDefault();
		
		getSelectionContainerElement().innerHTML += '   aa';
		
		addCell();
	}
	
	if(event.keyCode==13){
		setTag(document.getElementById('textEditor'));
	}
}
