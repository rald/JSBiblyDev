var BibleCSVFile="kjv.csv";
var BibleInfoFile="kjv.inf";

var Bible=null;
var BibleCSV=null;
var BibleInfo=null;
var BibleBooks=null;

var modal=document.getElementById("modal");
var modalContent=document.getElementById("modal-content");
var command=document.getElementById("command");

var output=document.getElementById("output");


var synth = window.speechSynthesis;
var voices = [];

var output = document.getElementById("output");
var verses = document.querySelectorAll('.vers');



function print(html) {
	output.insertAdjacentHTML("beforeend",html);
}

function populateVoiceList() {
  voices = synth.getVoices().sort(function (a, b) {
      const aname = a.name.toUpperCase(), bname = b.name.toUpperCase();
      if ( aname < bname ) return -1;
      else if ( aname == bname ) return 0;
      else return +1;
  });
}

function printVoicesInfo() {
  	for(var i=0;i<voices.length;i++) {
		print("["+i+"] "+voices[i].name+" -> "+voices[i].lang+"<br>");
	}
}

function speak(text,voice,rate=1,pitch=1){
	if (synth.speaking) {
		synth.cancel();
		/*
		console.error('speechSynthesis.speaking');
		return;
		*/
	}

	if (text !== '') {
		var utterThis = new SpeechSynthesisUtterance(text);

		utterThis.onend = function (event) {
			console.log('SpeechSynthesisUtterance.onend');
		}

		utterThis.onerror = function (event) {
			console.error('SpeechSynthesisUtterance.onerror');
		}

		utterThis.voice = voice;
		utterThis.pitch = pitch;
		utterThis.rate = rate;
		synth.speak(utterThis);
  	}
}

function clear() {
	output.innerHTML="";
}

function updateProgress(e) {
	if(e.lengthComputable) {
		var percent = Math.floor(e.loaded / e.total * 10000) / 100;
		print("Loading "+percent+"&percnt;<br>");
	} else {
		print("Loading...<br>");
	}
}

function transferStart(e) {
	print("Transfer Started<br>");
}

function transferComplete(e) {
	print("Transfer Complete<br>");
}

function transferEnd(e) {
	print("Transfer End<br>");
}

function transferFailed(e) {
	print("Transfer Failed<br>");
}

function transferCanceled(e) {
	print("Transfer Canceled<br>");
}

function loadDoc(url,readyStateChange) {

	var xhttp = new XMLHttpRequest();

	xhttp.addEventListener("loadstart", transferStart, false);
	xhttp.addEventListener("load", transferComplete, false);
	xhttp.addEventListener("loadend", transferEnd, false);
	xhttp.addEventListener("progress", updateProgress, false);
	xhttp.addEventListener("error", transferFailed, false);
	xhttp.addEventListener("abort", transferCanceled, false);
	xhttp.addEventListener("readystatechange", readyStateChange, false);

	xhttp.open("GET", url, true);

	xhttp.send();

	return xhttp;
}

function parseLine(line) {

	var tmp=tokstr(line,"|",2);
	var bname=tmp[0];
	var cv=tmp[1].split(":");
	var cnum=parseInt(cv[0]);
	var vnum=parseInt(cv[1]);
	var vers=tmp[2];

	return {
		"bname":bname,
		"cnum":cnum,
		"vnum":vnum,
		"vers":vers
	};

}

function getBibleBooks(BibleCSV) {
	var result=[];
	var prev=null;
	for(line of BibleCSV) {
		var tmp1=tokstr(line,"|",2);
		var tmp2=tmp1[0];
		if(prev!=tmp2) {
			result.push(tmp2);
		}
		prev=tmp2;
	}
	return result;
}


function getBibleAbbrs(BibleInfo,book) {
	for(line of BibleInfo) {
		var tmp1=tokstr(line,"-");
		if(book==tmp1[0]) {
			var tmp2=tokstr(tmp1[1],"/");
			return tmp2;
		}
	}
	return null;
}


function getNumberOfChapters(BibleCSV,book) {
	var result=0;
	for(line of BibleCSV) {
		var tmp1=tokstr(line,"|",2);
		var bname=tmp1[0];
		var tmp2=tmp1[1].split(":");
		var cnum=parseInt(tmp2[0]);
		var vnum=parseInt(tmp2[1]);
		if(book==bname && cnum>result) {
			result=cnum;
		}
	}
	return result;
}

function getNumberOfVerses(BibleCSV,book,chapter) {
	var result=0;
	for(line of BibleCSV) {
		var tmp1=tokstr(line,"|",2);
		var bname=tmp1[0];
		var tmp2=tmp1[1].split(":");
		var cnum=parseInt(tmp2[0]);
		var vnum=parseInt(tmp2[1]);
		if(book!=bname && result>0) break;
		if(book==bname && cnum==chapter && vnum>result) {
			result=vnum;
		}
	}
	return result;
}

window.addEventListener("load",function() {

	loadDoc(BibleInfoFile,function() {
		if(this.readyState == 4 && this.status == 200) {
			BibleInfo=this.responseText.split("\n").filter(i=>i);
		}
	});


	loadDoc(BibleCSVFile,function() {
		if(this.readyState == 4 && this.status == 200) {
			BibleCSV=this.responseText.split("\n").filter(i=>i);
			BibleBooks=getBibleBooks();
		}
	});

	populateVoiceList();
	if (speechSynthesis.onvoiceschanged !== undefined) {
		speechSynthesis.onvoiceschanged = populateVoiceList;
	}


});


function verseClick() {
	speak(this.querySelector(".vers").textContent,voices[15],1,1);
}


function printTTSVerse(cite) {
		print("<div class='verse'><a href='#' style='text-decoration:none;color:black;'>"+
				"<b><span class='bname'>"+cite.bname+"</span> "+
				"<span class='cnum'>"+cite.cnum+"</span>:"+
				"<span class='vnum'>"+cite.vnum+"</span></b> "+
				"<span class='vers'>"+cite.vers+"</span>"+
				"</a></div><br>");

	var verses = document.querySelectorAll("div.verse");
	var link=verses[verses.length-1].querySelector("a");
	link.addEventListener("click",verseClick,true);

}

function rnd(x) {
	return Math.floor(Math.random()*x);
}

function send() {
	try {
		printTTSVerse(parseLine(BibleCSV[0]));
	} catch(e) {
		print("Error: "+e.name+": "+e.message+"<br>");
	}
}


