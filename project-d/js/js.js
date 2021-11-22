let game = new Game();

document.addEventListener("DOMContentLoaded", function() {
  game.init();
  game.setState(STATE_WAIT);
  /*
  game.code = 'item3';
  game.triggerCode();

  game.code = 'data1';
  game.triggerCode();
  game.code = 'data2';
  game.triggerCode();
  game.code = 'data4';
  game.triggerCode();
  */
});

document.addEventListener("keydown", function(e) {
  game.keyboardEvent(e);
});
