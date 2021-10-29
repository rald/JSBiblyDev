var BibleCSVFile="kjv.csv";
var BibleInfoFile="kjv.inf";

var bible=null;
var info=null;

var modal=document.getElementById("modal");
var modalContent=document.getElementById("modal-content");
var command=document.getElementById("command");
var output=document.getElementById("output");



var synth = window.speechSynthesis;
var voices = [];

var verses = document.querySelectorAll('.vers');



function tokstr(s,d,n=0) {
	var i=0,j=0,k=0;
	var a=[];
	while(1) {
		if(n>0 && k>=n) break;
		i=s.indexOf(d,j);
		if(i==-1) break;
		a.push(s.slice(j,i));
		j=i+d.length;
		k++;
	}
	if(j<s.length) a.push(s.slice(j));
	return a.filter(i=>i);
}

function rnd(x) {
	return Math.floor(Math.random()*x);
}

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


function parseInfo(info) {

	var result=[];

	for(var i=0;i<info.length;i++) {

		var tmp=tokstr(info[i],"|",4);
		var bname=tmp[0];
		var sname=tokstr(tmp[1],"/");
		var bnum=tmp[2];
		var nchap=parseInt(tmp[3]);

		var nvers=[];
		var v=tokstr(tmp[4],",");
		for(var j=0;j<v.length;j++) {
			nvers.push(parseInt(v[j]));
		}


		result.push({
			"bname":bname,
			"sname":sname,
			"bnum":bnum,
			"nchap":nchap,
			"nvers":nvers
		});

	}

	return result;

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

function getBooks(info) {
	var result=[];
	for(var i=0;i<info.length;i++) {
		result.push(info[i].bname);
	}
	return result;
}

function getInfo(info,book) {
	for(var i=0;i<info.length;i++) {
		if(book==info[i].bname) {
			return info[i];
		}
	}
	return null;
}

function getNumberOfBooks(info) {
  return info.length;
}

function getBookNumber(info,book) {
	for(var i=0;i<info.length;i++) {
		if(book==info[i].bname) {
			return info[i].bnum;
		}
	}
	return null;
}

function getShortNames(info,book) {
	for(var i=0;i<info.length;i++) {
		if(book==info[i].bname) {
			return info[i].sname;
		}
	}
	return null;
}


function getNumberOfChapters(info,book) {
	for(var i=0;i<info.length;i++) {
		if(book==info[i].bname) {
			return info[i].nchap;
		}
	}
	return null;
}

function getNumberOfVerses(info,book,cnum) {
	for(var i=0;i<info.length;i++) {
		if(book==info[i].bname) {
			return info[i].nvers[cnum-1];
		}
	}
	return null;
}

window.addEventListener("load",function() {

	loadDoc(BibleInfoFile,function() {
		if(this.readyState == 4 && this.status == 200) {
			info=parseInfo(this.responseText.split("\n").filter(i=>i));
		}
	});


	loadDoc(BibleCSVFile,function() {
		if(this.readyState == 4 && this.status == 200) {
			bible=this.responseText.split("\n").filter(i=>i);
		}
	});

	populateVoiceList();
	if (speechSynthesis.onvoiceschanged !== undefined) {
		speechSynthesis.onvoiceschanged = populateVoiceList;
	}


});

function versClick() {
	speak(this.querySelector(".vers").textContent,voices[15],1,1);
}

function printTTSVerse(cite) {
		print("<div class='verse'><a href='#' style='text-decoration:none;color:black;'>"+
				"<b><span class='bname'>"+cite.bname+"</span> "+
				"<span class='cnum'>"+cite.cnum+"</span>:"+
				"<span class='vnum'>"+cite.vnum+"</span></b> "+
				"<span class='vers'>"+cite.vers+"</span>"+
				"</a></div><br>");

	var link = document.querySelector("div.verse a:last-child");
	link.addEventListener("click",versClick,true);

}

function printInfo(info) {
	print(`bname:&nbsp;${info.bname}<br>`);
	print(`sname:&nbsp;${info.sname}<br>`);
	print(`bnum:&nbsp;${info.bnum}<br>`);
	print(`nchap:&nbsp;${info.nchap}<br>`);
	print(`nvers:&nbsp;${info.nvers}<br><br>`);
}

function printCite(cite) {
	print(`bname:&nbsp;${cite.bname}<br>`);
	print(`cnum:&nbsp;${cite.cnum}<br>`);
	print(`vnum:&nbsp;${cite.vnum}<br>`);
	print(`vers:&nbsp;${cite.vers}<br><br>`);
}

function send() {
	try {

		clear();

    for(var i=0;i<getNumberOfBooks(info);i++) {
      printInfo(getInfo(info,info[i].bname));
    }

	} catch(e) {
		print("Error: "+e.name+": "+e.message+"<br>");
	}
}


