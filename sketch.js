let angle = 0;
let counter = 1;

function setup() {
  createCanvas(100, 100, WEBGL);
  // use an angle of degrees, otherwise need to use radians with radians(degrees) for conversion
  //angleMode(DEGREES);
}

function draw() {
  background(200);

  // simulate data received as string from ajax, parse back to usable number
  angle = str(counter++);

  // angle as new rotation position
  
  // if angle greater than 360 degrees then reset to 0, just cosmetic effect yet, might just be for visible correctness...
  /* if(angle <= 359){
    angle++;
  } else {
    angle = 0;
    counter = 1;
  } */
  
  // just to document angle change visible as text
  //document.getElementById("title1").innerHTML = angle;
  
  /* code below commented out as no connection to pi available 
  ----------------------------------------------------------- */
  
  // AJAX request
  var xhr = new XMLHttpRequest();
  xhr.open('GET', "https://otmdgwbz.p50.rt3.io/", true);
  xhr.send();
  
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      var data = xhr.responseText.split(" ");
      box(50);
      document.getElementById("title1").innerHTML = data[0];
      rotateX(cos(parseInt(data[0])));
      document.getElementById("title2").innerHTML = data[1];
      rotateY(parseInt(data[1]));
      document.getElementById("title3").innerHTML = data[2];
    }
  };
}