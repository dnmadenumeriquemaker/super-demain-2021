let timer = null;

function isScroll() {
  alert('isScroll');
  clearTimeout(timer);
  timer = setTimeout( function(){
    restart();
  }, 2000 );
}

function restart() {
  alert('restart');
  /*
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth'
  });
  */

  document.body.scrollTo(0,0);
}

document.addEventListener("DOMContentLoaded", function() {

  document.addEventListener('scroll', () => {
    clearTimeout(timer);
    timer = setTimeout( function(){
      restart();
    }, 10000 );
  });

  function restart() {
    /*
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    */

    window.scrollTo(0,0);
  }


});
