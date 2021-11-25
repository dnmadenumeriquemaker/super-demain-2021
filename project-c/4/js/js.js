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

  $('video').on('click', function(){
    if ($(this).hasClass('caninteract')) {
      $('video').removeClass('caninteract');
      $('video')[0].play();

      setTimeout(function(){
        $('video').fadeOut(500);
      }, 46000);

      setTimeout(function(){
        $('video')[0].pause();
        $('video')[0].currentTime = 0.001;
        $('video').fadeIn(500);
        $('video').addClass('caninteract');
      }, 46500);
    }
  });

});
