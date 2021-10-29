let game = new Game();

document.addEventListener("DOMContentLoaded", function() {

  game.init();
  game.setState(STATE_WAIT);

});

document.addEventListener("keydown", function(e) {
  game.keyboardEvent(e);
});
