var BibleVPLFile="kjv.csv";
var BibleAbbrFile="kjv.abbr";

var BibleVPL=null;
var BibleAbbr=null;

var books=null;
var abbrs=null;
var bible=null;

var output=document.getElementById("output");
var modal=document.getElementById("modal");
var modalContent=document.getElementById("modal-content");
var command=document.getElementById("command");

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

function print(x) {
	output.innerHTML+=x;
}

function clear() {
	output.innerHTML="";
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


function getBibleBooks() {
	var result=[];
	var prev=null;
	for(line of BibleVPL) {
		var tmp1=tokstr(line,"|",2);
		var tmp2=tmp1[0];
		if(prev!=tmp2) {
			result.push(tmp2);
		}
		prev=tmp2;
	}
	return result;
}


function getBibleAbbrs(book) {
	for(line of BibleAbbr) {
		var tmp1=tokstr(line,"-");
		if(book==tmp1[0]) {
			var tmp2=tokstr(tmp1[1],"/");
			return tmp2;
		}
	}
	return null;
}


function getNumberOfChapters(book) {
	var result=0;
	for(line of BibleVPL) {
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

function getNumberOfVerses(book,chap) {
	var result=0;
	for(line of BibleVPL) {
		var tmp1=tokstr(line,"|",2);
		var bname=tmp1[0];
		var tmp2=tmp1[1].split(":");
		var cnum=parseInt(tmp2[0]);
		var vnum=parseInt(tmp2[1]);
		if(book!=bname && result>0) break;
		if(book==bname && cnum==chap && vnum>result) {
			result=vnum;
		}
	}
	return result;
}

function parseVPL(vpl) {
	var result="";
	var bible={};
	var bnum=1;
	var pbname="";
	var pcnum="";
	var pvnum="";
	for(var line of vpl) {

		var tmp1=tokstr(line,"|",2);
		var tmp2=tmp1[1].split(":");
		var bname=tmp1[0];
		var cnum=tmp2[0];
		var vnum=tmp2[1];
		var vers=tmp1[2];

	//	result+="previous: "+pbname+" "+pcnum+" "+pvnum+"<br>";

		if(bname!==pbname) {
			try{
				bible[bname]={};
			} catch(e) {
				result+=`Error: bname = ${bname} ${e.message}<br>`;
				break;
			}
			bnum++;
		}

		if(cnum!==pcnum) {
			try{
				bible[bname][cnum]={};
			} catch(e) {
				result+=`Error: cnum = ${cnum} ${e.message}<br>`;
				break;
			}
		}

		if(vnum!==pvnum) {
			try{
				bible[bname][cnum][vnum]={};
				bible[bname][cnum][vnum]=vers;
			} catch(e) {
				result+=`Error: vnum = ${vnum} ${e.message}<br>`;
				break;
			}
		}

		pbname=bname;
		pcnum=cnum;
		pvnum=vnum;
	}

	print(result);

	return bible;
}

function send() {

	print("*** start ***<br><br>");

	bible=parseVPL(BibleVPL);

	print("*** end ***<br><br>");
}


window.addEventListener("load",function() {

	loadDoc(BibleAbbrFile,function() {
		if(this.readyState == 4 && this.status == 200) {
			BibleAbbr=this.responseText.split("\n").filter(i=>i);
			abbrs=getBibleAbbrs();
		}
	});


	loadDoc(BibleVPLFile,function() {
		if(this.readyState == 4 && this.status == 200) {
			BibleVPL=this.responseText.split("\n").filter(i=>i);
			books=getBibleBooks();
		}
	});


});

