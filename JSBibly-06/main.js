function CR(b,sc,ec) {
  this.type=RangeType.CR;
  this.bname=b;
  this.value=new Range(sc,ec);
}

function VR(b,c,sv,ev) {
  this.type=RangeType.VR;
  this.bname=b;
  this.cnum=c;
  this.value=new Range(sv,ev);
}

function BN(b) {
  this.type=RangeType.B;
  this.bname=b;
}

function CN(b,c) {
  this.type=RangeType.C;
  this.bname=b;
  this.cnum=c;
}

function VN(b,c,v) {
  this.type=RangeType.V;
  this.bname=b;
  this.cnum=c;
  this.vnum=v;
}



function F(p,b,c) {
  print("F");
  var v=p.nextInteger();
  if(v) {
    return new VN(b,c,v);
  }
  return null;
}

function E(p,b,sc) {
  print("E3");
  var ec=p.2nextInteger();
  if(ec) {
    return new CR(b,sc,ec);
  }
  return null;
}

function D(p,b,c) {
  print("D");
  switch(p.nextSymbol()) {
    case '-':
      return E(p,b,c);
    case ':':
      return F(p,b,c);
  }
  return null;
}

function C(p,b) {
  print("C");
  var c=p.nextInteger();
  if(c) {
    return D(p,b,c);
  }
  return new BN(b);
}

function B(p) {
  print("B");
  var ni=p.nextInteger();
  var ns=p.nextString();
  if(ns) {
    if(ni) {
      return C(p,ni+" "+ns);
    } else {
      return new BN(ns);
    }
  }
  return null;
}

function A(p) {
  print("A");
  var result=[];
  while(!p.isEOF()) {
    print(p.getType()+"\n");
    p.forward();
  }
  return result;
}

function parse(p) {
  print("parse ");
  return A(p);
}


function form_submit() {

  try {

    var cite= "John;"+
              "John 1;"+
              "John 1-3;"+
              "John 1:4";

    var tokens=lex(cite);

    for(token of tokens) {
      print(JSON.stringify(token)+"\n");
    }
    print("\n\n");


    var parser=new Parser(tokens);

    var ranges=parse(parser);

    print("OK\n");

  } catch(e) {
    print("error: "+e.name+" "+e.message);
  }

}

