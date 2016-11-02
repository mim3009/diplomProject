function Graph(pointsCollection) {
    var points = pointsCollection;

    this.getPoints = function () {
        return points;
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
    var gForXCoordinateArrow = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    gForXCoordinateArrow.setAttribute("class", "grid x-grid");
    gForXCoordinateArrow.setAttribute("id", "xGrid");

    var lineX = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    lineX.setAttribute("x1", "90");
    lineX.setAttribute("x2", "90");
    lineX.setAttribute("y1", "5");
    lineX.setAttribute("y2", "371");

    var gForYCoordinateArrow = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    gForYCoordinateArrow.setAttribute("class", "grid y-grid");
    gForYCoordinateArrow.setAttribute("id", "yGrid");

    var lineY = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    lineY.setAttribute("x1", "90");
    lineY.setAttribute("x2", "705");
    lineY.setAttribute("y1", "370");
    lineY.setAttribute("y2", "370");

    var gForXLabels = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    gForXLabels.setAttribute("class", "labels x-labels");

    var firstText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    firstText.setAttribute("x", "100");
    firstText.setAttribute("y", "400");
    var textNodeForFirstText = document.createTextNode("2008");
    firstText.appendChild(textNodeForFirstText);

    var secondText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    secondText.setAttribute("x", "246");
    secondText.setAttribute("y", "400");
    var textNodeForSecondText = document.createTextNode("2009");
    secondText.appendChild(textNodeForSecondText);

    var gForYLabels = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    gForYLabels.setAttribute("class", "labels y-labels");

    var firstTextY = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    firstTextY.setAttribute("x", "80");
    firstTextY.setAttribute("y", "15");
    var textNodeForFirstTextY = document.createTextNode("15");
    firstTextY.appendChild(textNodeForFirstTextY);

    var secondTextY = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    secondTextY.setAttribute("x", "80");
    secondTextY.setAttribute("y", "131");
    var textNodeForSecondTextY = document.createTextNode("10");
    secondTextY.appendChild(textNodeForSecondTextY);

    var polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    polyline.setAttribute("fill", "none");
    polyline.setAttribute("class", "chartLine");
    polyline.setAttribute("stroke", "#0074d9");
    polyline.setAttribute("stroke-width", "2");
    polyline.setAttribute("points", "90,192 240,141 388,179 531,200 677,104");

    var gForCircles = document.createElementNS('http://www.w3.org/2000/svg', 'g');

    var circle1 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle1.setAttribute("class", "data");
    circle1.setAttribute("cx", "90");
    circle1.setAttribute("cy", "192");
    circle1.setAttribute("data-value", "7.2");
    circle1.setAttribute("r", "5");

    var circle2 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle2.setAttribute("class", "data");
    circle2.setAttribute("cx", "240");
    circle2.setAttribute("cy", "141");
    circle2.setAttribute("data-value", "8.1");
    circle2.setAttribute("r", "5");

    var circle3 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle3.setAttribute("class", "data");
    circle3.setAttribute("cx", "388");
    circle3.setAttribute("cy", "179");
    circle3.setAttribute("data-value", "7.7");
    circle3.setAttribute("r", "5");

    var circle4 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle4.setAttribute("class", "data");
    circle4.setAttribute("cx", "531");
    circle4.setAttribute("cy", "200");
    circle4.setAttribute("data-value", "6.8");
    circle4.setAttribute("r", "5");

    var circle5 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle5.setAttribute("class", "data");
    circle5.setAttribute("cx", "677");
    circle5.setAttribute("cy", "104");
    circle5.setAttribute("data-value", "6.7");
    circle5.setAttribute("r", "5");

    gForCircles.appendChild(circle1);
    gForCircles.appendChild(circle2);
    gForCircles.appendChild(circle3);
    gForCircles.appendChild(circle4);
    gForCircles.appendChild(circle5);
    gForXLabels.appendChild(firstText);
    gForXLabels.appendChild(secondText);
    gForYLabels.appendChild(firstTextY);
    gForYLabels.appendChild(secondTextY);
    gForXCoordinateArrow.appendChild(lineX);
    gForYCoordinateArrow.appendChild(lineY);
    svgForGraph.appendChild(gForXCoordinateArrow);
    svgForGraph.appendChild(gForYCoordinateArrow);
    svgForGraph.appendChild(gForXLabels);
    svgForGraph.appendChild(gForYLabels);
    svgForGraph.appendChild(polyline);
    svgForGraph.appendChild(gForCircles);
}