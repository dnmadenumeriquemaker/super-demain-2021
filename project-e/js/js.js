let game = new Game();

document.addEventListener("DOMContentLoaded", function() {

  game.init();
  game.setState(STATE_WAIT);

  /*
    if (game.isState(STATE_WAIT)) {
      // detect 2, 3 or 4 buttons
      // to go to game.setState(STATE_INTRO);
    }
  */


  document.addEventListener('keydown', function(e) {
    if (e.which == 39) {
      if (game.isState(STATE_WAIT)) {
        game.setPlayers([0,2,3]);
        game.setNextState();
      }
    }
  });

});
