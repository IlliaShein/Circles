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
      this.label.textContent = this.name + " (" + rect.x.toFixed(0) + ", " + rect.y.toFixed(0) + ")";
    }
  }

  removePoint() {
    if (this.element) {
      this.element.parentNode.removeChild(this.element);
      this.element = null;
    }

    if (this.label) {
      this.label.parentNode.removeChild(this.label);
      this.label = null;
    }
  }
}

class ColorCircle {
  constructor(centerPoint, sidePoint, color) {
    this.CenterPoint = centerPoint;
    this.SidePoint = sidePoint;
    this.centerElement = null;
    this.color = color;

    this.radius = CalcDistanse(centerPoint, sidePoint);
    this.createCenterCircle(centerPoint, this.radius, color);
  }

  createCenterCircle(centerPoint, radius, color)
  {
    this.centerElement = document.createElement("div");
    this.centerElement.className = "center-circle " + color;

    this.centerElement.style.left = centerPoint.x + 5  - radius + "px";
    this.centerElement.style.top = centerPoint.y + 5 - radius + "px";
    this.centerElement.style.width = radius * 2 + "px";
    this.centerElement.style.height = radius * 2 + "px";
    document.body.appendChild(this.centerElement);
  }

  SetNewRadius()
  {
    this.radius = CalcDistanse(this.CenterPoint, this.SidePoint);

    this.centerElement.style.left = this.CenterPoint.x + 5 - this.radius + "px";
    this.centerElement.style.top = this.CenterPoint.y  + 5 - this.radius  + "px";
    this.centerElement.style.width = this.radius * 2 + "px";
    this.centerElement.style.height = this.radius * 2 + "px";
  }
}

function CalcDistanse(point1, point2)
{
  var dx = point2.x - point1.x;
  var dy = point2.y - point1.y;

  return Math.sqrt(dx * dx + dy * dy);
}

document.addEventListener("DOMContentLoaded", function()
{
  var selectedPoint = null;
  var isDragging = false;
  var wasMouseMoving = false;

  var pointOffsetX;
  var pointOffsetY;

  var points = [];

  var colorCircleBlue;
  var colorCircleYellow;

  document.addEventListener("mousedown", function(event)
  {
    if (event.target.id === "point")
    {
      selectedPoint = event.target;
      pointOffsetX = event.clientX - parseInt(selectedPoint.style.left);
      pointOffsetY = event.clientY - parseInt(selectedPoint.style.top);
      isDragging = true;
    }
  });

  document.addEventListener("mousemove", function(event) {
    if (selectedPoint && isDragging) {
      selectedPoint.style.left = event.clientX - pointOffsetX + "px";
      selectedPoint.style.top = event.clientY - pointOffsetY + "px";
      wasMouseMoving = true;
      updateLabelsPosition();
    
      if(points.length >= 4)
      {
        colorCircleBlue.SetNewRadius();
        colorCircleYellow.SetNewRadius();  
  
        var CrossPoints = CalculateCrossPoints();

        if(points.length === 5)
        {
          points[4].removePoint();
          points.splice(4, 1);
        } else if (points.length === 6)
        {
          points[4].removePoint();
          points[5].removePoint();
          points.splice(4, 2);
        }
        if(CrossPoints.length != 0)
        {
          if(CrossPoints.length == 2){
            var pointName = String.fromCharCode(65 + points.length);
            var crossPoint1 = new Point(pointName, CrossPoints[0], CrossPoints[1]);
            points.push(crossPoint1);
            crossPoint1.createPoint();
            crossPoint1.createLabel();
            updateLabelsPosition();
          } else {
            var pointName = String.fromCharCode(65 + points.length);
            var crossPoint1 = new Point(pointName, CrossPoints[0], CrossPoints[1]);
            points.push(crossPoint1);
            crossPoint1.createPoint();
            crossPoint1.createLabel();
            updateLabelsPosition();

            pointName = String.fromCharCode(65 + points.length);
            var crossPoint2 = new Point(pointName, CrossPoints[2], CrossPoints[3]);
            points.push(crossPoint2);
            crossPoint2.createPoint();
            crossPoint2.createLabel();
            updateLabelsPosition();
          }

        }
      }
    }
  }); 

  function CalculateCrossPoints(){
    var distanseBetweenCenteres = CalcDistanse(colorCircleBlue.CenterPoint ,colorCircleYellow.CenterPoint);

    if(!IsCrossPoints(distanseBetweenCenteres))
    {
      return [];
    }

    var dx = colorCircleYellow.CenterPoint.x - colorCircleBlue.CenterPoint.x;
    var dy = colorCircleYellow.CenterPoint.y - colorCircleBlue.CenterPoint.y;
    var r1 = colorCircleBlue.radius;
    var r2 = colorCircleYellow.radius;
    var a = (r1 * r1 - r2 * r2 + distanseBetweenCenteres * distanseBetweenCenteres) / (2 * distanseBetweenCenteres);
    var h = Math.sqrt(r1 * r1 - a * a);

    var crossPoint1x = colorCircleBlue.CenterPoint.x + (dx * a) / distanseBetweenCenteres + (dy * h) / distanseBetweenCenteres;
    var crossPoint1y = colorCircleBlue.CenterPoint.y + (dy * a) / distanseBetweenCenteres - (dx * h) / distanseBetweenCenteres;

    if (distanseBetweenCenteres === r1 + r2 || distanseBetweenCenteres === Math.abs(r1 - r2)) {
      return [crossPoint1x,crossPoint1y];
    }

    var crossPoint2x = colorCircleBlue.CenterPoint.x + (dx * a) / distanseBetweenCenteres - (dy * h) / distanseBetweenCenteres;
    var crossPoint2y = colorCircleBlue.CenterPoint.y + (dy * a) / distanseBetweenCenteres + (dx * h) / distanseBetweenCenteres;

    return [crossPoint1x, crossPoint1y, crossPoint2x, crossPoint2y];
  }

  function IsCrossPoints(distanseBetweenCenteres) {
    if(distanseBetweenCenteres < colorCircleBlue.radius + colorCircleYellow.radius
      && distanseBetweenCenteres > Math.abs(colorCircleBlue.radius - colorCircleYellow.radius)) {
      return true;
    }

    return false;
  }

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

      if (points.length === 4) {
        colorCircleBlue  = new ColorCircle(points[0], points[1], "blue");
        colorCircleYellow = new ColorCircle(points[2], points[3], "yellow");
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