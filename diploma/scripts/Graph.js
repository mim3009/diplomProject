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
    var maxX = 0;
    var maxY = 0;
    
    dataArray.forEach(function (item, i, arr) {
        if (item[0] > maxX) {
            maxX = item[0];
        }
        if (item[1] > maxY) {
            maxY = item[1];
        }
    });

    var shiftX = 730 / maxX;

    var xAxisTotalValue = 40;

    var lineX = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    lineX.setAttribute("class", "grid x-grid");
    lineX.setAttribute("id", "xGrid");
    lineX.setAttribute("x1", "40");
    lineX.setAttribute("x2", "770");
    lineX.setAttribute("y1", "460");
    lineX.setAttribute("y2", "460");

    var lineY = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    lineY.setAttribute("class", "grid y-grid");
    lineY.setAttribute("id", "yGrid");
    lineY.setAttribute("x1", "40");
    lineY.setAttribute("x2", "40");
    lineY.setAttribute("y1", "20");
    lineY.setAttribute("y2", "460");

    var gForXLabels = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    gForXLabels.setAttribute("class", "labels x-labels");

    var xAxisText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    xAxisText.setAttribute("x", "390");
    xAxisText.setAttribute("y", "480");
    var textNodeForXAxisText = document.createTextNode("Time");
    xAxisText.appendChild(textNodeForXAxisText);

    var gForYLabels = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    gForYLabels.setAttribute("class", "labels y-labels");

    var yAxisText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    yAxisText.setAttribute("x", "20");
    yAxisText.setAttribute("y", "230");
    yAxisText.setAttribute("transform", "translate(-205, 240) rotate(270)");
    var textNodeForYAxisText = document.createTextNode("Speed");
    yAxisText.appendChild(textNodeForYAxisText);

    var gForCircles = document.createElementNS('http://www.w3.org/2000/svg', 'g');

    dataArray.forEach(function (item, i, arr) {
        var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute("class", "data");
        circle.setAttribute("cx", xAxisTotalValue);
        circle.setAttribute("cy", 460 - ((item[1] * 440) / maxY));
        if (item[3]) {
            circle.setAttribute("fill", "green");
        }
        circle.setAttribute("data-value", "7.2");
        circle.setAttribute("r", "3");
        xAxisTotalValue += shiftX;

        gForCircles.appendChild(circle);
    });
    svgForGraph.appendChild(gForCircles);

    var allGraphPoints = document.getElementsByClassName("data");
    for (let i = 0; i < allGraphPoints.length - 1; i++) {
        var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute("style", "stroke: blue; stroke-width: 3; z-index: 1;");
        line.setAttribute("x1", allGraphPoints[i].getAttribute("cx"));
        line.setAttribute("y1", allGraphPoints[i].getAttribute("cy"));
        line.setAttribute("x2", allGraphPoints[i + 1].getAttribute("cx"));
        line.setAttribute("y2", allGraphPoints[i + 1].getAttribute("cy"));

        svgForGraph.appendChild(line);
    }
    
    gForXLabels.appendChild(xAxisText);
    gForYLabels.appendChild(yAxisText);
    svgForGraph.appendChild(lineX);
    svgForGraph.appendChild(lineY);
    svgForGraph.appendChild(gForXLabels);
    svgForGraph.appendChild(gForYLabels);
}