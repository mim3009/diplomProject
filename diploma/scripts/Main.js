//ложить все обьекты в локал сторедж, сделать обработку остальных вычислений через воркер, переносить точки между режимами через локал сторедж
/*Block for start initialization of elements*/
var radiosForMode = document.getElementsByName("radiosForMode");
var mode = undefined;

for (let i = 0; i < radiosForMode.length; i++) {
    if (radiosForMode[i].checked) {
        mode = radiosForMode[i].value;
        break;
    }
}

var dataForGraphTrainMode = new Array();
var dataForGraphBeamsMode = new Array();
var pointsCollection = new Set();
var linesCollection = new Set();
var svg = document.getElementsByClassName("svgForDrawing")[0];
var svgOffset = svg.getBoundingClientRect();
var s = 0.2;
var g = 9.80665;
var borderColors = ["rgba(153,255,51,1)", "rgba(255, 0, 51, 1)", "rgba(0, 0, 255, 1)"];

//Test variables for visible coordinates output
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
    let tablePoints = document.getElementById("tables");
    let inputsForTestTrain = document.getElementById("inputsForTestTrain");
    let modes = document.getElementById("modes");
    modes.style.display = "block";
    if (mode == "train") {
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
}

function useBeams() {
    document.getElementsByClassName("svgForDrawing")[0].style.backgroundImage = "url('../images/image2.jpg')";
    mode = beamsRadio.value;
    document.getElementById("inputsForTestTrain").style.display = "none";
    document.getElementById("inputsForTestBeams").style.display = "block";
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
        var speed = Number(document.getElementById("speed").value);
        var time = Number(document.getElementById("breakingTime").value);
        var maxLoadOnProp = Number(document.getElementById("maxLoad").value);
        var greenProp = undefined;
        var redProp = undefined;

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
                var pressure = findQuantativeCharacteristic(speed, time, maxLoadOnProp, speed / time, greenProp, redProp);
                document.getElementById("result").innerHTML = pressure;
                dataForGraphTrainMode.push([speed, pressure]);
            }
            else {
                console.log("speed or time are not defined");
            }
        }
        else {
            console.log("greenProp or redProp or maxLoad are not defined or there are too many green or red points");
        }
    }
    else if (mode == "beams") {
        if(countOfGreenProp == 3 && countOfRedProp == 1){
            var greenProp = new Array();
            var redProp = undefined;

            pointsCollection.forEach(function (value) {
                if (value.getIsProp()) {
                    greenProp.push(value);
                }
                if (value.getColor() == "red") {
                    redProp = value;
                }
            });
            dataForGraphBeamsMode.push([redProp.getMass(), greenProp[0].getMass(), greenProp[1].getMass(), greenProp[2].getMass()]);
        }
        else {
            console.log("countOfGreenProp != 3, countOfRedProp != 1");
        }
    }
}

function findQuantativeCharacteristic(speed, breakingTime, maxLoadOnProp, speedDown, greenProp, redProp) {
    var summMomentOfStrength = 0;
    pointsCollection.forEach(function (point) {
        if (point.getColor() == "gray") {
            //what about gravity in the main formula?
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

var displayGraphButton = document.getElementById("showGraph");
var graph = document.getElementById("graph");

displayGraphButton.addEventListener("click", makeGraph, false);

function makeGraph() {
    var myChart = undefined;
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
//there are no check for white line, if I'll have a time I have to add it
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
save.addEventListener("click", saveDataToDB, false);

function saveDataToDB() {
    
}

var load = document.getElementById("load");
load.addEventListener("click", loadDataFromDB, false);

function loadDataFromDB() {

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
    let point = undefined;
    pointsCollection.forEach(function (value) {
        if (value.getElement() === element) {
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
        xa: undefined,
        xb: undefined,
        ya: undefined,
        yb: undefined,
        xa2: undefined,
        xb2: undefined,
        ya2: undefined,
        yb2: undefined
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
/*End of common functions block*/