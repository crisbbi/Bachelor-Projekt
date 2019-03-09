var canvas = document.getElementById("chartCanvas");

// set up labels for Chart object to use
var labelArray = [];
var maxAmountOfMeasurements = 20;
for (index = 1; index <= maxAmountOfMeasurements; index++) {
  labelArray.push("1");
}

// arrays to store sensor data
var sensorDataGyroX = [];
var sensorDataGyroY = [];
var accelerometerXangle = [];
var accelerometerYangle = [];
var accelerometerZangle = [];
var kalmanFilteredXangleArray = [];
var kalmanFilteredYangleArray = [];
var complementFilteredYangleArray = [];

var currentGyroXAngleMeasurement = 0;
var currentGyroYAngleMeasurement = 0;
var currentAccelXAngleMeasurement = 0;
var currentAccelYAngleMeasurement = 0;

// kalman filter variables
var R_angle = 0.005;
var y_bias = 0.0;
var XP_00 = 1.0;
var XP_01 = 1.0;
var XP_10 = 1.0;
var XP_11 = 1.0;
var YP_00 = 1.0;
var YP_01 = 1.0;
var YP_10 = 1.0;
var YP_11 = 1.0;
var KFangleX = 0.0;
var KFangleY = 0.0;

// initial y axis range values, will change with incoming data
var lowestYaxisValue = 0;
var highestYaxisValue = 1;

// loop interval 
var interval = 50;

var sensorChart = new Chart(canvas, {
    type: "line",
    data: {
    labels: labelArray,
    datasets: [
        {
            label: "Gyro Sensor X",
            borderColor: "rgba(81, 205, 184, 0.2)",
            backgroundColor: "rgba(0,0,0,0)",
            data: sensorDataGyroX
        },
        {
            label: "Gyro Sensor Y",
            borderColor: "rgba(127, 28, 16, 0.2)",
            backgroundColor: "rgba(0,0,0,0)",
            data: sensorDataGyroY
        },
        {
            label: "Accelerometer X Angle",
            borderColor: "rgba(7, 46, 166, 0.2)",
            backgroundColor: "rgba(0,0,0,0)",
            data: accelerometerXangle
        },
        {
            label: "Accelerometer Y Angle",
            borderColor: "rgba(175, 62, 233, 0.2)",
            backgroundColor: "rgba(0,0,0,0)",
            data: accelerometerYangle
        },
        {
            label: "Kalman Filtered X Angle",
            borderColor: "rgba(8, 144, 79, 1)",
            backgroundColor: "rgba(0,0,0,0)",
            data: kalmanFilteredXangleArray
        },
        {
            label: "Kalman Filtered Y Angle",
            borderColor: "rgba(100, 80, 180, 1)",
            backgroundColor: "rgba(0,0,0,0)",
            data: kalmanFilteredYangleArray
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
            currentGyroXAngleMeasurement = Math.round(data[0]);
            currentGyroYAngleMeasurement = Math.round(data[1]);
            currentAccelXAngleMeasurement = Math.round(data[2]);
            currentAccelYAngleMeasurement = Math.round(data[3]);

            if (sensorDataGyroX.length <= maxAmountOfMeasurements) {
                addDataToArray(sensorDataGyroX, currentGyroXAngleMeasurement);
                addDataToArray(sensorDataGyroY, currentGyroYAngleMeasurement);
                addDataToArray(accelerometerXangle, currentAccelXAngleMeasurement);
                addDataToArray(accelerometerYangle, currentAccelYAngleMeasurement);
            } else {
                refreshSensorDataArray(sensorDataGyroX, currentGyroXAngleMeasurement);
                refreshSensorDataArray(sensorDataGyroY, currentGyroYAngleMeasurement);
                refreshSensorDataArray(accelerometerXangle, currentAccelXAngleMeasurement);
                refreshSensorDataArray(accelerometerYangle, currentAccelYAngleMeasurement);
            }
        }
    };
}

function filterData() {
    // kalman filter for x angle and y angle
    kalmanFilterX(currentGyroXAngleMeasurement, currentAccelXAngleMeasurement, kalmanFilteredXangleArray);
    kalmanFilterY(currentGyroYAngleMeasurement, currentAccelYAngleMeasurement, kalmanFilteredYangleArray);
    // for debugging
    document.getElementById("title1").innerHTML = KFangleX;
    document.getElementById("title2").innerHTML = KFangleY;
}

function kalmanFilterX(currentGyroXValue, currentAccelXValue, kalmanXArray) {
    // kalman filter for x angle 
    x = 0.0;
    S = 0.0;
    
    KFangleX = Math.round(KFangleX + (interval / 1000) * (currentGyroXValue));
    
    XP_00 = Math.round(XP_00 + -(XP_10 + XP_01));
    XP_01 = Math.round(XP_01 + -((interval / 1000) * XP_11));
    XP_10 = Math.round(XP_10 + -((interval / 1000) * XP_11));
    XP_11 = Math.round(XP_11 * (interval / 1000));
    
    x = Math.round(currentAccelXValue - KFangleX);
    S = Math.round(XP_00);
    K_0 = Math.round(XP_00 / S);
    K_1 = Math.round(XP_10 / S);
    
    KFangleX = Math.round(KFangleX + (K_0 * x));
    
    XP_00 = Math.round(XP_00 - (K_0 * XP_00));
    XP_01 = Math.round(XP_01 - (K_0 * XP_01));
    XP_10 = Math.round(XP_10 - (K_1 * XP_00));
    XP_11 = Math.round(XP_11 - (K_1 * XP_01));
    
    KFangleX = Math.round(KFangleX);
    
    if (kalmanXArray.length <= maxAmountOfMeasurements) {
        addDataToArray(kalmanXArray, KFangleX);
    } else {
        refreshSensorDataArray(kalmanXArray, KFangleX);
    }
}

function kalmanFilterY(currentGyroYValue, currentAccelYValue, kalmanYArray) {
    // kalman filter for y angle 
    y = 0.0;
    S = 0.0;
    
    KFangleY = Math.round(KFangleY + (interval / 1000) * (currentGyroYValue));
    
    YP_00 = Math.round(YP_00 + -(YP_10 + YP_01));
    YP_01 = Math.round(YP_01 + -((interval / 1000) * YP_11));
    YP_10 = Math.round(YP_10 + -((interval / 1000) * YP_11));
    YP_11 = Math.round(YP_11 * (interval / 1000));
    
    y = Math.round(currentAccelYValue - KFangleY);
    S = Math.round(YP_00);
    K_0 = Math.round(YP_00 / S);
    K_1 = Math.round(YP_10 / S);
    
    KFangleY = Math.round(KFangleY + (K_0 * y));
    
    YP_00 = Math.round(YP_00 - (K_0 * YP_00));
    YP_01 = Math.round(YP_01 - (K_0 * YP_01));
    YP_10 = Math.round(YP_10 - (K_1 * YP_00));
    YP_11 = Math.round(YP_11 - (K_1 * YP_01));
    
    KFangleY = Math.round(KFangleY);
    
    if (kalmanYArray.length <= maxAmountOfMeasurements) {
        addDataToArray(kalmanYArray, KFangleY);
    } else {
        refreshSensorDataArray(kalmanYArray, KFangleY);
    }
}

function updateChart() {
    // set lowest and highest value for chart y axis border 
    lowestYaxisValue = Math.min(Math.min(sensorDataGyroX), Math.min(sensorDataGyroY), 
                        Math.min(accelerometerXangle), Math.min(accelerometerYangle), Math.min(kalmanFilteredXangleArray), 0);
    highestYaxisValue = Math.max(Math.max(sensorDataGyroX), Math.max(sensorDataGyroY), 
                        Math.max(accelerometerXangle), Math.max(accelerometerYangle), Math.max(kalmanFilteredXangleArray), 0);
    sensorChart.update();
}

// refresh ajax call and chart update all X milliseconds
setInterval(function() {
    getData();
    filterData();
    updateChart();
    }, 
    interval);