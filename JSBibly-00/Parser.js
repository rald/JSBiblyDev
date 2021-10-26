class Parser {

	constructor(tokens) {
		this.tokens=tokens;
		this.currentTokenIndex=0;
	}

	getInteger() {
		if(this.tokens[this.currentTokenIndex].type==Token.Type.INTEGER) {
			return parseInt(this.tokens[this.currentTokenIndex++].text);
		} else {
			return null;
		}
	}

	getString() {
		if(this.tokens[this.currentTokenIndex].type==Token.Type.STRING) {
			return this.tokens[this.currentTokenIndex++].text;
		} else {
			return null;
		}
	}

	getSymbol() {
		if(this.tokens[this.currentTokenIndex].type==Token.Type.SYMBOL) {
			return this.tokens[this.currentTokenIndex++].text;
		} else {
			return null;
		}
	}

	getCurrentType() {
		return this.tokens[this.currentTokenIndex].type;
	}

	getCurrentText() {
		return this.tokens[this.currentTokenIndex].type;
	}

	getTokenAt(tokenIndex) {
		return this.tokens[tokenIndex];
	}

	nextToken(offset=1) {
		this.currentTokenIndex+=offset;
	}

	prevToken(offset=1) {
		this.currentTokenIndex-=offset;
	}

	parse() {

	}

}
