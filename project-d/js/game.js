const STATE_WAIT = 'wait',
      STATE_CART = 'cart',
      STATE_CHECKOUT = 'checkout',
      STATE_OUTRO = 'outro';

const BARCODE_ITEM_1 = '3',
      BARCODE_ITEM_2 = '2',
      BARCODE_ITEM_3 = '1',

      BARCODE_DATA_1 = 'ORIENT', // ok
      BARCODE_DATA_2 = 'SANG', // ok
      BARCODE_DATA_3 = 'POIDS', // ok
      BARCODE_DATA_4 = 'FINANCEArrowDown', // ok
      BARCODE_DATA_5 = 'PANIER', // ok
      BARCODE_DATA_6 = 'NOM', // ok
      BARCODE_DATA_7 = 'ARBRE', // ok
      BARCODE_DATA_8 = 'SITUATION', // ok
      BARCODE_DATA_9 = 'PHOTO', // ok

      BARCODE_PASS = '123';

const DURATION_CHECKOUT = 20000,
      DURATION_OUTRO = 30000;

class Game {
  constructor() {
    this.interactionEnabled;
    this.serial;

    this.timerState = null;

    this.cart;
    this.cartTotal;
    this.code;

    this.item;

    this.$body = document.getElementsByTagName('body')[0];
    this.$cardTotal = document.getElementById('cart-total');
    this.$cardDatas = document.getElementById('cart-datas');
    this.$drawerDatas = document.getElementById('datas');
    this.$progressBar = document.getElementById('checkout-progress-bar');
    this.$outroText = document.getElementById('outro-text');
  }

  init(params = {}) {
    if (params.serial) this.serial = params.serial;
    this.initGame();
  }

  initGame() {
    this.resetCart();
    this.resetCode();
  }

  setState(state) {
    const _this = this;
    this.state = state;
    this.$body.setAttribute('data-state', this.state);

    switch (this.state) {
      case STATE_WAIT :
        clearTimeout(this.timerState);

        this.initGame();
        this.enableInteraction();
      break;

      case STATE_CHECKOUT :
        setTimeout(function(){
          _this.$progressBar.style.width = '1429px';
        },1);

        let arduinoData = this.cart.join('');
        this.writeData("C" + arduinoData);

        clearTimeout(this.timerState);

        this.timerState = setTimeout(function(){
          _this.setNextState()
        },DURATION_CHECKOUT);
      break;

      case STATE_OUTRO:
        this.$progressBar.style.width = '0px';
        this.setOutroText();

        clearTimeout(this.timerState);

        this.timerState = setTimeout(function(){
          _this.setNextState()
        },DURATION_OUTRO);
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
        this.setState(STATE_CART);
      break;

      case STATE_CART :
        this.setState(STATE_CHECKOUT);
      break;

      case STATE_CHECKOUT :
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

  // dev
  setCodeAndTrigger(code) {
    this.code = code;
    this.triggerCode();
  }
  // /dev

  onData(rawData) {

    let data = rawData.trim();

    console.log('onData', data);

    let parts = data.split('/');
  }

  writeData(data) {
    serial.write(data);
  }

  triggerCode() {
    console.log('code', this.code);

    if (this.isState(STATE_WAIT)) {
      let index = [BARCODE_ITEM_1, BARCODE_ITEM_2, BARCODE_ITEM_3].indexOf(this.code);
      if (index != -1) {
        this.setItem(index + 1);
        this.setNextState();
      }
    }

    else if (this.isState(STATE_CART)) {
      let index = [
        BARCODE_DATA_1,
        BARCODE_DATA_2,
        BARCODE_DATA_3,
        BARCODE_DATA_4,
        BARCODE_DATA_5,
        BARCODE_DATA_6,
        BARCODE_DATA_7,
        BARCODE_DATA_8,
        BARCODE_DATA_9,
      ].indexOf(this.code);

      console.log(this.code);

      if (index != -1) {
        this.hideCartWarning();

        let dataCode = this.code;
        let dataId = index + 1;

        let $data = document.querySelector('#datas .data[data-data-id="' + dataId + '"]').cloneNode(true);
        let dataPrice = parseInt($data.getAttribute('data-data-price'));

        if (this.cart.indexOf(dataId) == -1) {
          // add to cart
          this.cart.push(dataId);
          this.cartTotal += dataPrice;
          this.$cardDatas.appendChild($data);

        } else {
          // remove from cart
          this.cart.splice(this.cart.indexOf(dataId), 1);
          this.cartTotal -= dataPrice;
          document.querySelector('#cart-datas .data[data-data-id="' + dataId + '"]').remove();
        }

        this.displayCart();
      } else if (this.code == BARCODE_PASS) {
        console.log(this.cartTotal);
        if (this.cartTotal >= 50) {
          this.setNextState();
        } else {
          this.showCartWarning();
        }
      }
    }

    else if (this.isState(STATE_OUTRO)) {
      this.setNextState();
    }
  }

  setOutroText() {
    let text = '';

    if (this.cart.length <= 4) {
      text += 'peu';
    } else if (this.cart.length > 4 && this.cart.length <= 6) {
      text += 'beaucoup';
    } else if (this.cart.length > 6) {
      text += 'énormément';
    }

    text += ' de données qui ont ';

    if (this.cartTotal <= 40) {
      text += 'peu';
    } else if (this.cartTotal > 40 && this.cartTotal <= 90) {
      text += 'beaucoup';
    } else if (this.cartTotal > 90) {
      text += 'énormément';
    }

    text += ' de valeur';

    this.$outroText.innerHTML = text;
  }

  setItem(itemId) {
    this.item = itemId;
    this.$body.setAttribute('data-item', this.item);

    this.writeData("I" + this.item);
  }

  resetCart() {
    this.cart = [];
    this.cartTotal = 0;
    this.$cardDatas.innerHTML = '';
    this.displayCart();
  }

  resetCode() {
    this.code = '';
  }

  showCartWarning() {
    this.$body.setAttribute('data-cart-warning', true);
  }

  hideCartWarning() {
    this.$body.setAttribute('data-cart-warning', false);
  }

  displayCart() {
    this.$body.setAttribute('data-cart', this.cart.length);
    this.$cardTotal.innerHTML = this.cartTotal;
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
