//проверка на количество цветных точек для разных режимов

/*Block for start initialization of elements*/
var radiosForMode = document.getElementsByName("radiosForMode");
var mode = null;

for (let i = 0; i < radiosForMode.length; i++) {
    if (radiosForMode[i].checked) {
        mode = radiosForMode[i].value;
        break;
    }
}

var dataForGraphTrainMode = [];
var dataForGraphBeamsMode = [];
var pointsCollection = new Set();
var linesCollection = new Set();
var svg = document.getElementsByClassName("svgForDrawing")[0];

/**
svgOffset object (ClientRect) contains the following values:
ClientRect {
    bottom:
    height:
    left:
    right:
    top:
    width:
}
*/
var svgOffset = svg.getBoundingClientRect();
var s = 0.2;
var g = 9.80665;
var borderColors = ["rgba(0, 0, 0, 1)", "rgba(153,255,51,1)", "rgba(255, 0, 51, 1)", "rgba(0, 0, 255, 1)"];
var valueGraphXAxis = null;

//Test variables for visible coordinates output (should be removed with dom elements)
var xxx = document.getElementById("x");
var yyy = document.getElementById("y");

(function () {
    document.getElementById("inputsForTestTrain").style.display = "none";
    document.getElementById("modes").style.display = "none";
    document.getElementById("inputsForTestBeams").style.display = "none";

    document.addEventListener("mousemove", function (e) {
        xxx.innerHTML = event.clientX;
        yyy.innerHTML = event.clientY;
    });

    svg.addEventListener('click', pointCreation, false);

    //this method needs an enchansement as it dublicates point repair in the Database.js
    function pointCreation() {
        var point = new Point(10, 10);
        pointsCollection.add(point);
        point.create();
    }
})();

/*End of start initialization block*/

/*Block for control buttons handlers*/

var controlButtonTable = document.getElementById("controlButtonTable");
controlButtonTable.addEventListener("click", tableWithParametersShow);

function tableWithParametersShow() {
    controlButtonTable.className = "active";
    if (controlButtonInputs.className === "active") {
        controlButtonInputs.className = "";
    }
    let tablePoints = document.getElementById("tables");
    let inputsForTestTrain = document.getElementById("inputsForTestTrain");
    let modes = document.getElementById("modes");
    tablePoints.style.display = "block";
    inputsForTestTrain.style.display = "none";
    modes.style.display = "none";
}

var controlButtonInputs = document.getElementById("controlButtonInputs");
controlButtonInputs.addEventListener("click", inputsShow);

function inputsShow() {
    controlButtonInputs.className = "active";
    if (controlButtonTable.className === "active") {
        controlButtonTable.className = "";
    }
    let tablePoints = document.getElementById("tables");
    let inputsForTestTrain = document.getElementById("inputsForTestTrain");
    let modes = document.getElementById("modes");
    modes.style.display = "block";
    if (mode == "train") {
        inputsForTestTrain.style.display = "block";
    }
    else if (mode == "beams") {
        inputsForTestTrain.style.visibility = "hidden";
        inputsForTestTrain.style.display = "block";
    }
    tablePoints.style.display = "none";
}

/*End of control buttons handlers block*/

/*Mode options*/

var trainRadio = document.getElementById("train");
var beamsRadio = document.getElementById("beams");

trainRadio.addEventListener("change", useTrain, false);
beamsRadio.addEventListener("change", useBeams, false);

function useTrain() {
    document.getElementsByClassName("svgForDrawing")[0].style.backgroundImage = "url('../images/image.jpg')";
    mode = trainRadio.value;
    document.getElementById("inputsForTestBeams").style.display = "none";
    document.getElementById("inputsForTestTrain").style.display = "block";
    document.getElementById("inputsForTestTrain").style.visibility = "visible";
}

function useBeams() {
    document.getElementsByClassName("svgForDrawing")[0].style.backgroundImage = "url('../images/image2.jpg')";
    mode = beamsRadio.value;
    document.getElementById("inputsForTestBeams").style.display = "block";
    document.getElementById("inputsForTestTrain").style.visibility = "hidden";
}

/*End of mode options*/

/**/

var calculateButton = document.getElementById("calculate");
calculateButton.addEventListener("click", makeCalculations, false);

function makeCalculations() {
    var countOfGreenProp = 0;
    var countOfRedProp = 0;

    pointsCollection.forEach(function (value) {
        if (value.getIsProp()) {
            countOfGreenProp++;
        }
        if (value.getColor() == "red") {
            countOfRedProp++;
        }
    });
    
    if (mode == "train") {
        var radiosForValueGraphXAxis = document.getElementsByName("radiosForValueGraphXAxis");
        
        if (!valueGraphXAxis) {
            for (let i = 0; i < radiosForValueGraphXAxis.length; i++) {
                if (radiosForValueGraphXAxis[i].checked) {
                    valueGraphXAxis = radiosForValueGraphXAxis[i].value;
                    break;
                }
            }
        }
        
        var speed = Number(document.getElementById("speed").value);
        var time = Number(document.getElementById("breakingTime").value);
        var maxLoadOnProp = Number(document.getElementById("maxLoad").value);
        var greenProp = null;
        var redProp = null;

        pointsCollection.forEach(function (value) {
            if (value.getIsProp()) {
                greenProp = value;
            }
            if (value.getColor() == "red") {
                redProp = value;
            }
        });

        if (countOfGreenProp == 1 && countOfRedProp == 1) {
            if (speed && time) {
                var promise = new Promise((resolve, reject) => {
                    resolve(findQuantativeCharacteristic(speed, time, maxLoadOnProp, speed / time, greenProp, redProp));
                });

                promise.then(
                    result => {
                        document.getElementById("result").innerHTML = result;
                        if (valueGraphXAxis == "speed") {
                            dataForGraphTrainMode.push([speed, result]);
                        }
                        else if (valueGraphXAxis == "time") {
                            dataForGraphTrainMode.push([time, result]);
                        }
                        else {
                            dataForGraphTrainMode.push([speed, result]);
                        }
                    },
                    error => {
                        alert(error);
                    }
                );

            }
            else {
                alert("speed or time are not defined");
            }
        }
        else {
            alert("greenProp or redProp or maxLoad are not defined or there are too many green or red points");
        }
    }
    else if (mode == "beams") {
        if (countOfGreenProp == 3 && countOfRedProp == 1) {
            dataForGraphBeamsMode = [];
            var greenProp = [];
            var redProp = null;
            var grayProp = [];

            pointsCollection.forEach(function (value) {
                if (value.getIsProp()) {
                    greenProp.push(value);
                }
                else if (value.getColor() == "red") {
                    redProp = value;
                }
                else if (value.getColor() == "gray") {
                    grayProp.push(value);
                }
            });

            //sorting the array to get points sequince from the very left to the very right
            greenProp.sort((a, b) => a.getPosition().x - b.getPosition().x);

            //sorting the array to get points sequince from very top to very bottom
            grayProp.sort((a, b) => a.getPosition().y - b.getPosition().y);

            var s = getLineLength(greenProp[1].getPosition().x, greenProp[1].getPosition().y, greenProp[2].getPosition().x, greenProp[2].getPosition().y);
            var l = getLineLength(greenProp[0].getPosition().x, greenProp[0].getPosition().y, grayProp[0].getPosition().x, grayProp[0].getPosition().y);
            var f1 = redProp.getMass() * g;

            for (var i = 1; i < 90; i++) {
                var ai = (Math.PI * i) / (2 * 90);
                var l2 = Math.sin(ai);
                var l3 = Math.cos(ai);
                var f2 = l * f1 / l2;
                var f3 = l * f1 / l3;
                var fy = (l - l2) * f1 / l2;
                var fx = l2 * f2 / l3;
                var fr = Math.sqrt(fy + fx);
                
                var pressureOfGreenTopProp = f2 / getSquare(greenProp[1]);
                var pressureOfGreenBottomProp = f3 / getSquare(greenProp[2]);
                var pressureOfGrayTopProp = fr / getSquare(grayProp[0]);
                var avgOfPressures = (pressureOfGreenTopProp + pressureOfGreenBottomProp + pressureOfGrayTopProp) / 3;
                dataForGraphBeamsMode.push([i, avgOfPressures, pressureOfGrayTopProp, pressureOfGreenTopProp, pressureOfGreenBottomProp]);
            }

        }
        else {
            alert("countOfGreenProp != 3, countOfRedProp != 1");
        }
    }
}

var displayGraphButton = document.getElementById("showGraph");
var graph = document.getElementById("graph");

displayGraphButton.addEventListener("click", makeGraph, false);

function makeGraph() {
    var myChart = null;
    if (window.getComputedStyle(graph, null).getPropertyValue("display") == "none") {
        var canvas = document.createElement("canvas");
        canvas.id = "myChart";
        graph.appendChild(canvas);
        graph.style.display = "block";
        displayGraphButton.value = "Close Graph";
        if (mode == "train") {
            var data = convertParametersForGraph(dataForGraphTrainMode);
            var dataset = convertDataToDataset(data);
            drawGraph(data.label, dataset);
        }
        else if (mode == "beams") {
            let avgOfPressures = [];

            for(let i = 0; i < dataForGraphBeamsMode.length; i++){
                avgOfPressures[i] = dataForGraphBeamsMode[i][1];
            }

            var minValue = Math.min(...avgOfPressures);
            let avgAngle = null;

            for (let i = 0; i < dataForGraphBeamsMode.length; i++) {
                if(dataForGraphBeamsMode[i][1] == minValue){
                    avgAngle = dataForGraphBeamsMode[i][0];
                    break;
                }
            }

            console.log(avgAngle);
            var data = convertParametersForGraph(dataForGraphBeamsMode);
            var dataset = convertDataToDataset(data);
            drawGraph(data.label, dataset);
        }
    }
    else {
        graph.style.display = "none";
        displayGraphButton.value = "Show Graph";
        while (graph.firstChild) {
            graph.removeChild(graph.firstChild);
        }
    }
}

var increaseDistance = document.getElementById("increaseDistance");
increaseDistance.addEventListener("click", increaseHandler, false);

function increaseHandler() {
    pointsCollection.forEach(function (value) {
        if (value.getColor() == "gray") {
            value.setPosition(value.getPosition().x, value.getPosition().y - 1);
        }
    });
}

var decreaseDistance = document.getElementById("decreaseDistance");
decreaseDistance.addEventListener("click", decreaseHandler, false);

function decreaseHandler() {
    pointsCollection.forEach(function (value) {
        if (value.getColor() == "gray") {
            value.setPosition(value.getPosition().x, value.getPosition().y + 1);
        }
    });
}

var save = document.getElementById("save");
save.addEventListener("click", saveSession, false);

function saveSession() {
    saveSessionTODB();
}

var load = document.getElementById("load");
load.addEventListener("click", readData, false);

function readData() {
    readDataFromDB();
}

var removeSession = document.getElementById("removeSession");
removeSession.addEventListener("click", removeSession, false);

function removeSession() {
    removeSessionFromDB();
}

var clean = document.getElementById("clean");
clean.addEventListener("click", cleanData, false);

function cleanData() {
    dataForGraphTrainMode = [];
    dataForGraphBeamsMode = [];
    pointsCollection.forEach(item => item.delete());
    linesCollection.forEach(item => item.delete());
}

var removeLast = document.getElementById("removeLastResult");
removeLast.addEventListener("click", removeLastResult, false);

function removeLastResult() {
    if (mode == "train") {
        dataForGraphTrainMode.pop();
    }
}

var tables = document.getElementById("pointsTable");
tables.addEventListener("click", tableOnClickTDDelegate, false);

function tableOnClickTDDelegate() {
    var target = window.event.target;

    while (target != this) {
        if (target.tagName == 'TR') {
            var rowOriginalColor = target.style.backgroundColor;
            var xCoordinate = target.childNodes[0].innerHTML;
            var yCoordinate = target.childNodes[1].innerHTML;
            var element = document.elementFromPoint(xCoordinate, yCoordinate);
            var pointOriginalColor = element.style.backgroundColor;
            target.style.backgroundColor = "blue";
            element.style.backgroundColor = "brown";
            setTimeout(changeColorBack, 500);

            function changeColorBack() {
                target.style.backgroundColor = rowOriginalColor;
                element.style.backgroundColor = pointOriginalColor;
            }
            
            return;
        }
        target = target.parentNode;
    }
}
/**/

/*Block for common functions*/

/**
    Function returns the angle between two points
    center - the point against the angle will be searched
*/

function getAngle(center, point) {
    var x = point.x - center.x;
    var y = point.y - center.y;
    if (x == 0) return (y > 0) ? 180 : 0;
    var a = Math.atan(y / x) * 180 / Math.PI;
    a = (x > 0) ? a + 90 : a + 270;
    return a;
}

/**
    Function returns the Point object binded to the DOM element
*/

function findPointByElement(element) {
    let point = null;
    pointsCollection.forEach(function (value) {
        if (value.getElement() === element) {
            point = value;
        }
    });
    return point;
}

/**
    Function returns the Point object binded to the coordinates [x, y]
*/

function findPointByCoordinates(x, y) {
    let point = null;
    pointsCollection.forEach(function (value) {
        if (value.getPosition().x === x && value.getPosition().y === y) {
            point = value;
        }
    });
    return point;
}

/**
    Calculation the points' tangent points. On the input we are giving the line and than get two points of this line.
    Function calculates coordinates for 2 tangent points per point that it have got from the line's attributes.
*/

function findPolygonPointsCorrectPosition(line) {
    var lengthOfCathetusFirstTriangle = Math.sqrt(line.getLength() * line.getLength() - line.getPoints().firstPoint.getRadius() * line.getPoints().firstPoint.getRadius());
    var lengthOfCathetusSecondTriangle = Math.sqrt(line.getLength() * line.getLength() - line.getPoints().secondPoint.getRadius() * line.getPoints().secondPoint.getRadius());
    var ya, yb, xa, xb, ya2, yb2, xa2, xb2;
    var center = {
        x: line.getPoints().firstPoint.getPosition().x - svgOffset.left,
        y: line.getPoints().firstPoint.getPosition().y - svgOffset.top
    };
    var point = {
        x: line.getPoints().secondPoint.getPosition().x - svgOffset.left,
        y: line.getPoints().secondPoint.getPosition().y - svgOffset.top
    };
    var result = {
        xa: null,
        xb: null,
        ya: null,
        yb: null,
        xa2: null,
        xb2: null,
        ya2: null,
        yb2: null
    };
    var e = center.x - point.x;
    var c = center.y - point.y;
    var q = (lengthOfCathetusFirstTriangle * lengthOfCathetusFirstTriangle - line.getPoints().firstPoint.getRadius() * line.getPoints().firstPoint.getRadius() + center.y * center.y - point.y * point.y + center.x * center.x - point.x * point.x) / 2;
    var A = c * c + e * e;
    var B = (center.x * e * c - c * q - center.y * e * e) * 2;
    var C = center.x * center.x * e * e - 2 * center.x * e * q + q * q + center.y * center.y * e * e - line.getPoints().firstPoint.getRadius() * line.getPoints().firstPoint.getRadius() * e * e;
    var e2 = point.x - center.x;
    var c2 = point.y - center.y;
    var q2 = (lengthOfCathetusSecondTriangle * lengthOfCathetusSecondTriangle - line.getPoints().secondPoint.getRadius() * line.getPoints().secondPoint.getRadius() + point.y * point.y - center.y * center.y + point.x * point.x - center.x * center.x) / 2;
    var A2 = c2 * c2 + e2 * e2;
    var B2 = (point.x * e2 * c2 - c2 * q2 - point.y * e2 * e2) * 2;
    var C2 = point.x * point.x * e2 * e2 - 2 * point.x * e2 * q2 + q2 * q2 + point.y * point.y * e2 * e2 - line.getPoints().secondPoint.getRadius() * line.getPoints().secondPoint.getRadius() * e2 * e2;

    result.ya = (Math.sqrt(B * B - 4 * A * C) - B) / (2 * A);
    result.yb = (-Math.sqrt(B * B - 4 * A * C) - B) / (2 * A);
    result.xa = (q - result.ya * c) / e;
    result.xb = (q - result.yb * c) / e;
    result.ya2 = (Math.sqrt(B2 * B2 - 4 * A2 * C2) - B2) / (2 * A2);
    result.yb2 = (-Math.sqrt(B2 * B2 - 4 * A2 * C2) - B2) / (2 * A2);
    result.xa2 = (q2 - result.ya2 * c2) / e2;
    result.xb2 = (q2 - result.yb2 * c2) / e2;

    return result;
}

/**
    Function returns the length of the line. On the input we give the 2 points (4 coordinates x1y1 and x2y2)
*/

function getLineLength(x1, y1, x2, y2) {
    var res = Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
    return res;
}

/**
    Function draws the graph basis on the passed parameters
    labelsForX - labels that will be displayed on the x axis
    dataSet - object that can contain the following parameters:
    [{
        label: 'apples',
        data: [120, 190, 30, 170, 60, 30, 70],
        backgroundColor: "rgba(153,255,51,0.4)",
        borderColor: "rgba(153,255,51,1)",
        fill: false
    }, {
        label: 'oranges',
        data: [20, 290, 50, 50, 20, 30, 100],
        backgroundColor: "rgba(255,153,0,0.4)",
        borderColor: "rgba(255,153,0,1)",
        fill: false
    }]
*/

function drawGraph(labelsForX, dataSet) {
    var ctx = document.getElementById("myChart").getContext("2d");
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labelsForX,
            datasets: dataSet
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

/**
    Function for parameters convertation from the array to the object. First parameter of the array must be labels, the following parameters will be parsed as a pressure
*/

function convertParametersForGraph(data) {
    var dataObject = {
        label: [],
        pressure: []
    };
    for (var k = 0; k < data[0].length - 1; k++) {
        dataObject.pressure[k] = new Array(data[0].length - 1);
    }
    for (var i = 0; i < data.length; i++) {
        dataObject.label[i] = data[i][0];
        for (var j = 0; j < data[i].length-1; j++) {
            dataObject.pressure[j][i] = data[i][j+1];
        }
    }
    return dataObject;
}

/**
    Function for convertation of the pressure to the dataset object
*/

function convertDataToDataset(data) {
    var dataset = [];
    for (var i = 0; i < data.pressure.length; i++) {
        dataset[i] = {
            label: 'pressure' + i,
            data: data.pressure[i],
            borderColor: borderColors[i],
            fill: false
        };
    }
    return dataset;
}

/**
    Function that find the the QuantativeCharacteristic
*/

function findQuantativeCharacteristic(speed, breakingTime, maxLoadOnProp, speedDown, greenProp, redProp) {
    var summMomentOfStrength = 0;
    pointsCollection.forEach(function (point) {
        if (point.getColor() == "gray") {
            var angle = Math.atan(Math.abs(greenProp.getPosition().y - point.getPosition().y) / Math.abs(point.getPosition().x - greenProp.getPosition().x));
            var projection = point.getMass() * speed * Math.cos(angle);
            var power = projection / breakingTime;
            var momentOfStrength = power * getLineLength(point.getPosition().x, point.getPosition().y, greenProp.getPosition().x, greenProp.getPosition().y);
            summMomentOfStrength += momentOfStrength;
        }
    });
    //n - a quantitative characteristic of the prop reaction
    var n = summMomentOfStrength / getLineLength(greenProp.getPosition().x, greenProp.getPosition().y, redProp.getPosition().x, redProp.getPosition().y);
    return n;
}

/**
    Function returns the circle square
*/

function getSquare(point){
    return Math.PI * Math.pow(point.getRadius(), 2);
}
/*End of common functions block*/