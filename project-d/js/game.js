const STATE_WAIT = 'wait',
      STATE_LISTEN_TO_USER = 'listen-to-user',
      STATE_STATS = 'stats',
      STATE_OUTRO = 'outro';

class Game {
  constructor() {
    this.interactionEnabled;

    this.timerInteraction = null;
    this.cart;
    this.code;

    this.$body = document.getElementsByTagName('body')[0];
  }

  init() {
    this.resetCart();
    this.resetCode();
  }

  setState(state) {
    this.state = state;
    this.$body.setAttribute('data-state', this.state);

    switch (this.state) {
      case STATE_WAIT :
        this.enableInteraction();
      break;
    }
  }

  isState(state) {
    return state == this.state;
  }

  canInteract() {
    return this.interactionEnabled;
  }

  setNextState() {
    if (!this.canInteract()) return;

    switch (this.state) {
      case STATE_WAIT :
        this.setState(STATE_LISTEN_TO_USER);
      break;

      case STATE_LISTEN_TO_USER :
        this.setState(STATE_STATS);
      break;

      case STATE_STATS :
        this.setState(STATE_OUTRO);
      break;

      case STATE_OUTRO :
        this.setState(STATE_WAIT);
      break;
    }
  }

  keyboardEvent(key) {
    if (key.keyCode == 16) { // Shift: start of string
      this.resetCode();
    } else if (key.keyCode == 13) { // Enter: end of string
      this.triggerCode();
      this.resetCode();
    } else {
      this.code = this.code + key.key;
    }
  }

  triggerCode() {
    console.log(this.code);

    if (this.isState(STATE_WAIT)) {
      if (this.code == '4902778917114') {
        this.setNextState();
      }
    }
  }

  resetCart() {
    this.cart = 0;
    this.displayCart();
  }

  resetCode() {
    this.code = '';
  }

  displayCart() {
    this.$body.setAttribute('data-cart', this.cart);
  }

  disableInteraction() {
    this.interactionEnabled = false;
    this.$body.setAttribute('data-can-interact', false);
  }

  enableInteraction() {
    this.interactionEnabled = true;
    this.$body.setAttribute('data-can-interact', true);
  }
}
