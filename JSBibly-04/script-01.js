var output=document.getElementById("output");
var modal=document.getElementById("modal");
var modalContent=document.getElementById("modal-content");
var command=document.getElementById("command");



var BibleCSV=null;



function showModal() {
	modal.style.display = "block";
}

function hideModal() {
	setTimeout(function() { modal.style.display = "none"; }, 1250);
}

function updateProgress(e) {
	if(e.lengthComputable) {
		var percent = Math.floor(e.loaded / e.total * 10000) / 100;
		modalContent.innerHTML="Loading "+percent+"&percnt;<br>";
	} else {
		modalContent.innerHTML="Loading...<br>";
	}
}

function transferStart(e) {
	//modalContent.innerHTML+="Transfer Started<br>";
}

function transferComplete(e) {
	//modalContent.innerHTML+="Transfer Complete<br>";
}

function transferEnd(e) {
	//modalContent.innerHTML+="Transfer End<br>";
}

function transferFailed(e) {
	//modalContent.innerHTML+="Transfer Failed<br>";
}

function transferCanceled(e) {
	//modalContent.innerHTML+="Transfer Canceled<br>";
}

function loadDoc(url,readyStateChange) {

	showModal();

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


function tokstr(s,d,n=0) {
	var i=0,j=0,k=0;
	var a=[];
	while(1) {
		if(n>0 && k>=n) break;
		i=s.indexOf(d,j);
		if(i==-1) break;
		a.push(s.substring(j,i));
		j=i+d.length;
		k++;
	}
	if(j<s.length) a.push(s.slice(j));
	return a.filter(i=>i);
}


function isDigit(c) {
	return c>='0' && c<='9';
}

function isAlpha(c) {
	return (c>='A' && c<='Z') || (c>='a' && c<='z');
}

function isSymbol(c) {
	return c==':' || c=='-' || c==',' || c==';';
}

function isWhiteSpace(c) {
	return c==' ' || c=='\t' || c=='\n';
}




function lex(str) {
	var i=0;
	var tokens=[];
	var text="";
	var ch="";
	var state=LexerState.DEFAULT;
	var currTokenType=TokenType.NONE;
	while(i<str.length) {
		ch=str[i];
		switch(state) {

			case LexerState.DEFAULT:
				if(isAlpha(ch) || ch==' ') {
					state=LexerState.STRING;
					currTokenType=TokenType.STRING;
					i--;
				} else if(isDigit(ch)) {
					state=LexerState.INTEGER;
					currTokenType=TokenType.INTEGER;
					i--;
				} else if(isSymbol(ch)) {
					state=LexerState.SYMBOL;
					currTokenType=TokenType.SYMBOL;
					i--;
				}
			break;

			case LexerState.STRING:
				if(isAlpha(ch) || ch==' ') {
					text+=ch;
				} else {
					text=text.trim();
					if(text!=="") {
						tokens.push(new Token(TokenType.STRING,text.trim()));
						text="";
					}
					currTokenType=TokenType.NONE;
					state=LexerState.DEFAULT;
					i--;
				}
			break;

			case LexerState.INTEGER:
				if(isDigit(ch)) {
					text+=ch;
				} else {
					tokens.push(new Token(TokenType.INTEGER,text));
					currTokenType=TokenType.NONE;
					state=LexerState.DEFAULT;
					text="";
					i--;
				}
			break;

			case LexerState.SYMBOL:
				if(isSymbol(ch)) {
					tokens.push(new Token(TokenType.SYMBOL,ch));
					currTokenType=TokenType.NONE;
					state=LexerState.DEFAULT;
				}
			break;

			default: break;
		}
		i++;
	}
	if(currTokenType!=TokenType.NONE) {
		tokens.push(new Token(currTokenType,text));
	}
	tokens.push(new Token(TokenType.EOF,null));
	return tokens;
}

function decorate(citation) {
	var result="<b>"+citation.bname+" "+citation.cnum+":"+citation.vnum+"</b> "+citation.vers+"<br><br>";
	return result;
}


function parse0(line) {

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


function show(xcite) {

	var bname=xcite.bname;
	var scnum=xcite.scnum;
	var ecnum=xcite.ecnum;
	var svnum=xcite.svnum;
	var evnum=xcite.evnum;

	var result="";

	if(bname!=null) {

		for(var i=0;i<BibleCSV.length;i++) {

			var citation=parse0(BibleCSV[i]);

			if(citation.bname==bname) {
				if(scnum>0) {
					if(ecnum>0) {
						if(scnum>ecnum || svnum>0 || evnum>0) {
							break;
						} else {
							if(citation.cnum>=scnum && citation.cnum<=ecnum) {
								result+=decorate(citation);
							}
						}
					} else if(ecnum==0) {
						if(citation.cnum==scnum) {
							if(svnum>0) {
								if(evnum>0) {
									if(citation.vnum>=svnum && citation.vnum<=evnum) {
										result+=decorate(citation);
									} else if(citation.vnum>evnum) {
										break;
									}
								} else if(evnum==0) {
									if(citation.vnum==svnum) {
										result+=decorate(citation);
										break;
									}
								}
							} else if(svnum==0) {
								if(evnum==0) {
									result+=decorate(citation);
								}
							}
						}
					}
				} else if(scnum==0) {
					if(ecnum==0 && svnum==0 && evnum==0) {
						result+=decorate(citation);
					} else {
						break;
					}
				}
			}
		}

		output.innerHTML+=result;
	}

}


function send() {
	parse2(command.value);
}


function parse2(str) {
	var tokens=lex(str);

	output.innerHTML="";

	var citations=parse(tokens);

	for(citation of citations) {
		print(citation.stringify()+"<br>");
	}

	for(citation of citations) {
		show(citation);
	}

}




const ParserState = {
	DEFAULT:"default",
	BNAME:"bname",
	SCNUM:"scnum",
	ECNUM:"ecnum",
	SVNUM:"svnum",
	EVNUM:"evnum",
	ADD:"add",
	DASHORCOLON:"dashorcolon",
	DASHORCOMMA:"dashorcomma",
	SCNUMORSEMICOLON:"scnumorsemicolon"
}

function Citation(bname,scnum,ecnum,svnum,evnum) {
	this.bname=bname;
	this.scnum=scnum;
	this.ecnum=ecnum;
	this.svnum=svnum;
	this.evnum=evnum;
	this.stringify=function() {
		return 	"{ bname: "+this.bname+", "+
			"scnum: "+this.scnum+", "+
			"ecnum: "+this.ecnum+", "+
			"svnum: "+this.svnum+", "+
			"evnum: "+this.evnum+" }";
	}
}


var a=null;
var x=null;
var v=null;
var i=0;
var t=null;
var w=null;

function getInteger() {
	if(t[i].type==TokenType.INTEGER) {
		return parseInt(t[i++].text);
	} else {
		return null;
	}
}

function getString() {
	if(t[i].type==TokenType.STRING) {
		return t[i++].text;
	} else {
		return null;
	}
}

function getSymbol() {
	if(t[i].type==TokenType.SYMBOL) {
		return t[i++].text;
	} else {
		return null;
	}
}

function getType() {
	return t[i].type;
}

function getText() {
	return t[i].type;
}

function print(x) {
	output.innerHTML+=x;
}


function fn8() {
	switch(getType()) {
		case TokenType.INTEGER: break;
		case TokenType.STRING: break;
		case TokenType.SYMBOL:
			switch(getSymbol()) {
				case ',': fn4(); break;
			}
		break;
		case TokenType.EOF:
			for(j in v) {
				a.push(new Citation(x.bname,x.scnum,0,j[0],j[1]));
			}
		break;
		default: break;
	}
}


function fn7() {
	switch(getType()) {
		case TokenType.INTEGER:
			x.evnum=getInteger();
			v[v.length-1][1]=x.evnum;
			fn8();
		break;
		case TokenType.STRING: break;
		case TokenType.SYMBOL: break;
		case TokenType.EOF: break;
		default: break;
	}
}


function fn6() {
	switch(getType()) {
		case TokenType.INTEGER: break;
		case TokenType.STRING: break;
		case TokenType.SYMBOL:
			switch(getSymbol()) {
				case '-': fn7(); break;
				case ',': fn4(); break;
			}
		break;
		case TokenType.EOF:
			for(j in v) {
				a.push(new Citation(x.bname,x.scnum,0,j[0],j[1]));
			}
		break;
		default: break;
	}
}


function fn5() {
	switch(getType()) {
		case TokenType.INTEGER:
			x.ecnum=getInteger();
			a.push(new Citation(x.bname,x.scnum,x.ecnum,0,0));
		break;
		case TokenType.STRING: break;
		case TokenType.SYMBOL: break;
		case TokenType.EOF: break;
		default: break;
	}
}

function fn4() {
	switch(getType()) {
		case TokenType.INTEGER:
			x.svnum=getInteger();
			v.push([x.svnum,0]);
			fn6();
		break;
		case TokenType.STRING: break;
		case TokenType.SYMBOL: break;
		case TokenType.EOF: break;
		default: break;
	}
}


function fn3() {
	switch(getType()) {
		case TokenType.INTEGER: break;
		case TokenType.STRING: break;
		case TokenType.SYMBOL:
			switch(getSymbol()) {
				case ':': fn4(); break;
				case '-': fn5(); break;
			}
		break;
		case TokenType.EOF:
			a.push(new Citation(x.bname,x.scnum,0,0,0));
		break;
		default: break;
	}
}


function fn2() {
	switch(getType()) {
		case TokenType.INTEGER:
			x.scnum=getInteger();
			fn3();
		break;
		case TokenType.STRING: break;
		case TokenType.SYMBOL: break;
		case TokenType.EOF:
			a.push(new Citation(x.bname,0,0,0,0));
		break;
		default: break;
	}
}


function fn1() {
	switch(getType()) {
		case TokenType.INTEGER: break;
		case TokenType.STRING:
			x.bname+=getString().trim();
			x.bname=x.bname.trim();
			fn2();
		break;
		case TokenType.SYMBOL: break;
		case TokenType.EOF: break;
		default: break;
	}
}


function fn0() {
	switch(getType()) {
		case TokenType.INTEGER:
			x.bname=getInteger()+"".trim()+" ";
			fn1();
		break;
		case TokenType.STRING:
			x.bname=getString().trim();
			fn2();
		break;
		case TokenType.SYMBOL: break;
		case TokenType.EOF: break;
		default: break;
	}
}


function parse(z) {
	i=0;
	a=[];
	v=[];
	x=new Citation("",0,0,0,0);
	t=z;
	fn0();
	return a;
}


window.onload=function() {
	loadDoc("kjv.csv",function() {
		if(this.readyState == 4 && this.status == 200) {
			BibleCSV=this.responseText.split("\n").filter(i=>i);
			hideModal();
		} else {
			modalContent.innerHTML="<div class='error-message'><b>Error:</b> Cannot load data!</div>";
			showModal();
		}
	});
}
