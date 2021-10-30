class Lexer {

	const State =	{
				DEFAULT:"default",
				INTEGER:"integer",
				STRING:"string",
				SYMBOL:"symbol",
			}


  constructor() {
  }

	static lex(str) {
		let i=0;
		let tokens=[];
		let text="";
		let ch="";
		let state=Lexer.State.DEFAULT;
		let currTokenType=Token.Type.NONE;

		while(i<str.length) {
			ch=str[i];
			switch(state) {
				case Lexer.State.DEFAULT:
					if(isAlpha(ch) || ch==' ') {
						state=Lexer.State.STRING;
						currTokenType=Token.Type.STRING;
						i--;
					} else if(isDigit(ch)) {
						state=Lexer.State.INTEGER;
						currTokenType=Token.Type.INTEGER;
						i--;
					} else if(isSymbol(ch)) {
						state=Lexer.State.SYMBOL;
						currTokenType=Token.Type.SYMBOL;
						i--;
					}
				break;

				case Lexer.State.STRING:
					if(isAlpha(ch) || ch==' ') {
						text+=ch;
					} else {
						text=text.trim();
						if(text!=="") {
							tokens.push(new Token(Token.Type.STRING,text.trim()));
							text="";
						}
						currTokenType=Token.Type.NONE;
						state=Lexer.State.DEFAULT;
						i--;
					}
				break;

				case Lexer.State.INTEGER:
					if(isDigit(ch)) {
						text+=ch;
					} else {
						tokens.push(new Token(Token.Type.INTEGER,text));
						currTokenType=Token.Type.NONE;
						state=Lexer.State.DEFAULT;
						text="";
						i--;
					}
				break;

				case Lexer.State.SYMBOL:
					if(isSymbol(ch)) {
						tokens.push(new Token(Token.Type.SYMBOL,ch));
						currTokenType=Token.Type.NONE;
						state=Lexer.State.DEFAULT;
					}
				break;

				default: break;
			}
			i++;
		}
		if(currTokenType!=Token.Type.NONE) {
			tokens.push(new Token(currTokenType,text));
		}
		tokens.push(new Token(Token.Type.EOF,null));
		return tokens;
	}

  static isDigit(c) {
  	return c>='0' && c<='9';
  }

  static isAlpha(c) {
  	return (c>='A' && c<='Z') || (c>='a' && c<='z');
  }

  static isSymbol(c) {
  	return c==':' || c=='-' || c==',' || c==';';
  }

  static isWhiteSpace(c) {
  	return c==' ' || c=='\t' || c=='\n';
  }


}

