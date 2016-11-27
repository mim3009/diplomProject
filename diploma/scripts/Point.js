function Point(pointRadius, pointMass) {
    //radius and mass are 10 by default
    var radius = pointRadius;
    var mass = pointMass;
    var color = "gray";
    var position = {
        x : undefined,
        y : undefined
    };
    var element = undefined;
    var row = undefined;
    var isProp = false;
    var bindedLines = new Set();

    this.getRadius = function () {
        return radius;
    };

    this.setRadius = function (newRadius) {
        radius = newRadius;
        element.style.height = newRadius * 2 + "px";
        element.style.width = newRadius * 2 + "px";
        row.cells[3].innerHTML = newRadius;
    }

    this.getMass = function () {
        return mass;
    };

    this.setMass = function (newMass) {
        mass = newMass;
    }

    this.getColor = function () {
        return color;
    };

    this.setColor = function (newColor) {
        color = newColor;
        element.style.background = newColor;
        row.cells[2].innerHTML = newColor;
        row.style.background = newColor;
    }

    this.getPosition = function () {
        return position;
    }

    this.setPosition = function (x, y, transform = false) {
        //add if
        element.style.left = x + "px";
        element.style.top = y + "px";
        if(!transform){
            element.style.left = x - radius + "px";
            element.style.top = y - radius + "px";
            position.x = x;
            position.y = y;
            row.cells[0].innerHTML = position.x;
            row.cells[1].innerHTML = position.y;
        }
        this.getBindedLines().forEach(function (line) {
            line.setCoordinates(line.getPoints().firstPoint.getPosition().x, line.getPoints().firstPoint.getPosition().y, line.getPoints().secondPoint.getPosition().x, line.getPoints().secondPoint.getPosition().y);
        });
    }

    this.getElement = function () {
        return element;
    }

    this.setElement = function (newElement) {
        element = newElement;
    }

    this.getRow = function () {
        return row;
    }

    this.setRow = function (newRow) {
        row = newRow;
    }

    this.getIsProp = function () {
        return isProp;
    };

    this.setIsProp = function () {
        isProp = true;
    }

    this.getBindedLines = function () {
        return bindedLines;
    }

    this.setBindedLines = function (newBindedLine) {
        bindedLines.add(newBindedLine);
    }
};

Point.prototype.create = function () {
    var pointContext = this;
    var div = document.createElement("div");
    var table = document.getElementById("pointsTable");
    var row = table.insertRow(table.rows.length);
    var cell0 = row.insertCell(0);
    var cell1 = row.insertCell(1);
    var cell2 = row.insertCell(2);
    var cell3 = row.insertCell(3);
    var cell4 = row.insertCell(4);
    this.setRow(row);
    this.setElement(div);
    this.setPosition(event.pageX, event.pageY);
    div.className = "movedElement";
    div.style.background = this.getColor();
    div.style.position = "absolute";
    div.style.height = this.getRadius() * 2 + "px";
    div.style.width = this.getRadius() * 2 + "px";
    div.style.borderRadius = "100%";
    div.style.zIndex = "1";

    pointContext.controller = pointContext.controller.bind(pointContext);
    div.onmousedown = pointContext.controller;

    pointContext.changeColor = pointContext.changeColor.bind(pointContext);
    div.oncontextmenu = pointContext.changeColor;

    document.body.appendChild(div);

    var inputForMass = document.createElement("input");
    inputForMass.type = "text";
    inputForMass.name = "mass";
    inputForMass.class = "inputForData";
    inputForMass.size = '1';
    inputForMass.addEventListener("blur", changePointMass, false);

    function changePointMass () {
        pointContext.setMass(inputForMass.value);
    }
   
    cell0.innerHTML = this.getPosition().x;
    cell1.innerHTML = this.getPosition().y;
    cell2.innerHTML = this.getColor();
    cell3.innerHTML = this.getRadius();
    cell4.appendChild(inputForMass);
    row.style.background = this.getColor();
};

Point.prototype.changeColor = function () {
    event.preventDefault ? event.preventDefault() : event.returnValue = false;
    if (this.getColor() == "gray") {
        this.setColor("red");
    }
    else if (this.getColor() == "red") {
        this.setColor("green");
        this.setIsProp();
    }
    else {
        this.delete();
    }
}

Point.prototype.delete = function () {
    pointsCollection.delete(this);
    var row = this.getRow();
    row.parentNode.removeChild(row);
    document.body.removeChild(this.getElement());
    this.getBindedLines().forEach(function (line) {
        line.delete();
    });
    delete this;
}

Point.prototype.changeRadius = function () {
    var pointContext = this;
    var startY = event.clientY;
    document.addEventListener("mousemove", moveHandler, true);
    document.addEventListener("mouseup", upHandler, true);
    
    function moveHandler(e) {
        var startPosition = pointContext.getPosition();
        var radius = pointContext.getRadius();
        var result = mouseDifference(radius);
        pointContext.setRadius(result);
        var difference = radius - result;
        if (difference < 0) {
            pointContext.setPosition(startPosition.x - radius - Math.abs(difference), startPosition.y - radius - Math.abs(difference), true);
        }
        else if (difference > 0) {
            pointContext.setPosition(startPosition.x - radius + Math.abs(difference), startPosition.y - radius + Math.abs(difference), true);
        }
        e.stopPropagation();
    }

    function upHandler(e) {
        document.removeEventListener("mousemove", moveHandler, true);
        document.removeEventListener("mouseup", upHandler, true);
        e.stopPropagation();
    }

    function mouseDifference(radius) {
        var difference = Math.floor(Math.abs(startY - event.clientY));
        if (event.clientY < startY) {
            var result = radius - difference;
        }
        else {
            var result = radius + difference;
        }
        if (result < 5) {
            result = 5;
        }
        if (result > 50) {
            result = 50;
        }

        return result
    }
}

Point.prototype.createLine = function () {
    var firstPoint = this;
    document.addEventListener("mouseup", upHandler, true);
    event.stopPropagation();
    event.preventDefault();

    function upHandler() {
        var element = event.target || event.srcElement;
        var secondPoint = findPointByElement(element);

        if (secondPoint && secondPoint != firstPoint) {
            var line = new Line(firstPoint, secondPoint);
            linesCollection.add(line);
            line.create();
            firstPoint.setBindedLines(line);
            secondPoint.setBindedLines(line);
        }
        document.removeEventListener("mouseup", upHandler, true);
        event.stopPropagation();
    }
}

Point.prototype.drag = function () {
    var pointContext = this;
    
    var startX = event.clientX;
    var startY = event.clientY;
    var origX = pointContext.getElement().offsetLeft;
    var origY = pointContext.getElement().offsetTop;
    var deltaX = startX - origX;
    var deltaY = startY - origY;

    var countFixedLines = 0;
    var fixedLine = undefined;
    var lengthOfFixedLine = undefined;
    pointContext.getBindedLines().forEach(function (line) {
        if (line.getIsFixed()) {
            fixedLine = line;
            lengthOfFixedLine = fixedLine.getLength();
            countFixedLines++;
        }
    });

    document.addEventListener("mousemove", moveHandler, true);
    document.addEventListener("mouseup", upHandler, true);

    function moveHandler(){
        if (countFixedLines == 0) {
            pointContext.setPosition(event.clientX - deltaX + pointContext.getRadius(), event.clientY - deltaY + pointContext.getRadius());
        }
        else if (countFixedLines == 1) {
            var secondPoint = fixedLine.getSecondPoint(pointContext);

            var point = {
                x: event.clientX - deltaX + pointContext.getRadius(),
                y: event.clientY - deltaY + pointContext.getRadius()
            };

            var angle = getAngle(secondPoint.getPosition(), point) - 90;
            var radangle = angle*(Math.PI/180);
            var left = lengthOfFixedLine*Math.cos(radangle) + secondPoint.getPosition().x;
            var top = lengthOfFixedLine*Math.sin(radangle) + secondPoint.getPosition().y;
            pointContext.setPosition(parseInt(left), parseInt(top));
        }
        event.stopPropagation();
    }

    function upHandler(){
        document.removeEventListener("mouseup", upHandler, true);
        document.removeEventListener("mousemove", moveHandler, true);
        event.stopPropagation();
    }
}

Point.prototype.controller = function () {
    var pointContext = this;
    if(event.ctrlKey){
        pointContext.changeRadius();
    }
    else if (event.altKey){
        pointContext.createLine();
    }
    else {
        pointContext.drag();
    }
}