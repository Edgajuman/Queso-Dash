document.addEventListener("DOMContentLoaded", function() {
    var pantallaCarga = document.getElementById("pantalla-carga");
    pantallaCarga.style.display = "none";
  });
  
  window.addEventListener('load', function() {
    var orientationOverlay = document.querySelector('.orientation-overlay');
  
    if (window.innerWidth <= 767 && window.innerHeight > window.innerWidth) {
      orientationOverlay.style.display = 'flex';
    }
  });
  
  window.addEventListener('resize', function() {
    var orientationOverlay = document.querySelector('.orientation-overlay');
  
    if (window.innerWidth <= 767 && window.innerHeight > window.innerWidth) {
      orientationOverlay.style.display = 'flex';
    } else {
      orientationOverlay.style.display = 'none';
    }
  });
  

  var isRotating = false;

  function startRotation() {
    var button = document.querySelector('.rotate-button');
  
    if (!isRotating) {
      button.classList.add('rotate');
      isRotating = true;
    }
  }
  
  function stopRotation() {
    var button = document.querySelector('.rotate-button');
  
    if (isRotating) {
      button.classList.remove('rotate');
      isRotating = false;
    }
  }
  