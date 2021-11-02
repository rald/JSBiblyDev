function OB(b) {
  this.bname=b;
}

function OBCV(b,c,v) {
  this.bname=b;
  this.cnum=c;
  this.vnum=v;
}




function H(p,b) {
  print("H");
  return new Atom(AtomType.B,new OB(b);
}

function G(p,b,c,v) {
  print("G");
  return new Atom(AtomType.BCV,new OBCV(b,c,v));
}

function F(p,b,c) {
  print("F");
  var result=null;
  var v=p.nextInteger();
  if(typeof v === "integer") {
    result=G(p,b,c,v);
  }
  return result;
}

function E(p,b,c) {
  print("E");
  var result=[];
  switch(p.nextSymbol()) {
    case ':':
      result.push(F(p,b,c));
      break;
    default:
    break;
  }
  return result.flat();
}

function D(p,b) {
  print("D");
  var result=null;
  var c=p.nextInteger();
  if(typeof c === "integer") {
    result=E(p,b,c);
  } else {
    result=H(p,b);
  }
  return result;
}

function C(p,b) {
  print("C");
  return D(p,b);
}


function B(p) {
  print("B");
  var result=null;
  var bname=null;
  var n=p.nextInteger();
  var b=p.nextString();
  if(typeof b === "string") {
    if(typeof n === "integer") {
      bname=n+" "+b;
    } else {
      bname=b;
    }
    result=C(p,new Atom(AtomType.B,bname));
  }
  return result;
}

function A(p) {
  print("A");
  return B(p);
}

function parse(p) {
  return A(p);
}


function form_submit() {

  try {

    var tokens=lex(command.value);

    for(token of tokens) {
      print(JSON.stringify(token)+"\n");
    }
    print("\n");

    var parser=new Parser(tokens);

    var atoms=parse(parser);

    print(JSON.stringify(atoms)+"\n\n");

    print("OK\n");

  } catch(e) {
    print("error: "+e.name+" "+e.message);
  }

}
