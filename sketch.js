function setup() {
  createCanvas(100, 100, WEBGL);
}

function draw() {
  background(200);
  rotateX(frameCount * 0.01);
  rotateY(frameCount * 0.01);
  box(50);

  // AJAX request
  var xhr = new XMLHttpRequest();
  xhr.open('GET', "https://iybzjdzs.p55.rt3.io/", true);
  xhr.send();
  
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      var data = xhr.responseText.split(" ");
      document.getElementById("title1").innerHTML = data[0];
      document.getElementById("title2").innerHTML = data[1];
      document.getElementById("title3").innerHTML = data[2];
    }
  };
}