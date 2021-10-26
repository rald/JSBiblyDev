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


