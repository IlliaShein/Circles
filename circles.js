document.addEventListener("DOMContentLoaded", function() {
    var selectedCircle = null;
    var isDragging = false;
    var wasMouseMoving = false;

    var pointOffsetX;
    var pointOffsetY;

    var pointsAmount = 0;
  
    document.addEventListener("mousedown", function(event) {
      if (event.target.id === "circle") {
        selectedCircle = event.target;
        pointOffsetX = event.clientX - parseInt(selectedCircle.style.left);
        pointOffsetY = event.clientY - parseInt(selectedCircle.style.top);
        selectedCircle.style.zIndex = "1";
        isDragging = true;
      }
    });
  
    document.addEventListener("mousemove", function(event) {
      if (selectedCircle && isDragging) {
        selectedCircle.style.left = event.clientX - pointOffsetX + "px";
        selectedCircle.style.top = event.clientY - pointOffsetY + "px";
        wasMouseMoving = true;
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
      if (pointsAmount < 4 && !wasMouseMoving) {
        var circle = document.createElement("div");
        circle.id = "circle";
        circle.style.left = event.clientX - 5 + "px";
        circle.style.top = event.clientY - 5 + "px";
        document.body.appendChild(circle);
        pointsAmount++;
      }
      wasMouseMoving = false;
    });
  });