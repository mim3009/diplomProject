//доделать графики, ложить все обьекты в локал сторедж, сделать обработку остальных вычислений через воркер
/*Block for start initialization of elements*/

var pointsCollection = new Set();
var linesCollection = new Set();
var svg = document.getElementsByClassName("svgForDrawing")[0];
var svgOffset = svg.getBoundingClientRect();
var svgForGraph = document.getElementsByClassName("svgForGraph")[0];
var svgForGraphOffset = svgForGraph.getBoundingClientRect();
var s = 0.2;
var g = 9.80665;
var dataArray = new Array();
var time = undefined;

//Test variables for visible coordinates output
var xxx = document.getElementById("x");
var yyy = document.getElementById("y");

(function () {
    let inputsForTests = document.getElementById("inputsForTests");
    inputsForTests.style.display = "none";

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

var controlButtonInputs = document.getElementById("controlButtonInputs");
controlButtonInputs.addEventListener("click", inputsShow);

function tableWithParametersShow() {
    let tablePoints = document.getElementById("tables");
    let inputsForTests = document.getElementById("inputsForTests");
    tablePoints.style.display = "block";
    inputsForTests.style.display = "none";
}

function inputsShow() {
    let tablePoints = document.getElementById("tables");
    let inputsForTests = document.getElementById("inputsForTests");
    inputsForTests.style.display = "block";
    tablePoints.style.display = "none";
}

/*End of control buttons handlers block*/

/**/

var calculateButton = document.getElementById("calculate");
calculateButton.addEventListener("click", makeCalculations, false);

function makeCalculations() {
    var speed = Number(document.getElementById("speed").value);
    time = Number(document.getElementById("breakingTime").value);
    var maxLoadOnProp = Number(document.getElementById("maxLoad").value);
    var distribution = undefined;

    var radiosForDistribution = document.getElementsByName('radiosForDistribution');
    for (var i = 0; i < radiosForDistribution.length; i++) {
        if (radiosForDistribution[i].type == "radio" && radiosForDistribution[i].checked) {
            distribution = radiosForDistribution[i].value;
        }
    }

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
    
    if (greenProp && redProp && maxLoadOnProp) {
        if (speed && time) {
            //fill the dataArray with the quantitative characteristics
            dataArray = new Array();
            findArrayOfQuantativeCharacteristics(speed, time, maxLoadOnProp, distribution, speed / time, greenProp, redProp);
        }
        else {
            //clarify about square and its angle to other points
            //pressure = massOfAllPoints * g / s;
        }
    }
    else {
        console.log("Prop or maxLoad are not defined");
    }
}

function findArrayOfQuantativeCharacteristics(speed, breakingTime, maxLoadOnProp, distribution, speedDown, greenProp, redProp) {
    if (speed >= 0 && breakingTime > 0) {
        var summMomentOfStrength = 0;
        pointsCollection.forEach(function (point) {
            if (point.getColor() == "gray") {
                //what about gravity in the main formula?
                var angle = Math.atan(Math.abs(greenProp.getPosition().y - point.getPosition().y) / Math.abs(point.getPosition().x - greenProp.getPosition().x));
                var projection = point.getMass() * speed * Math.cos(angle);
                var power = projection / time;
                var momentOfStrength = power * getLineLength(point.getPosition().x, point.getPosition().y, greenProp.getPosition().x, greenProp.getPosition().y);
                summMomentOfStrength += momentOfStrength;
            }
        });
        //n - a quantitative characteristic of the prop reaction
        var n = summMomentOfStrength / getLineLength(greenProp.getPosition().x, greenProp.getPosition().y, redProp.getPosition().x, redProp.getPosition().y);
        dataArray.push([breakingTime, speed, n, n > maxLoadOnProp]);
        console.log(n);
        if (distribution == "Uniform") {
            speed -= Math.randomUniform(speedDown, 2);
        }
        else if (distribution == "Normal") {
            speed -= Math.randomGaussian(speedDown, 1);
        }
        else if (distribution == "Exponential") {
            speed -= Math.randomExponential(speedDown);
        }
        findArrayOfQuantativeCharacteristics(speed, breakingTime - 1, maxLoadOnProp, distribution, speedDown, greenProp, redProp);
    }
}

var displayGraphButton = document.getElementById("showGraph");
var graph = document.getElementById("graph");

displayGraphButton.addEventListener("click", makeGraph, false);

function makeGraph() {
    var graph = new Graph(dataArray);
    graph.create();
}

var save = document.getElementById("save");
save.addEventListener("click", saveDataToDB, false);

function saveDataToDB() {
    console.log("Normal" + Math.randomGaussian(4, 1));
    console.log("uniform" + Math.randomUniform(5, 2));
    console.log("exp" + Math.randomExponential(5));
}

var load = document.getElementById("load");
load.addEventListener("click", loadDataFromDB, false);

function loadDataFromDB() {

}
/**/

/*Block for common functions*/

function getAngle(center, point) {
    var x = point.x - center.x;
    var y = point.y - center.y;
    if (x == 0) return (y > 0) ? 180 : 0;
    var a = Math.atan(y / x) * 180 / Math.PI;
    a = (x > 0) ? a + 90 : a + 270;
    return a;
}

function findPointByElement(element) {
    let point = undefined;
    pointsCollection.forEach(function (value) {
        if (value.getElement() === element) {
            point = value;
        }
    });
    return point;
}

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

function getLineLength(x1, y1, x2, y2) {
    var res = Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
    return res;
}

function get_angle(center, point) {
    var x = point.x - center.x;
    var y = point.y - center.y;
    if (x == 0) return (y > 0) ? 180 : 0;
    var a = Math.atan(y / x) * 180 / Math.PI;
    a = (x > 0) ? a + 90 : a + 270;
    return a;
}
/*End of common functions block*/