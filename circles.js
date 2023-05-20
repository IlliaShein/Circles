document.addEventListener("DOMContentLoaded", function() {
    var selectedCircle = null;
    var offsetX, offsetY;
    var isDragging = false;
    var wasMouseMoving = false;
  
    document.addEventListener("mousedown", function(event) {
      if (event.target.id === "circle") {
        selectedCircle = event.target;
        offsetX = event.clientX - parseInt(selectedCircle.style.left);
        offsetY = event.clientY - parseInt(selectedCircle.style.top);
        selectedCircle.style.zIndex = "1";
        isDragging = true;
      }
    });
  
    document.addEventListener("mousemove", function(event) {
      if (selectedCircle && isDragging) {
        selectedCircle.style.left = event.clientX - offsetX + "px";
        selectedCircle.style.top = event.clientY - offsetY + "px";
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
      if (!wasMouseMoving) {
        var circle = document.createElement("div");
        circle.id = "circle";
        circle.style.left = event.clientX - 5 + "px";
        circle.style.top = event.clientY - 5 + "px";
        document.body.appendChild(circle);
      }
      wasMouseMoving = false;
    });
  });