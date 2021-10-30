var synth = window.speechSynthesis;
var voices = [];

function populateVoiceList() {
  voices = synth.getVoices().sort(function (a, b) {
      const aname = a.name.toUpperCase(), bname = b.name.toUpperCase();
      if ( aname < bname ) return -1;
      else if ( aname == bname ) return 0;
      else return +1;
  });
}

function printVoicesInfo() {
    for(var i=0;i<voices.length;i++) {
    print("["+i+"] "+voices[i].name+" -> "+voices[i].lang+"<br>");
  }
}

function speak(text,voice,rate=1,pitch=1){
  if (synth.speaking) {
    synth.cancel();
    /*
    console.error('speechSynthesis.speaking');
    return;
    */
  }

  if (text !== '') {
    var utterThis = new SpeechSynthesisUtterance(text);

    utterThis.onend = function (event) {
      console.log('SpeechSynthesisUtterance.onend');
    }

    utterThis.onerror = function (event) {
      console.error('SpeechSynthesisUtterance.onerror');
    }

    utterThis.voice = voice;
    utterThis.pitch = pitch;
    utterThis.rate = rate;
    synth.speak(utterThis);
    }
}

