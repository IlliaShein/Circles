class Point {
  constructor(name, x, y) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.element = null;
    this.label = null;
  }

  createCircle() {
    this.element = document.createElement("div");
    this.element.id = "circle";
    this.element.style.left = this.x - 5 + "px";
    this.element.style.top = this.y - 5 + "px";
    document.body.appendChild(this.element);
  
    this.element.style.zIndex = "2";
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

      this.x = rect.x;
      this.y = rect.y;

      this.label.style.left = rect.right + 5 + "px";
      this.label.style.top = rect.top - 5 + "px";
      this.label.textContent = this.name + " (" + rect.x + ", " + rect.y + ")";
    }
  }
}

class ColorCircle {
  constructor(centerPoint, sidePoint, color) {
    this.CenterPoint = centerPoint;
    this.SidePoint = sidePoint;
    this.centerElement = null;
    this.color = color;

    this.radius = this.CalcDistanse(centerPoint, sidePoint);
    this.createCenterCircle(centerPoint, this.radius, color);
  }

  CalcDistanse(point1, point2)
  {
    var dx = point2.x - point1.x;
    var dy = point2.y - point1.y;

    return Math.sqrt(dx * dx + dy * dy);
  }

  createCenterCircle(centerPoint, radius, color)
  {
    this.centerElement = document.createElement("div");
    this.centerElement.className = "center-circle " + color;

    this.centerElement.style.left = centerPoint.x  - radius + "px";
    this.centerElement.style.top = centerPoint.y - radius + "px";
    this.centerElement.style.width = radius * 2 + 10 + "px";
    this.centerElement.style.height = radius * 2  + 10+ "px";
    document.body.appendChild(this.centerElement);
  }

  SetNewRadius()
  {
    this.radius = this.CalcDistanse(this.CenterPoint, this.SidePoint);

    this.centerElement.style.left = this.CenterPoint.x  - this.radius + "px";
    this.centerElement.style.top = this.CenterPoint.y  - this.radius  + "px";
    this.centerElement.style.width = this.radius * 2 + 10 + "px";
    this.centerElement.style.height = this.radius * 2 + 10 + "px";
  }
}

document.addEventListener("DOMContentLoaded", function()
{
  var selectedCircle = null;
  var isDragging = false;
  var wasMouseMoving = false;

  var pointOffsetX;
  var pointOffsetY;

  var points = [];

  var colorCircleRed;
  var colorCircleBlue;

  document.addEventListener("mousedown", function(event)
  {
    if (event.target.id === "circle")
    {
      selectedCircle = event.target;
      pointOffsetX = event.clientX - parseInt(selectedCircle.style.left);
      pointOffsetY = event.clientY - parseInt(selectedCircle.style.top);
      isDragging = true;
    }
  });

  document.addEventListener("mousemove", function(event) {
    if (selectedCircle && isDragging) {
      selectedCircle.style.left = event.clientX - pointOffsetX + "px";
      selectedCircle.style.top = event.clientY - pointOffsetY + "px";
      wasMouseMoving = true;
      updateLabelsPosition();
      
      if (points.length === 4) {  
        colorCircleRed.SetNewRadius();
        colorCircleBlue.SetNewRadius();
      }
    }
  });

  document.addEventListener("mouseup", function(event) {
    if (selectedCircle) {
      selectedCircle.style.zIndex = "0";
      selectedCircle = null;
    }
    isDragging = false;
  });

  document.addEventListener("click", function(event) {
    if (points.length < 4 && !wasMouseMoving) {
      var pointName = String.fromCharCode(65 + points.length);
      var point = new Point(pointName, event.clientX, event.clientY);
      points.push(point);
      point.createCircle();
      point.createLabel();
      updateLabelsPosition();

      if (points.length === 4) {
        colorCircleRed  = new ColorCircle(points[0], points[1], "blue");
        colorCircleBlue = new ColorCircle(points[2], points[3], "yellow");
      }
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