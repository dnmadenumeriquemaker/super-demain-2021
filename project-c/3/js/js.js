let timer = null;

document.addEventListener("DOMContentLoaded", function() {

  document.addEventListener('scroll', () => {
    clearTimeout(timer);
    timer = setTimeout( function(){
      restart();
    }, 10000 );
  });

  function restart() {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }


});
