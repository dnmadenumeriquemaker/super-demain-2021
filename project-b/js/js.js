let game = new Game();

document.addEventListener("DOMContentLoaded", function() {

  game.init();
  //game.setState(STATE_WAIT);
  game.setState(STATE_PLAY);

  document.addEventListener('keydown', function(e) {
    if (e.which == 39) {
      if (game.isState(STATE_PLAY)) {
        game.setNextPlayStep();
      } else {
        game.setNextState();
      }
    }

    if (e.which == 65) {
      game.selectChoice(1);
    }

    if (e.which == 66) {
      game.selectChoice(2);
    }
  });

});
