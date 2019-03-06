var canvas = document.getElementById("chartCanvas");

// set up labels for Chart object to use
var labelArray = [];
var maxAmountOfMeasurements = 40;
for (index = 1; index <= maxAmountOfMeasurements; index++) {
  labelArray.push("1");
}

// arrays to store sensor data
var sensorDataGyroX = [];
var sensorDataGyroY = [];
var accelerometerXangle = [];
var accelerometerYangle = [];
var accelerometerZangle = [];

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
            borderColor: "rgba(81, 205, 184, 1)",
            backgroundColor: "rgba(0,0,0,0)",
            data: sensorDataGyroX
        },
        {
            label: "Gyro Sensor Y",
            borderColor: "rgba(127, 28, 16, 1)",
            backgroundColor: "rgba(0,0,0,0)",
            data: sensorDataGyroY
        },
        {
            label: "Accelerometer X Angle",
            borderColor: "rgba(7, 46, 166, 1)",
            backgroundColor: "rgba(0,0,0,0)",
            data: accelerometerXangle
        },
        {
            label: "Accelerometer Y Angle",
            borderColor: "rgba(175, 62, 233, 1)",
            backgroundColor: "rgba(0,0,0,0)",
            data: accelerometerYangle
        },
        {
            label: "Accelerometer Z Angle",
            borderColor: "rgba(195, 112, 145, 1)",
            backgroundColor: "rgba(0,0,0,0)",
            data: accelerometerZangle
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
    xhr.open("GET", "http://192.168.2.113:8080", true);
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
                addDataToArray(accelerometerXangle, data[2]);
                addDataToArray(accelerometerYangle, data[3]);
                addDataToArray(accelerometerZangle, data[4]);
            } else {
                refreshSensorDataArray(sensorDataGyroX, data[0]);
                refreshSensorDataArray(sensorDataGyroY, data[1]);
                refreshSensorDataArray(accelerometerXangle, data[2]);
                refreshSensorDataArray(accelerometerYangle, data[3]);
            }
        }
    };
}

function updateChart() {
    lowestYaxisValue = Math.min(data[0], data[1], data[2], data[3], data[4], Math.min(currentDataArray), 0);
    highestYaxisValue = Math.max(data[0], data[1], data[2], data[3], data[4], Math.max(currentDataArray), 0);
    sensorChart.update();
}

// refresh ajax call and chart update all X milliseconds
setInterval(function() {
    getData();
    updateChart();
    }, 
    35);