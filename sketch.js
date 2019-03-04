let angle = 0;
let counter = 1;

function setup() {
  createCanvas(100, 100, WEBGL);
  // use an angle of degrees, otherwise need to use radians with radians(degrees) for conversion
  //angleMode(DEGREES);
}

function draw() {
  background(200);
  
  // just to document angle change visible as text
  //document.getElementById("title1").innerHTML = angle;
  
  // AJAX request
  var xhr = new XMLHttpRequest();
  xhr.open('GET', "https://erbksaly.p50.rt3.io/", true);
  xhr.send();
  
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      var data = xhr.responseText.split(",");
      document.getElementById("title1").innerHTML = data[0];
      document.getElementById("title2").innerHTML = data[1];
    }
  };
}