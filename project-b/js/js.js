let game = new Game();
const serial = new WebSerial({
  log: true
});

document.addEventListener("DOMContentLoaded", function() {

  game.init({
    serial: serial
  });

  setTimeout(function(){
    game.setState(STATE_WAIT);
/*
    game.setState(STATE_PLAY);
    game.setPlayStepId(8);*/
  },1000);

  serial.on('data', data => {
    game.onData(data);
  });

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
