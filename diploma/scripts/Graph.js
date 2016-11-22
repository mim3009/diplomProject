//переделать на Graph(x, xName, y, yName, [z]);
function Graph(dataArray) {
    var dataArray = dataArray;

    this.getDataArray = function () {
        return dataArray;
    }
}

Graph.prototype.create = function () {
    if (window.getComputedStyle(graph, null).getPropertyValue("display") == "none") {
        graph.style.display = "block";
        displayGraphButton.value = "Close Graph";
        this.draw();
    }
    else {
        graph.style.display = "none";
        displayGraphButton.value = "Show Graph";
        while (svgForGraph.firstChild) {
            svgForGraph.removeChild(svgForGraph.firstChild);
        }
        delete this;
    }
}

Graph.prototype.draw = function () {
    var dataArray = this.getDataArray();
    var maxY = 0;
    
    dataArray.forEach(function (item, i, arr) {
        if (item[1] > maxY) {
            maxY = item[1];
        }
    });

    var shiftX = 730 / dataArray.length;

    var xAxisTotalValue = 40;

    var lineX = createLine(40, 460, 770, 460, lineClass = "grid x-grid", lineID = "xGrid");
    var lineY = createLine(40, 20, 40, 460, lineClass = "grid y-grid", lineID = "yGrid");

    var gForXLabels = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    gForXLabels.setAttribute("class", "labels x-labels");

    var xAxisText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    xAxisText.setAttribute("x", "770");
    xAxisText.setAttribute("y", "480");
    var textNodeForXAxisText = document.createTextNode("Time");
    xAxisText.appendChild(textNodeForXAxisText);

    var gForYLabels = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    gForYLabels.setAttribute("class", "labels y-labels");

    var yAxisText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    yAxisText.setAttribute("x", "40");
    yAxisText.setAttribute("y", "13");
    var textNodeForYAxisText = document.createTextNode("Speed");
    yAxisText.appendChild(textNodeForYAxisText);

    var gForCircles = document.createElementNS('http://www.w3.org/2000/svg', 'g');

    dataArray.forEach(function (item, i, arr) {
        var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute("class", "data");
        circle.setAttribute("style", "position: relative; stroke-width: 1; z-index: 2;");
        circle.setAttribute("cx", xAxisTotalValue);
        circle.setAttribute("cy", 460 - ((item[1] * 440) / maxY));
        if (item[3]) {
            circle.setAttribute("fill", "red");
        }
        else {
            circle.setAttribute("fill", "green");
        }
        circle.setAttribute("data-time", item[0]);
        circle.setAttribute("data-speed", item[1]);
        circle.setAttribute("data-value", item[2]);        
        circle.setAttribute("r", "5");

        var pressureText = undefined;
        var textNodePressure = undefined;
        var speedText = undefined;
        var timeText = undefined;
        var aimLineX = undefined;
        var aimLineY = undefined;

        circle.addEventListener("mouseover", function () {
            yAxisText.setAttribute("style", "display: none;");
            xAxisText.setAttribute("style", "display: none;");

            pressureText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            pressureText.setAttribute("x", Number(this.getAttribute("cx")) + 20);
            pressureText.setAttribute("y", Number(this.getAttribute("cy")) - 5);
            textNodePressure = document.createTextNode(Number(this.getAttribute("data-value")).toFixed(2));
            pressureText.appendChild(textNodePressure);
            gForCircles.appendChild(pressureText);

            speedText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            speedText.setAttribute("x", Number(this.getAttribute("cx")) - 7);
            speedText.setAttribute("y", 475);
            textNodeSpeed = document.createTextNode(this.getAttribute("data-time"));
            speedText.appendChild(textNodeSpeed);
            gForCircles.appendChild(speedText);

            timeText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            timeText.setAttribute("x", 40);
            timeText.setAttribute("y", Number(this.getAttribute("cy")) - 5);
            textNodeTime = document.createTextNode(Number(this.getAttribute("data-speed")).toFixed(2));
            timeText.appendChild(textNodeTime);
            gForCircles.appendChild(timeText);
            
            aimLineX = createLine(Number(this.getAttribute("cx")), 20, Number(this.getAttribute("cx")), 460, lineClass = "grid x-grid", lineID = "xGrid");
            aimLineY =  createLine(40, Number(this.getAttribute("cy")), 770, Number(this.getAttribute("cy")), lineClass = "grid y-grid", lineID = "yGrid");

            svgForGraph.appendChild(aimLineX);
            svgForGraph.appendChild(aimLineY);
        }, false);

        circle.addEventListener("mouseout", function () {
            yAxisText.setAttribute("style", "display: block;");
            xAxisText.setAttribute("style", "display: block;");
            pressureText.removeChild(textNodePressure);
            gForCircles.removeChild(pressureText);
            speedText.removeChild(textNodeSpeed);
            gForCircles.removeChild(speedText);
            timeText.removeChild(textNodeTime);
            gForCircles.removeChild(timeText);
            svgForGraph.removeChild(aimLineX);
            svgForGraph.removeChild(aimLineY);
        }, false);

        xAxisTotalValue += shiftX;

        gForCircles.appendChild(circle);
    });
    svgForGraph.appendChild(gForCircles);

    var allGraphPoints = document.getElementsByClassName("data");
    for (let i = 0; i < allGraphPoints.length - 1; i++) {
        var line = createLine(allGraphPoints[i].getAttribute("cx"), allGraphPoints[i].getAttribute("cy"), allGraphPoints[i + 1].getAttribute("cx"), allGraphPoints[i + 1].getAttribute("cy"), "graphLine");
        svgForGraph.appendChild(line);
    }
    
    gForXLabels.appendChild(xAxisText);
    gForYLabels.appendChild(yAxisText);
    svgForGraph.appendChild(lineX);
    svgForGraph.appendChild(lineY);
    svgForGraph.appendChild(gForXLabels);
    svgForGraph.appendChild(gForYLabels);
}

function createLine(x1, y1, x2, y2, lineClass = "", lineID = "") {
    var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    if (lineClass) {
        line.setAttribute("class", lineClass);
    }
    if (lineID) {
        line.setAttribute("id", lineID);
    }
    
    return line;
}