var parser=null;

function Range(start,end) {
  this.start=start;
  this.end=end;
}

function CR(sc,ec) {
  this.type="cr";
  this.value=new Range(sc,ec);
}

function VR(c,sv,ev) {
  this.type="vr";
  this.cnum=c;
  this.value=new Range(sv,ev);
}

function BN(b) {
  this.type="b";
  this.bname=b;
}

function CN(c) {
  this.type="c";
  this.cnum=c;
}

function VN(c,v) {
  this.type="v";
  this.cnum=c;
  this.vnum=v;
}

function BR(b,r) {
  this.type="br";
  this.bname=b;
  this.range=r;
}

function G(c) {
  var v=parser.nextInteger();
  if(v) {
    switch(parser.nextSymbol()) {
      case ',':
        var r=[];
        r.push(new VN(c,v))
        r.push(B());
      return r;
      case '-':
        return F(c,v);
      case ";":
        parser.backward();
        return new VN(c,v);
      case null:
        return new VN(c,v);
      default:
      break;
    }
  }
  return null;
}

function F(c,sv) {
 var ev=parser.nextInteger();
 if(ev) {
  return new VR(c,sv,ev);
 }
 return new VN(c,sv);
}

function E(c,v) {
  switch(parser.nextSymbol()) {
    case ':':
      return C(c);
    break;
    case '-':
      return F(c,v);
    break;
    case ',':
      var r=[];
      r.push(new VN(c,v));
      r.push(G(c));
      return r;
    case ';':
      parser.backward();
      return new VN(c,v);
    case null:
      return new VN(c,v);
    break;
    default:
    break;
  }
  return null;
}

function D(sc) {
  var ec=parser.nextInteger();
  if(ec) {
    return new CR(sc,ec);
  }
  return new CN(sc);
}

function C(c) {
  var v=parser.nextInteger();
  if(v) {
    return E(c,v);
  }
  return new CN(c);
}

function B() {
  var c=parser.nextInteger();
  if(c) {
    switch(parser.nextSymbol()) {
      case ':':
        return C(c);
      break;
      case '-':
        return D(c);
      break;
      case ";":
        parser.backward();
        return new CN(c);
      break;
      case null:
        return new CN(c);
      break;
    }
  }
  return null;
}

function A() {
  var result=[];
  var n=parser.nextInteger();
  var b=parser.nextString();
  if(b) {
    b=n?n+" "+b:b;
    var tmp=B();
    if(tmp) {
      return new BR(b,tmp);
    }
    return new BN(b);
  }
  return null;
}

function parse() {
  var result=[];
  do {
    result.push(A());
  } while(parser.nextSymbol()==';');
  return result;
}


function form_submit() {

  var cite= "John;"+
            "John 1;"+
            "John 1-3;"+
            "John 1:4;"+
            "John 1:5-10;"+
            "John 1:6,8;"+
            "John 1:6,2:6;"+
            "John 1:6,2:6-10;"+
            "John 1:6,2:6,8;"+
            "John 1:6,7,2:6,8-10,13";

  var tokens=lex(cite);

  for(token of tokens) {
    print(JSON.stringify(token)+"\n");
  }
  print("\n");

  parser=new Parser(tokens);

  var ranges=parse();

  for(range of ranges) {
    print(JSON.stringify(range)+"\n\n");
  }

  print("OK\n");

}

