function Line(point1, point2) {
    var points = {
        firstPoint : point1,
        secondPoint : point2
    };

    var element = undefined;

    var coordinates = {
        x1: undefined,
        x2: undefined,
        y1: undefined,
        y2: undefined
    }

    var row = undefined;
    var color = undefined;
    var polygon = undefined;
    var length = undefined;
    var isFixed = false;

    this.getPoints = function () {
        return points;
    }

    this.getElement = function () {
        return element;
    }

    this.setElement = function (newElement) {
        element = newElement;
        element.setAttribute("style", "stroke: " + color + "; stroke-width: 3; z-index: 1;");
    }

    this.getCoordinates = function () {
        return coordinates;
    }

    this.setCoordinates = function (newX1, newY1, newX2, newY2) {
        coordinates.x1 = newX1;
        coordinates.y1 = newY1;
        coordinates.x2 = newX2;
        coordinates.y2 = newY2;
        element.setAttribute("x1", newX1 - svgOffset.left);
        element.setAttribute("y1", newY1 - svgOffset.top);
        element.setAttribute("x2", newX2 - svgOffset.left);
        element.setAttribute("y2", newY2 - svgOffset.top);
        var edgePoints = findPolygonPointsCorrectPosition(this);
        polygon.setAttribute("points", Math.floor(edgePoints.xa) + "," + Math.floor(edgePoints.ya) + " " + Math.floor(edgePoints.xa2) + "," + Math.floor(edgePoints.ya2) + " " + Math.floor(edgePoints.xb2) + "," + Math.floor(edgePoints.yb2) + " " + Math.floor(edgePoints.xb) + "," + Math.floor(edgePoints.yb));
        row.cells[0].innerHTML = newX1;
        row.cells[1].innerHTML = newY1;
        row.cells[2].innerHTML = newX2;
        row.cells[3].innerHTML = newY2;
    }

    this.getRow = function () {
        return row;
    }

    this.setRow = function (newRow) {
        row = newRow;
    }

    this.getColor = function () {
        return color;
    };

    this.setColor = function (newColor) {
        color = newColor;
        element.setAttribute("style", "stroke: " + newColor + "; stroke-width: 3; z-index: 1;");
        row.cells[4].innerHTML = newColor;
        row.style.background = newColor;
    }

    this.getPolygon = function () {
        return polygon;
    }

    this.setPolygon = function (newPolygon) {
        polygon = newPolygon;
        polygon.setAttribute("style", "fill: #FFECAD; stroke: purple; stroke-width: 1;");
    }

    this.getLength = function () {
        return getLineLength(coordinates.x1, coordinates.y1, coordinates.x2, coordinates.y2);
    }

    this.getIsFixed = function () {
        return isFixed;
    }

    this.setIsFixed = function (newIsFixed) {
        isFixed = newIsFixed;
    }
}

Line.prototype.create = function () {
    var lineContext = this;

    var isLineAlreadyExists = false;

    lineContext.getPoints().firstPoint.getBindedLines().forEach(function (lineOfFirstPoint) {
        lineContext.getPoints().secondPoint.getBindedLines().forEach(function (lineOfSecondPoint) {
            if(lineOfFirstPoint === lineOfSecondPoint){
                isLineAlreadyExists = true;
            }
        });
    });

    if (!isLineAlreadyExists) {
        var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        var table = document.getElementById("linesTable");
        var row = table.insertRow(table.rows.length);
        var cell0 = row.insertCell(0);
        var cell1 = row.insertCell(1);
        var cell2 = row.insertCell(2);
        var cell3 = row.insertCell(3);
        var cell4 = row.insertCell(4);
        var polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');

        lineContext.setElement(line);
        lineContext.setPolygon(polygon);
        lineContext.setRow(row);
        lineContext.setCoordinates(lineContext.getPoints().firstPoint.getPosition().x, lineContext.getPoints().firstPoint.getPosition().y, lineContext.getPoints().secondPoint.getPosition().x, lineContext.getPoints().secondPoint.getPosition().y);
        lineContext.setColor("red");

        lineContext.changeColor = lineContext.changeColor.bind(lineContext);
        lineContext.getElement().oncontextmenu = lineContext.changeColor;

        svg.appendChild(lineContext.getPolygon());
        svg.appendChild(lineContext.getElement());
    }      
}

Line.prototype.changeColor = function () {
    var lineContext = this;
    event.preventDefault ? event.preventDefault() : event.returnValue = false;
    if (lineContext.getColor() == "red") {
        lineContext.setColor("white");
        lineContext.setIsFixed(true);
    }
    else if (lineContext.getColor() == "white") {
        lineContext.delete();
    }
}

Line.prototype.delete = function () {
    linesCollection.delete(this);
    var row = this.getRow();
    row.parentNode.removeChild(row);
    svg.removeChild(this.getElement());
    svg.removeChild(this.getPolygon());
    this.getPoints().firstPoint.getBindedLines().delete(this);
    this.getPoints().secondPoint.getBindedLines().delete(this);
    delete this;
}

Line.prototype.getSecondPoint = function (point) {
    var secondPoint = undefined;
    var points = this.getPoints();
    if (points.firstPoint != point) {
        secondPoint = points.firstPoint;
    }
    else {
        secondPoint = points.secondPoint;
    }
    return secondPoint;
}