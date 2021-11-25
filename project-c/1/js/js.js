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

  $('#intro').on('click', function(){
    $(this).fadeOut(500);
    $('#notification')[0].play();

    setTimeout(function(){
      $('#intro').fadeIn(500);
    }, 7000);

    setTimeout(function(){
      $('#notification')[0].currentTime = 0.001;
    }, 7500);
  })

});
