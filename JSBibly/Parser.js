function Parser(tokens) {

  this.tokens=tokens;
  this.index=0;

  this.getToken=function() {
    return this.tokens[this.index];
  }

  this.getType=function() {
    return this.getToken().type;
  }

  this.getText=function() {
    return this.getToken().text;
  }

  this.walk=function(offset) {
    var result=false;
    if( this.index+offset>=0 &&
        this.index+offset<this.tokens.length) {
      this.index+=offset;
      result=true;
    }
    return result;
  }

  this.jump=function(index) {
    var result=false;
    if( index>=0 && index<this.tokens.length) {
      this.index=index;
      result=true;
    }
    return result;
  }

  this.forward=function() {
    return this.walk(1);
  }

  this.backward=function() {
    return this.walk(-1);
  }

  this.match=function(type) {
    return this.getType()==type;
  }

  this.nextInteger=function() {
    var result=null;
    if(this.match(TokenType.INTEGER)) {
      result=parseInt(this.getText());
      this.forward();
    }
    return result;
  }

  this.nextString=function() {
    var result=null;
    if(this.match(TokenType.STRING)) {
      result=this.getText();
      this.forward();
    }
    return result;
  }

  this.nextSymbol=function() {
    var result=null;
    if(this.match(TokenType.SYMBOL)) {
      result=this.getText();
      this.forward();
    }
    return result;
  }

  this.eat=function(type) {
    var result=false;
    if(this.match(type)) {
      this.forward();
      result=true;
    }
    return result;
  }

  this.isEOF=function() {
    return this.match(TokenType.EOF);
  }

}
