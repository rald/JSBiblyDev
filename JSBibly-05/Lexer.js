var LexerState = {
  DEFAULT:"default",
  INTEGER:"integer",
  STRING:"string",
  SYMBOL:"symbol"
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
  tokens.push(new Token(TokenType.EOF,TokenType.EOF));
  return tokens;
}

