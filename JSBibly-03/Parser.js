function Parser(tokens) {

	this.tokens=tokens;
	this.currentTokenIndex=0;

	this.nextInteger=function() {
		if(this.tokens[this.currentTokenIndex].type==TokenType.INTEGER) {
			return parseInt(this.tokens[this.currentTokenIndex++].text);
		} else {
			return null;
		}
	}

	this.nextString=function() {
		if(this.tokens[this.currentTokenIndex].type==TokenType.STRING) {
			return this.tokens[this.currentTokenIndex++].text;
		} else {
			return null;
		}
	}

	this.nextSymbol=function() {
		if(this.tokens[this.currentTokenIndex].type==TokenType.SYMBOL) {
			return this.tokens[this.currentTokenIndex++].text;
		} else {
			return null;
		}
	}

	this.getCurrentTokenType=function() {
		return this.tokens[this.currentTokenIndex].type;
	}

	this.getCurrentTokenText=function() {
		return this.tokens[this.currentTokenIndex].type;
	}

	this.getTokenAt=function(index) {
		return this.tokens[index];
	}

	this.jump=function(offset) {
		if( this.currentTokenIndex+offset>=0 &&
		    this.currentTokenIndex+offset<this.tokens.length) {
		  this.currentTokenIndex+=offset;
		  return true;
		}
		return false
	}

	this.goto=function(index) {
		if(index>=0 && index<this.tokens.length) {
  		this.currentTokenIndex=index;
		  return true;
		}
		return false
	}

	this.forward=function() {
		return this.jump(1);
	}

	this.backward=function() {
		return this.jump(-1);
	}

}
