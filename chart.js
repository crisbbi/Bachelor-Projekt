var canvas = document.getElementById("chartCanvas");

// set up labels for Chart object to use
var labelArray = [];
var maxAmountOfMeasurements = 40;
for (index = 1; index <= maxAmountOfMeasurements; index++) {
  labelArray.push("1");
}

var sensorDataGyroX = [];
var sensorDataGyroY = [];

// initial y axis range values, will change with incoming data
var lowestYaxisValue = 0;
var highestYaxisValue = 1;

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
                    suggestedMin: lowestYaxisValue,
                    suggestedMax: highestYaxisValue
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

function refreshSensorDataArray(arrayToRefresh, newMeasurement) {
  arrayToRefresh.shift();
  arrayToRefresh.push(newMeasurement);
  sensorChart.data.labels.shift();
  sensorChart.data.labels.push("1");
  sensorChart.update();
}

function addDataToArray(arrayToFill, newMeasurement) {
    arrayToFill.push(newMeasurement);
}

function getData(){
    // AJAX request
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://cgqzqedj.p55.rt3.io/", true);
    xhr.send();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var data = xhr.responseText.split(",");
            // write normal text on webpage for debugging
            document.getElementById("title1").innerHTML = data[0];
            document.getElementById("title2").innerHTML = data[1];
            if (sensorDataGyroX.length <= maxAmountOfMeasurements) {
                addDataToArray(sensorDataGyroX, data[0]);
                addDataToArray(sensorDataGyroY, data[1]);
            } else {
                refreshSensorDataArray(sensorDataGyroX, data[0]);
                refreshSensorDataArray(sensorDataGyroY, data[1]);
            }
        }
    };
}

function updateChart() {
    lowestYaxisValue = Math.min(data[0], data[1], Math.min(currentDataArray), 0);
    highestYaxisValue = Math.max(data[0], data[1], Math.max(currentDataArray), 0);
    sensorChart.update();
}

// refresh ajax call and chart update all X milliseconds
setInterval(function() {
    getData();
    updateChart();
    }, 
    35);