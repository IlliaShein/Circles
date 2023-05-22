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
    this.element.style.left = `${this.x - 5}px`;
    this.element.style.top = `${this.y - 5}px`;
    document.body.appendChild(this.element);
  
    this.element.style.zIndex = "2";
  }

  createLabel() {
    this.label = document.createElement("div");
    this.label.className = "point-label";
    this.label.textContent = `${this.name} (${this.x}, ${this.y})`;
    document.body.appendChild(this.label);
  }

  updateLabelPosition() {
    if (this.label) {
      const rect = this.element.getBoundingClientRect();

      this.x = rect.x;
      this.y = rect.y;

      this.label.style.left = `${rect.right + 5}px`;
      this.label.style.top = `${rect.top - 5}px`;
      this.label.textContent = `${this.name} (${rect.x.toFixed(0)}, ${rect.y.toFixed(0)})`;
    }
  }

  removePoint() {
    if (this.element) {
      this.element.remove();
      this.element = null;
    }

    if (this.label) {
      this.label.remove();
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

    this.radius = calcDistanse(centerPoint, sidePoint);
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
    this.radius = calcDistanse(this.CenterPoint, this.SidePoint);

    this.centerElement.style.left = this.CenterPoint.x + 5 - this.radius + "px";
    this.centerElement.style.top = this.CenterPoint.y  + 5 - this.radius  + "px";
    this.centerElement.style.width = this.radius * 2 + "px";
    this.centerElement.style.height = this.radius * 2 + "px";
  }

  RemoveCircle() {
    if (this.centerElement) {
      this.centerElement.parentNode.removeChild(this.centerElement);
      this.centerElement = null;
    }
  }

}

function calcDistanse(point1, point2) {
  var dx = point2.x - point1.x;
  var dy = point2.y - point1.y;

  return Math.sqrt(dx * dx + dy * dy);
}

document.addEventListener("DOMContentLoaded", function() {
  var textSpan = document.querySelector("#textSpan");

  textSpan.textContent = "Place 4 points";

  var selectedPoint = null;
  var isDragging = false;
  var wasMouseMoving = false;

  var pointOffsetX;
  var pointOffsetY;

  var points = [];

  var colorCircleBlue;
  var colorCircleYellow;

  document.addEventListener("mousedown", function(event) {
    if (event.target.id === "point") {
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
    
      if(points.length >= 4) {
        crossPointsProcessing();
      }
    }
  }); 

  function createPoint(x, y) {
    var pointName = String.fromCharCode(65 + points.length);
    var newPoint = new Point(pointName, x, y);
    newPoint.createPoint();
    newPoint.createLabel();
    newPoint.updateLabelPosition();
  
    return newPoint;
  }

  function calculateCrossPoints() {
    var distanseBetweenCenteres = calcDistanse(colorCircleBlue.CenterPoint ,colorCircleYellow.CenterPoint);
    var r1 = colorCircleBlue.radius;
    var r2 = colorCircleYellow.radius;

    if(!isCrossPoints(distanseBetweenCenteres)) {
      return [];
    }

    var crossPoint1 = getCrossPointCoordnates(colorCircleBlue, colorCircleYellow, distanseBetweenCenteres, 1);

    if (distanseBetweenCenteres === r1 + r2 || distanseBetweenCenteres === Math.abs(r1 - r2)) {   
      return [crossPoint1[0],crossPoint1[1]];
    }

    var crossPoint2 = getCrossPointCoordnates(colorCircleBlue, colorCircleYellow, distanseBetweenCenteres, 2);

    return [crossPoint1[0],crossPoint1[1], crossPoint2[0], crossPoint2[1]];
  }

  function getCrossPointCoordnates(circle1 , circle2,  distance , crossPointNum){
    var dx = circle2.CenterPoint.x - circle1.CenterPoint.x;
    var dy = circle2.CenterPoint.y - circle1.CenterPoint.y;
    var r1 = circle1.radius;
    var r2 = circle2.radius;
    var a = (r1 * r1 - r2 * r2 + distance * distance) / (2 * distance);
    var h = Math.sqrt(r1 * r1 - a * a);

    var index = 1;
    if(crossPointNum == 2){
      index = -1; 
    }

    var crossPointx = circle1.CenterPoint.x + (dx * a) / distance + (dy * h) * index / distance;
    var crossPointy = circle1.CenterPoint.y + (dy * a) / distance - (dx * h) * index / distance;

    return [crossPointx, crossPointy];
  }

  function isCrossPoints(distanseBetweenCenteres) {
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
    if (!event.target.matches("button") && points.length < 4 && !wasMouseMoving) {
      points.push(createPoint(event.clientX, event.clientY));

      if(points.length != 4) {
        if(aboutButtonActive) {
          textCache = "Place " + (4 - points.length) + " points";
        } else {
          textSpan.textContent = "Place " + (4 - points.length) + " points";
        }
      } else if (!aboutButtonActive) {
        textSpan.textContent = "";
      }

      if (points.length === 4) {
        if(aboutButtonActive) {
          textCache = "";
        }
        colorCircleBlue  = new ColorCircle(points[0], points[1], "blue");
        colorCircleYellow = new ColorCircle(points[2], points[3], "yellow");

        crossPointsProcessing();
      }
    }
    wasMouseMoving = false;
  });

  function crossPointsProcessing() {
    colorCircleBlue.SetNewRadius();
    colorCircleYellow.SetNewRadius();  

    var CrossPoints = calculateCrossPoints();

    if(points.length === 5) {
      points[4].removePoint();
      points.splice(4, 1);
    } else if (points.length === 6) {
      points[4].removePoint();
      points[5].removePoint();
      points.splice(4, 2);
    }

    if(CrossPoints.length != 0) {
      points.push(createPoint(CrossPoints[0] + 5, CrossPoints[1] + 5));

      if(CrossPoints.length == 4) {
        points.push(createPoint(CrossPoints[2] + 5, CrossPoints[3] + 5));
      }
    }
  }

  function updateLabelsPosition() {
    points.forEach(function(point) {
      point.updateLabelPosition();
    });
  }

  window.addEventListener("resize", updateLabelsPosition);

  var aboutButtonActive = false;
  var textCache;

  document.querySelector("#aboutButton").addEventListener("click", function() {
    if(aboutButtonActive) {
      resetTextSettings();
      textSpan.textContent = textCache;
    } else {
      textCache = textSpan.textContent;
      textSpan.style.fontSize = "24px";
      textSpan.style.textAlign = "left";
      textSpan.style.marginLeft = "15%";
      textSpan.innerHTML = "This program allows you to create geometric figures on the screen and interact with them.<br>" +
      "Usage Instructions:<br>" +
      "1. Select four points in the client area of the browser by clicking on it;<br>" +
      "2. You can change the location of the points by moving them and observe the updated<br>figures and their coordinates;<br>" +
      "3. If the circles intersect, the intersection points will also be displayed;<br>" +
      "4. You can read this text at any time (even when points are set) by pressing<br>" +
      " 'About' button;<br>" +
      "5. Use the 'Reset' button to clear the area and start selecting four new points.<br>" +
      "Author: Illia Shein<br>";
    }

    aboutButtonActive = !aboutButtonActive;
  }); 

  function resetTextSettings() {
    textSpan.style.fontSize = "50px";
    textSpan.style.textAlign = "center";
    textSpan.style.marginLeft = "0px"; 
  }

  document.querySelector("#resetButton").addEventListener("click", function() {
    points.forEach(point => {
      point.removePoint();
    });

    if(colorCircleBlue) {
      colorCircleBlue.RemoveCircle();
    }
    if(colorCircleYellow) {
      colorCircleYellow.RemoveCircle();
    }

    points = [];

    resetTextSettings();
    textSpan.textContent = "Place 4 points";
    aboutButtonActive = false;
  });
});