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


