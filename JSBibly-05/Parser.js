function Parser(tokens) {

  this.tokens=tokens;
  this.currentTokenIndex=0;

  this.getCurrentToken=function() {
    return this.tokens[this.currentTokenIndex];
  }

  this.getTokenAt=function(index) {
    return this.tokens[index];
  }

  this.walk=function(offset) {
    if( this.currentTokenIndex+offset>=0 &&
        this.currentTokenIndex+offset<this.tokens.length) {
      this.currentTokenIndex+=offset;
      return true;
    }
    return false
  }

  this.jump=function(index) {
    if(index>=0 && index<this.tokens.length) {
      this.currentTokenIndex=index;
      return true;
    }
    return false
  }

  this.forward=function() {
    return this.walk(1);
  }

  this.backward=function() {
    return this.walk(-1);
  }

  this.match=function(type) {
    return this.getCurrentToken().type==type;
  }

  this.nextInteger=function() {
    var result=null;
    if(this.match(TokenType.INTEGER)) {
      result=parseInt(this.getCurrentToken().text);
      this.forward();
    }
    return result;
  }

  this.nextString=function() {
    var result=null;
    if(this.match(TokenType.STRING)) {
      result=this.getCurrentToken().text;
      this.forward();
    }
    return result;
  }

  this.nextSymbol=function() {
    var result=null;
    if(this.match(TokenType.SYMBOL)) {
      result=this.getCurrentToken().text;
      this.forward();
    }
    return result;
  }

}
