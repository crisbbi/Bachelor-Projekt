var canvas = document.getElementById("chartCanvas");

// set up labels for Chart object to use
var labelArray = [];
for (index = 1; index <= 20; index++) {
  labelArray.push("1");
}
var sensorDataGyroX = [];
var sensorDataGyroY = [];

// initial y axis range values, will change with incoming data
var lowestNumber = 0;
var highestNumber = 1;

var sensorChart = new Chart(canvas, {
  type: "line",
  data: {
    labels: labelArray,
    datasets: [
      {
        label: "Gyro Sensor X",
        borderColor: "rgba(0, 128, 128, 1)",
        backgroundColor: "rgba(0,0,0,0)",
        data: sensorDataGyroX
      },
      {
        label: "Gyro Sensor Y",
        borderColor: "rgba(200, 128, 100, 1)",
        backgroundColor: "rgba(0,0,0,0)",
        data: sensorDataGyroY
      }
    ]
  },
  options: {
      scales: {
          yAxes: [{
              ticks: {
                  suggestedMin: lowestNumber,
                  suggestedMax: highestNumber
              }
          }]
      },
    elements: {
        line: {
            tension: 0, // disables bezier curves
        }
    },
    animation: {
        duration: 0,
    },
    hover: {
        animationDuration: 0,
    },
    responsiveAnimationDuration: 0,
}
});

function refreshGyroXWitNewData(newData) {
  sensorDataGyroX.shift();
  sensorDataGyroX.push(newData);
  sensorChart.data.labels.shift();
  sensorChart.data.labels.push("1");
  sensorChart.update();
}
function refreshGyroYWitNewData(newData) {
  sensorDataGyroY.shift();
  sensorDataGyroY.push(newData);
  sensorChart.data.labels.shift();
  sensorChart.data.labels.push("1");
  sensorChart.update();
}

function checkLowestNumber(newestData, currentDataArray){
    lowestNumber = Math.min(newestData, Math.min(currentDataArray), 0);
}

function checkHighestNumber(newestData, currentDataArray){
    highestNumber = Math.max(newestData, Math.max(currentDataArray), 0);
}

function getData(){
    // AJAX request
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://cgqzqedj.p55.rt3.io/", true);
    xhr.send();
    
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
          var data = xhr.responseText.split(",");
          document.getElementById("title1").innerHTML = data[0];
          document.getElementById("title2").innerHTML = data[1];
    
          if (sensorDataGyroX.length <= 20) {
            sensorDataGyroX.push(data[0]);
            sensorDataGyroY.push(data[1]);
            checkHighestNumber(data[0]);
            checkLowestNumber(data[1]);
            sensorChart.update();
          } else {
            refreshGyroXWitNewData(data[1]);
            refreshGyroYWitNewData(data[1]);
          }
        }
      };
}

// refresh ajax call and chart update all X milliseconds
setInterval(getData, 35);