let game = new Game();

document.addEventListener("DOMContentLoaded", function() {

  game.init();
  //game.setState(STATE_WAIT);
  game.setState(STATE_PLAY);

  const serial = new WebSerial()
        serial.on('connect', () => console.log('Serial connected'))
        serial.on('disconnect', () => console.log('Serial disconnected'))
        serial.on('data', data => console.log(`Data received: ${data}`))
        document.body.addEventListener('click', () => serial.write('Hello WebSerial'))

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
