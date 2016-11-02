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
    }
    else {
        graph.style.display = "none";
        displayGraphButton.value = "Show Graph";
    }
}

Graph.prototype.draw = function () {

}