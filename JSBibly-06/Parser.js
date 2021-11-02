function Parser(tokens) {

  this.tokens=tokens;
  this.index=0;

  this.get=function() {
    return this.tokens[this.index];
  }

  this.getAt=function(index) {
    return this.tokens[index];
  }

  this.getRel=function(offset) {
    return this.tokens[index+offset];
  }

  this.getType=function() {
    return this.get().type;
  }

  this.getText=function() {
    return this.get().text;
  }

  this.walk=function(offset) {
    this.index+=offset;
  }

  this.jump=function(index) {
    this.index=index;
  }

  this.forward=function() {
    return this.walk(1);
  }

  this.backward=function() {
    return this.walk(-1);
  }

  this.match=function(type) {
    return this.getType()===type;
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

  this.eat=function(type,num=1,dir=1) {
    var result=0;
    if(dir==-1 || dir==1) {
      while(this.match(type)) {
        this.walk(dir);
        result++;
        if(num!=0 && result>=num) break;
      }
    }
    return result;
  }

  this.isEOF=function() {
    return this.match(TokenType.EOF);
  }

}
