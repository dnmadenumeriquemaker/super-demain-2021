let game = new Game();
const serial = new WebSerial({
  log:true
});

document.addEventListener("DOMContentLoaded", function() {

  game.init({
    serial: serial
  });

  setTimeout(function(){
    game.setState(STATE_WAIT_FIRST_PLAYER);
  }, 1000);

  serial.on('data', data => {
    game.onData(data);
  });

  /*
  // DEV
  Howler.volume(.2);

  game.setState(STATE_WAIT_FIRST_PLAYER);
  game.addPlayer(1);
  game.addPlayer(2);
  game.addPlayer(3);
  game.addPlayer(4);
  game.checkPlayersBeforeIntro();
  game.setState(STATE_VOTE_ENDED);
*/
  let devButtons = document.getElementsByClassName('data-send-data');

  [].forEach.call(devButtons, item => {
    item.addEventListener('click', function() {
      game.onData(this.textContent);
    });
  });

  // /DEV


});
