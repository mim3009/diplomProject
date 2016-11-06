function Graph(dataArray) {
    var dataArray = dataArray;

    this.getDataArray = function () {
        return dataArray;
    }
}

Graph.prototype.create = function () {
    if (window.getComputedStyle(graph, null).getPropertyValue("display") == "none") {
        graph.style.display = "block";
        displayGraphButton.value = "Hide Graph";
        this.draw();
    }
    else {
        graph.style.display = "none";
        displayGraphButton.value = "Show Graph";
    }
}

Graph.prototype.draw = function () {
    var dataArray = this.getDataArray();

    var testData = [[90,192], [240,141], [388,179], [531,200], [677,104]];

    var lineX = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    lineX.setAttribute("class", "grid y-grid");
    lineX.setAttribute("id", "yGrid");
    lineX.setAttribute("x1", "40");
    lineX.setAttribute("x2", "770");
    lineX.setAttribute("y1", "460");
    lineX.setAttribute("y2", "460");

    var lineY = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    lineY.setAttribute("class", "grid x-grid");
    lineY.setAttribute("id", "xGrid");
    lineY.setAttribute("x1", "40");
    lineY.setAttribute("x2", "40");
    lineY.setAttribute("y1", "20");
    lineY.setAttribute("y2", "460");

    var gForXLabels = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    gForXLabels.setAttribute("class", "labels x-labels");

    var xAxisText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    xAxisText.setAttribute("x", "390");
    xAxisText.setAttribute("y", "480");
    var textNodeForXAxisText = document.createTextNode("time");
    xAxisText.appendChild(textNodeForXAxisText);

    var gForYLabels = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    gForYLabels.setAttribute("class", "labels y-labels");

    var yAxisText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    yAxisText.setAttribute("x", "20");
    yAxisText.setAttribute("y", "230");
    yAxisText.setAttribute("transform", "translate(-205, 240) rotate(270)");
    var textNodeForYAxisText = document.createTextNode("Pressure");
    yAxisText.appendChild(textNodeForYAxisText);

    var gForCircles = document.createElementNS('http://www.w3.org/2000/svg', 'g');

    testData.forEach( function (item, i, arr) {
        var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute("class", "data");
        circle.setAttribute("cx", item[0]);
        circle.setAttribute("cy", item[1]);
        circle.setAttribute("data-value", "7.2");
        circle.setAttribute("r", "5");

        gForCircles.appendChild(circle);
    });

    for (let i = 0; i < testData.length-1; i++) {
        var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute("style", "stroke: blue; stroke-width: 3; z-index: 1;");
        line.setAttribute("x1", testData[i][0]);
        line.setAttribute("y1", testData[i][1]);
        line.setAttribute("x2", testData[i+1][0]);
        line.setAttribute("y2", testData[i + 1][1]);

        svgForGraph.appendChild(line);
    }
    
    gForXLabels.appendChild(xAxisText);
    gForYLabels.appendChild(yAxisText);
    svgForGraph.appendChild(lineX);
    svgForGraph.appendChild(lineY);
    svgForGraph.appendChild(gForXLabels);
    svgForGraph.appendChild(gForYLabels);
    svgForGraph.appendChild(gForCircles);
}