var TokenType = {
  "NONE":"none",
  "INTEGER":"integer",
  "STRING":"string",
  "SYMBOL":"symbol",
  "EOF":"eof"
}

function Token(type,text) {
  this.type=type;
  this.text=text;

  this.toString=function() {
    return JSON.stringify(this);
  }

}
