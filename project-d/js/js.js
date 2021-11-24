let game = new Game();
const serial = new WebSerial({
  log:true
});

document.addEventListener("DOMContentLoaded", function() {

  game.init({
    serial: serial
  });

  serial.on('data', data => {
    game.onData(data);
  });

  game.setState(STATE_WAIT);

  /*
  // Debug test
  setTimeout(function(){
    game.writeData('I2');
    game.writeData('C34');
  }, 1000);
  */
});

document.addEventListener("keydown", function(e) {
  game.keyboardEvent(e);
});
