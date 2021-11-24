const STATE_WAIT = 'wait',
      STATE_INTRO = 'intro',
      STATE_PLAY = 'play',
      STATE_WON = 'won',
      STATE_LOST = 'lost';

const PLAY_STEP_STATE_INTRO_TRANSITION = 'intro-transition',
      PLAY_STEP_STATE_SHOW_QUESTION = 'show-question',
      PLAY_STEP_STATE_SHOW_CHOICES = 'show-choices',
      PLAY_STEP_STATE_LISTEN_TO_USER = 'listen-to-user',
      PLAY_STEP_STATE_RIGHT_CHOICE = 'right-choice',
      PLAY_STEP_STATE_WRONG_CHOICE = 'wrong-choice',
      PLAY_STEP_STATE_OUTRO_TRANSITION = 'outro-transition';

const DURATION_BETWEEN_INTRO_TRANSITION_AND_QUESTION = 4000, // Durée de la transition
      DURATION_BETWEEN_QUESTION_AND_CHOICES = 2000, // Durée de la question
      DURATION_BETWEEN_ANSWER_AND_OUTRO_TRANSITION = 2000, // Durée de l'affichage de la bonne réponse
      DURATION_BETWEEN_OUTRO_TRANSITION_AND_INTRO_TRANSITION = 4000, // Durée de l'affichage de l'animation selon la réponse de l'user
      DURATION_BEFORE_LOST = 1500,
      DURATION_OUTRO_TO_NEXT_GAME = 10000,

      DURATION_TIMEOUT_PROMPT = 30000,

      DURATION_WON = 10000,
      DURATION_LOST = 5000;


const SCORE_MAX = 100,
      BONUS = 10,
      MALUS = -10,
      NB_QUESTIONS = 10;

class Game {
  constructor() {
    this.serial;

    this.playStepId;
    this.interactionEnabled;
    this.score;

    this.timerInteraction = null;
    this.timerPlayStep = null;
    this.timerScore = null;
    this.timerTimeout = null;
    this.timerState = null;

    this.nbQuestions = NB_QUESTIONS;
    this.scoreMax = SCORE_MAX;

    this.$body = document.getElementsByTagName('body')[0];
    this.$score = document.getElementById('score');
    this.$scoreBar = document.getElementById('score-bar');
  }

  init(params = {}) {
    if (params.serial) this.serial = params.serial;
    this.initGame();
  }

  initGame() {
    this.initScore();
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
        this.writeData('state/wait');
      break;

      case STATE_INTRO :
        this.writeData('state/intro');
      break;

      case STATE_PLAY :
        this.disableInteraction();
        this.setPlayStepId(0);
        this.writeData('state/play');
      break;

      case STATE_WON :
        this.disableInteraction();
        this.clearTimerPlayStep();
        this.writeData('state/won');

        clearTimeout(this.timerState);
        clearTimeout(this.timerTimeout);

        this.timerState = setTimeout(function(){
          _this.setState(STATE_WAIT);
        }, DURATION_WON);
      break;

      case STATE_LOST :
        this.disableInteraction();
        this.clearTimerPlayStep();
        this.writeData('state/lost');

        clearTimeout(this.timerState);
        clearTimeout(this.timerTimeout);

        this.timerState = setTimeout(function(){
          _this.setState(STATE_WAIT);
        }, DURATION_LOST);
      break;

    }
  }

  isState(state) {
    return state == this.state;
  }

  isPlayStepId(stepId) {
    return stepId == this.playStepId;
  }

  canInteract() {
    return this.interactionEnabled;
  }

  setNextState() {
    switch (this.state) {
      case STATE_WAIT :
        this.setState(STATE_INTRO);
      break;

      case STATE_INTRO :
        this.setState(STATE_PLAY);
      break;

      case STATE_PLAY :
        this.setState(STATE_WON);
      break;
    }
  }


  onData(rawData) {
    let data = rawData.trim();

    console.log('onData', data);

    let parts = data.split('/');

    if (this.isState(STATE_WAIT) && data == 'plugged') {
      this.setNextState();
    }

    else if (this.isState(STATE_INTRO) && data == 'unplugged') {
      this.setNextState();
    }

    else if (this.isState(STATE_PLAY) && this.canInteract()) {
      if (parts[0] == 'choice') {
        if (parts[1] == 'left') {
          this.selectChoice(1);
        } else if (parts[1] == 'right') {
          this.selectChoice(2);
        }
      }
    }
  }

  writeData(data) {
    console.log('writeData', data);
    serial.write(data);
  }


  setPlayStepId(stepId) {
    this.playStepId = stepId;
    this.$body.setAttribute('data-play-step-id', this.playStepId);
    this.setPlayStepState(PLAY_STEP_STATE_INTRO_TRANSITION);
  }

  setNextPlayStep() {
    this.playStepId++;

    if (this.playStepId > 10) {
      this.setNextState();
    } else {
      this.setPlayStepId(this.playStepId);
    }
  }

  setPlayStepState(state) {
    const _this = this;

    // when the game starts,
    // playStep #0 is only a transition to playStep #1
    // TODO : listen to Arduino (no auto play)

    if (this.playStepId == 0) {
      this.setTimerPlayStep(function(){
        _this.setNextPlayStep();
      }, 100);
      return;
    }

    switch (state) {
      case PLAY_STEP_STATE_INTRO_TRANSITION :
        this.stopTimerScore();
        this.disableInteraction();
        this.setTimerPlayStep(function(){
          _this.setPlayStepState(PLAY_STEP_STATE_SHOW_QUESTION);
        }, DURATION_BETWEEN_INTRO_TRANSITION_AND_QUESTION);
      break;

      case PLAY_STEP_STATE_SHOW_QUESTION :
        this.disableInteraction();
        this.setTimerPlayStep(function(){
          _this.setPlayStepState(PLAY_STEP_STATE_SHOW_CHOICES);
        }, DURATION_BETWEEN_QUESTION_AND_CHOICES);
      break;

      case PLAY_STEP_STATE_SHOW_CHOICES :
        this.setPlayStepState(PLAY_STEP_STATE_LISTEN_TO_USER);
      break;

      case PLAY_STEP_STATE_LISTEN_TO_USER :
        this.writeData('F');
        this.enableInteraction();
        this.startTimerScore();
        this.timerTimeout = setTimeout(function(){
          _this.setState(STATE_WAIT);
        }, DURATION_TIMEOUT_PROMPT);
      break;

      case PLAY_STEP_STATE_RIGHT_CHOICE :
        clearTimeout(this.timerTimeout);
        this.writeData('G');
        this.stopTimerScore();
        this.disableInteraction();
        this.setDataAnswer('right');
        this.addBonus();

        this.setTimerPlayStep(function(){
          _this.setPlayStepState(PLAY_STEP_STATE_OUTRO_TRANSITION);
        }, DURATION_BETWEEN_ANSWER_AND_OUTRO_TRANSITION);
      break;

      case PLAY_STEP_STATE_WRONG_CHOICE :
        clearTimeout(this.timerTimeout);
        this.writeData('H');
        this.stopTimerScore();
        this.disableInteraction();
        this.setDataAnswer('wrong');
        this.addMalus();

        this.setTimerPlayStep(function(){
          _this.setPlayStepState(PLAY_STEP_STATE_OUTRO_TRANSITION);
        }, DURATION_BETWEEN_ANSWER_AND_OUTRO_TRANSITION);
      break;

      case PLAY_STEP_STATE_OUTRO_TRANSITION :
        this.setTimerPlayStep(function(){
          _this.writeData('I');
          _this.setNextPlayStep();
        }, DURATION_BETWEEN_OUTRO_TRANSITION_AND_INTRO_TRANSITION);
      break;
    }

    this.$body.setAttribute('data-play-step-state', state);
  }



  startTimerScore() {
    const _this = this;

    this.stopTimerScore();
    this.timerScore = setInterval(function(){
      _this.tickTimerScore();
    }, 1000);
  }

  stopTimerScore() {
    clearInterval(this.timerScore);
  }

  tickTimerScore() {
    this.score--;

    this.checkScore();
    this.displayScore();
  }

  initScore() {
    this.score = SCORE_MAX;
    this.displayScore();
    this.stopTimerScore();
    for (let i = 1; i <= 10; i++) {
      this.$body.setAttribute('data-question-'+i, '');
    }
  }

  addMalus() {
    this.score += MALUS;

    this.checkScore();
    this.displayScore();
  }

  addBonus() {
    this.score += BONUS;

    this.checkScore();
    this.displayScore();
  }

  displayScore() {
    this.$score.innerHTML = this.score;
    this.$scoreBar.style.top = (SCORE_MAX - this.score) + '%';
    this.$body.setAttribute('data-score', this.score);
  }

  checkScore() {
    const _this = this;

    if (this.score <= 0) {
      this.score = 0;
      setTimeout(function(){
        _this.setState(STATE_LOST);
      },DURATION_BEFORE_LOST);
    }
    if (this.score >= SCORE_MAX) {
      this.score = SCORE_MAX;
    }
  }

  selectChoice(userChoice) {
    if (!this.canInteract()) return;

    const rightChoice = document.querySelector('.play-step[data-play-step-id="'+this.playStepId+'"]').getAttribute('data-right-choice');

    if (userChoice == rightChoice) {
      this.setPlayStepState(PLAY_STEP_STATE_RIGHT_CHOICE);
    } else {
      this.setPlayStepState(PLAY_STEP_STATE_WRONG_CHOICE);
    }
  }

  setTimerPlayStep(callback, delay) {
    const _this = this;

    this.clearTimerPlayStep();
    this.timerPlayStep = setTimeout(callback, delay);
  }

  clearTimerPlayStep() {
    clearTimeout(this.timerPlayStep);
  }

  disableAndWaitBeforeNextInteraction(delay = 1000) {
    this.disableInteraction();
    this.setTimerInteractionDelay(delay);
  }

  setTimerInteractionDelay(delay) {
    const _this = this;

    this.clearTimerInteractionDelay();
    this.timerInteraction = setTimeout(function(){
      _this.enableInteraction();
    }, delay);
  }

  clearTimerInteractionDelay() {
    clearTimeout(this.timerInteraction);
  }

  disableInteraction() {
    this.interactionEnabled = false;
    this.$body.setAttribute('data-can-interact', false);
  }

  enableInteraction() {
    this.interactionEnabled = true;
    this.$body.setAttribute('data-can-interact', true);
  }

  setDataAnswer(answer) {
    this.$body.setAttribute('data-question-'+this.playStepId, answer);
  }
}
