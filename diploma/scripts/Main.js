//сделать графики, ложить все обьекты в локал сторедж
/*Block for start initialization of elements*/

var pointsCollection = new Set();
var linesCollection = new Set();
var svg = document.getElementsByClassName("svgForDrawing")[0];
var svgOffset = svg.getBoundingClientRect();
var svgForGraph = document.getElementsByClassName("svgForGraph")[0];
var svgForGraphOffset = svgForGraph.getBoundingClientRect();
var s = 0.2;
var g = 9.80665;

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
    var speed = document.getElementById("speed").value;
    var breakingTime = document.getElementById("breakingTime").value;
    var maxLoadOnProp = document.getElementById("maxLoad").value;
    var prop = undefined;
    pointsCollection.forEach(function (value) {
        if (value.getIsProp()) {
            prop = value;
        }
    });
    
    if (prop && maxLoadOnProp) {
        var pressure = 0;
        if (speed && breakingTime) {
            pointsCollection.forEach(function (point) {
                if (point.getColor() == "red") {
                    var angle = Math.atan((prop.getPosition().y - point.getPosition().y) / (point.getPosition().x - prop.getPosition().x)); //need to clarify this formula and all variations, also need to clarify about gravity
                    var projection = point.getMass() * speed * Math.cos(angle);
                    var power = projection / breakingTime;
                    var momentOfStrength = power * getLineLength(point.getPosition().x, point.getPosition().y, prop.getPosition().x, prop.getPosition().y);
                    pressure += momentOfStrength;
                }
            });
        }
        else {
            var massOfAllPoints = 0;
            pointsCollection.forEach(function (point) {
                if (point.getColor() == "red") {
                    massOfAllPoints += point.getMass();
                }
            });
            //clarify
            pressure = massOfAllPoints * g / s;
        }
        console.log(pressure);
        if (pressure > maxLoadOnProp) {
            console.log("broken");
        }
        else {
            console.log("withstood");
        }
    }
    else {
        console.log("Prop or maxLoad are not defined");
    }
}


var displayGraphButton = document.getElementById("showGraph");
var graph = document.getElementById("graph");

displayGraphButton.addEventListener("click", makeGraph, false);

function makeGraph() {
    var graph = new Graph(pointsCollection);
    graph.create();
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