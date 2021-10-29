var BibleCSVFile="kjv.csv";
var BibleInfoFile="kjv.inf";

var bibly=null;
var info=null;

var command=document.getElementById("command");
var output=document.getElementById("output");

var modal=document.getElementById("modal");
var modalContent=document.getElementById("modal-content");



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

function getRandomKey(object) {
  var keys=Object.keys(object);
  return keys[rnd(keys.length)];
}

function rnd(x) {
	return Math.floor(Math.random()*x);
}

function print(html) {
	output.insertAdjacentHTML("beforeend",html);
}

function clear() {
	output.innerHTML="";
}

function parseInfo(csv) {
	var result=[];
  var info=csv.split("\n").filter(i=>i);
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

  var ch=bname[0];
  var n=parseInt(ch);

  n=isNaN(n)?0:n;

  var th=["","1st","2nd","3rd"];
  var nth=th[n];
  var bname2=n>0?bname.substring(2):bname;

	return {
		"bname":bname,
		"cnum":cnum,
		"vnum":vnum,
		"vers":vers,
    "text":nth+" "+bname2+"; Chapter "+cnum+", Verse "+vnum+": "+vers
	};

}

function parseBibly(csv) {
  var result={};
  var vpl=csv.split("\n").filter(i=>i);
  for(var i=0;i<vpl.length;i++) {
    var passage=parseLine(vpl[i]);
    result[ passage.bname.replaceAll(" ","_")+"__"+
            passage.cnum+"_"+
            passage.vnum]=passage;
  }
  return result;
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
			info=parseInfo(this.responseText);
		}
	});

	loadDoc(BibleCSVFile,function() {
		if(this.readyState == 4 && this.status == 200) {
      bibly=parseBibly(this.responseText);
		}
	});

	populateVoiceList();
	if (speechSynthesis.onvoiceschanged !== undefined) {
		speechSynthesis.onvoiceschanged = populateVoiceList;
	}


});

function passageClick() {
	speak(this.querySelector(".text").textContent,voices[15],1,1);
}

function printTTSPassage(passage) {
		print("<div class='passage'><a href='#' style='text-decoration:none;color:black;'>"+
				"<b><span class='bname'>"+passage.bname+"</span> "+
				"<span class='cnum'>"+passage.cnum+"</span>:"+
				"<span class='vnum'>"+passage.vnum+"</span></b> "+
				"<span class='vers'>"+passage.vers+"</span>"+
				"<span class='text' style='display:none'>"+passage.text+"</span>"+
				"</a></div><br>");

	var link = document.querySelector("div.passage a:last-child");
	link.addEventListener("click",passageClick,true);

}

function printInfo(info) {
	print(`bname:&nbsp;${info.bname}<br>`);
	print(`sname:&nbsp;${info.sname}<br>`);
	print(`bnum:&nbsp;${info.bnum}<br>`);
	print(`nchap:&nbsp;${info.nchap}<br>`);
	print(`nvers:&nbsp;${info.nvers}<br><br>`);
}

function printPassage(passage) {
	print(`bname:&nbsp;${passage.bname}<br>`);
	print(`cnum:&nbsp;${passage.cnum}<br>`);
	print(`vnum:&nbsp;${passage.vnum}<br>`);
	print(`vers:&nbsp;${passage.vers}<br>`);
	print(`text:&nbsp;${passage.text}<br><br>`);
}

