var canvas = document.getElementById("chartCanvas");

var labelArray = [];
for (index = 1; index <= 20; index++) {
  labelArray.push("1");
}
var sensorDataGyroX = [];

var sensorChart = new Chart(canvas, {
  type: "line",
  data: {
    labels: labelArray,
    datasets: [
      {
        label: "Gyro Sensor X",
        borderColor: "rgba(0, 128, 128, 1)",
        data: sensorDataGyroX
      }
    ]
  },
  options: {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true
          }
        }
      ]
    }
  }
});

function refreshWitNewData(newData) {
  sensorDataGyroX.shift();
  sensorDataGyroX.push(newData);
  sensorChart.data.labels.shift();
  sensorChart.data.labels.push("1");
  sensorChart.update();
}

function getData(){
    // AJAX request
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://afcprhyc.p51.rt3.io/", true);
    xhr.send();
    
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
          var data = xhr.responseText.split(",");
          document.getElementById("title1").innerHTML = data[0];
          document.getElementById("title2").innerHTML = data[1];
    
          if (sensorDataGyroX.length <= 20) {
            sensorDataGyroX.push(data[0]);
          } else {
            refreshWitNewData(data[0]);
          }
        }
      };
}

setInterval(getData, 1000);