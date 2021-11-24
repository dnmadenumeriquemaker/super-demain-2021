document.addEventListener("DOMContentLoaded", function() {

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
