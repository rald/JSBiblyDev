function updateProgress(e) {
  if(e.lengthComputable) {
    var percent = Math.floor(e.loaded / e.total * 10000) / 100;
    print("Loading "+percent+"&percnt;<br>");
  } else {
    print("Loading...<br>");
  }
}

function transferStart(e) {
  print("Transfer Started<br>");
}

function transferComplete(e) {
  print("Transfer Complete<br>");
}

function transferEnd(e) {
  print("Transfer End<br>");
  print("OK<br>");
}

function transferFailed(e) {
  print("Transfer Failed<br>");
}

function transferCanceled(e) {
  print("Transfer Canceled<br>");
}

function loadDoc(url,readyStateChange) {

  var xhttp = new XMLHttpRequest();

  xhttp.addEventListener("loadstart", transferStart, false);
  xhttp.addEventListener("load", transferComplete, false);
  xhttp.addEventListener("loadend", transferEnd, false);
  xhttp.addEventListener("progress", updateProgress, false);
  xhttp.addEventListener("error", transferFailed, false);
  xhttp.addEventListener("abort", transferCanceled, false);
  xhttp.addEventListener("readystatechange", readyStateChange, false);

  xhttp.open("GET", url, true);

  xhttp.send();

  return xhttp;
}
