document.addEventListener("DOMContentLoaded", function() {
    document.addEventListener("click", function(event) {
      var circle = document.createElement("div");
      circle.id = "circle";
      circle.style.left = event.clientX - 5 + "px";
      circle.style.top = event.clientY - 5 + "px";
      document.body.appendChild(circle);
    });
  });