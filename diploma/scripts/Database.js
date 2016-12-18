window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

var db;

var request = indexedDB.open("projectData", 1);

request.onerror = function (event) {
    console.log("unable to open a database");
};

request.onsuccess = function (event) {
    db = request.result;
};

request.onupgradeneeded = function (event) {
    db = event.target.result;
    var objectStore = db.createObjectStore("objectCollection", { keyPath: "name" });
}

function readDataFromDB() {
    var sessionName = document.getElementById("sessionName").value;
    var transaction = db.transaction("objectCollection");
    var objectStore = transaction.objectStore("objectCollection");
    var request = objectStore.get(sessionName);

    request.onerror = function (event) {
        alert("Unable to retrieve data from database!");
    };

    request.onsuccess = function (event) {
        if (request.result) {

            pointsCollection.forEach(function (item) {
                item.delete();
            });

            linesCollection.forEach(function (item) {
                item.delete();
            });

            finalResult = (JSON.parse(request.result.objectCollection));
            dataForGraphTrainMode = finalResult.dataTM;
            dataForGraphBeamsMode = finalResult.dataBM;
            document.getElementById("speed").value = finalResult.otherData.speed;
            document.getElementById("breakingTime").value = finalResult.otherData.time;
            document.getElementById("maxLoad").value = finalResult.otherData.maxLoad;

            if (finalResult.otherData.radiosForValueGraphXAxisActiveValue == "speed") {
                document.getElementById("speedRadio").checked = true;
            }
            else if (finalResult.otherData.radiosForValueGraphXAxisActiveValue == "time") {
                document.getElementById("timeRadio").checked = true;
            }

            if (finalResult.otherData.activeMode == "train") {
                useTrain();
                document.getElementById("train").checked = true;
            }
            else if (finalResult.otherData.activeMode == "beams") {
                useBeams();
                document.getElementById("beams").checked = true;
            }
            console.log(mode);

            finalResult.allPoints.forEach(function (item) {
                var point = new Point(item[0], item[1], item[3].x, item[3].y, item[2]);
                pointsCollection.add(point);
                point.create();
            });

            finalResult.allLines.forEach(function (item) {
                var firstPoint = findPointByCoordinates(item[0].x1, item[0].y1);
                var secondPoint = findPointByCoordinates(item[0].x2, item[0].y2);
                var line = new Line(firstPoint, secondPoint, item[1]);
                linesCollection.add(line);
                line.create();
                firstPoint.setBindedLines(line);
                secondPoint.setBindedLines(line);
            });

            console.log(finalResult);
        }

        else {
            alert("Element with name " + sessionName + " couldn't be found in your database!");
        }
    };
}

function readAllDataFromDB() {
    var objectStore = db.transaction("objectCollection").objectStore("objectCollection");

    objectStore.openCursor().onsuccess = function (event) {
        var cursor = event.target.result;

        if (cursor) {
            //make a select
            console.log(cursor.key);
            cursor.continue();
        }

    };
}

function saveSessionTODB() {
    var sessionName = document.getElementById("sessionName").value;
    var points = new Array();
    var lines = new Array();
    var radiosForValueGraphXAxisActive = undefined;
    var radiosForValueGraphXAxis = document.getElementsByName("radiosForValueGraphXAxis");
    for (let i = 0; i < radiosForValueGraphXAxis.length; i++) {
        if (radiosForValueGraphXAxis[i].checked) {
            radiosForValueGraphXAxisActive = radiosForValueGraphXAxis[i].value;
            break;
        }
    }

    var additionalData = {
        speed: document.getElementById("speed").value,
        time: document.getElementById("breakingTime").value,
        maxLoad: document.getElementById("maxLoad").value,
        activeMode: mode,
        radiosForValueGraphXAxisActiveValue: radiosForValueGraphXAxisActive
    };

    pointsCollection.forEach(function (point) {
        points.push([point.getRadius(), point.getMass(), point.getColor(), point.getPosition()]);
    });

    linesCollection.forEach(function (line) {
        lines.push([line.getCoordinates(), line.getColor()]);
    });

    var allObjects = {
        dataTM: dataForGraphTrainMode,
        dataBM: dataForGraphBeamsMode,
        allPoints: points,
        allLines: lines,
        otherData: additionalData
    };


    var request = db.transaction("objectCollection", "readwrite")
    .objectStore("objectCollection")
    .add({ name: sessionName, objectCollection: JSON.stringify(allObjects)});

    request.onsuccess = function (event) {
        alert("Element has been added to your database.");
    };

    request.onerror = function (event) {
        alert("Unable to add data\r\nElement is aready exist in your database! ");
    }
}

function removeSessionFromDB() {
    var sessionName = document.getElementById("sessionName").value;
    var request = db.transaction("objectCollection", "readwrite")
    .objectStore("objectCollection")
    .delete(sessionName);

    request.onsuccess = function (event) {
        alert("Element has been removed from your database.");
    };
}