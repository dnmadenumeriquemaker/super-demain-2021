document.addEventListener("DOMContentLoaded", function() {
  
  

  document.body.addEventListener('click', () => {
    var element = document.querySelector("#app");
    
    // make the element go to full-screen mode
    element.requestFullscreen()
      .then(function() {
        // element has entered fullscreen mode successfully
      })
      .catch(function(error) {
        // element could not enter fullscreen mode
      });
  });

});
