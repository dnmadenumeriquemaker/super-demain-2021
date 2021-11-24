document.addEventListener("DOMContentLoaded", function() {

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
