function parse(parser) {
}


function form_submit() {
  print("OK\n");

  var tokens=lex("1 John 2:4");

  var parser=new Parser(tokens);

  for(token of tokens) {
    print(token.toString());
  }

  print(parse(parser));

}
