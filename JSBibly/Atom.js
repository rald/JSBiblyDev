var AtomType={
  "B":"book",
  "BC":"book_chapter",
  "BCV":"book_chapter_verse",
  "BCR":"book_chapter_range",
  "BCVR":"book_chapter_verse_range",
  "ARRAY":"array"
}

function Atom(type,value) {
  this.type=type;
  this.value=value;
}
