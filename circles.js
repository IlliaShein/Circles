class Point {
  constructor(name, x, y) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.element = null;
    this.label = null;
  }

  createPoint() {
    this.element = document.createElement("div");
    this.element.id = "point";
    this.element.style.left = this.x - 5 + "px";
    this.element.style.top = this.y - 5 + "px";
    document.body.appendChild(this.element);
  }

  createLabel() {
    this.label = document.createElement("div");
    this.label.className = "point-label";
    this.label.textContent = this.name + " (" + this.x + ", " + this.y + ")";
    document.body.appendChild(this.label);
  }

  updateLabelPosition() {
    if (this.label) {
      var rect = this.element.getBoundingClientRect();
      this.label.style.left = rect.right + 5 + "px";
      this.label.style.top = rect.top - 5 + "px";
      this.label.textContent = this.name + " (" + rect.x + ", " + rect.y + ")";
    }
  }
}

document.addEventListener("DOMContentLoaded", function() {
  var selectedPoint = null;
  var isDragging = false;
  var wasMouseMoving = false;

  var pointOffsetX;
  var pointOffsetY;

  var points = [];

  document.addEventListener("mousedown", function(event) {
    if (event.target.id === "point") {
      selectedPoint = event.target;
      pointOffsetX = event.clientX - parseInt(selectedPoint.style.left);
      pointOffsetY = event.clientY - parseInt(selectedPoint.style.top);
      selectedPoint.style.zIndex = "1";
      isDragging = true;
    }
  });

  document.addEventListener("mousemove", function(event) {
    if (selectedPoint && isDragging) {
      selectedPoint.style.left = event.clientX - pointOffsetX + "px";
      selectedPoint.style.top = event.clientY - pointOffsetY + "px";
      wasMouseMoving = true;
      updateLabelsPosition();
    }
  });

  document.addEventListener("mouseup", function(event) {
    if (selectedPoint) {
      selectedPoint.style.zIndex = "0";
      selectedPoint = null;
    }
    isDragging = false;
  });

  document.addEventListener("click", function(event) {
    if (points.length < 4 && !wasMouseMoving) {
      var pointName = String.fromCharCode(65 + points.length);
      var point = new Point(pointName, event.clientX, event.clientY);
      points.push(point);
      point.createPoint();
      point.createLabel();
      updateLabelsPosition();
    }
    wasMouseMoving = false;
  });

  function updateLabelsPosition() {
    points.forEach(function(point) {
      point.updateLabelPosition();
    });
  }

  window.addEventListener("resize", updateLabelsPosition);
});