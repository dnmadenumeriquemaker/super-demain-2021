const STATE_WAIT = 'wait',
      STATE_INTRO = 'intro',
      STATE_PLAY = 'play',
      STATE_WON = 'won',
      STATE_LOST = 'lost',
      STATE_OUTRO = 'outro';

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
      DURATION_BETWEEN_OUTRO_TRANSITION_AND_INTRO_TRANSITION = 1000, // Durée de l'affichage de l'animation selon la réponse de l'user
      DURATION_BEFORE_LOST = 1500,
      DURATION_OUTRO_TO_NEXT_GAME = 10000;

const SCORE_MAX = 100,
      BONUS = 10,
      MALUS = -10,
      NB_QUESTIONS = 10;

class Game {
  constructor() {
    this.playStepId;
    this.interactionEnabled;
    this.score;

    this.timerInteraction = null;
    this.timerPlayStep = null;
    this.timerScore = null;

    this.nbQuestions = NB_QUESTIONS;
    this.scoreMax = SCORE_MAX;

    this.$body = document.getElementsByTagName('body')[0];
    this.$score = document.getElementById('score');
    this.$scoreBar = document.getElementById('score-bar');
  }

  init() {
    this.initScore();
  }

  setState(state) {
    this.state = state;
    this.$body.setAttribute('data-state', this.state);

    switch (this.state) {
      case STATE_WAIT :
        this.enableInteraction();
      break;

      case STATE_INTRO :
        this.disableAndWaitBeforeNextInteraction();
      break;

      case STATE_PLAY :
        this.disableInteraction();
        this.setPlayStepId(0);
      break;

      case STATE_WON : // TODO : not tested yet
        this.disableInteraction();
        this.clearTimerPlayStep();
      break;

      case STATE_LOST :
        this.disableInteraction();
        this.clearTimerPlayStep();
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
    if (!this.canInteract()) return;

    switch (this.state) {
      case STATE_WAIT :
        this.setState(STATE_INTRO);
      break;

      case STATE_INTRO :
        this.setState(STATE_PLAY);
      break;

      case STATE_PLAY :
        //  check score
      break;

      // TODO for PLAY and next states
    }
  }


  setPlayStepId(stepId) {
    this.playStepId = stepId;
    this.$body.setAttribute('data-play-step-id', this.playStepId);
    this.setPlayStepState(PLAY_STEP_STATE_INTRO_TRANSITION);
  }

  setNextPlayStep() {
    this.playStepId++;
    this.setPlayStepId(this.playStepId);
  }

  setPlayStepState(state) {
    const _this = this;

    // when the game starts,
    // playStep #0 is only a transition to playStep #1
    // TODO : listen to Arduino (no auto play)

    if (this.playStepId == 0) {
      this.setTimerPlayStep(function(){
        _this.setNextPlayStep();
      }, DURATION_BETWEEN_INTRO_TRANSITION_AND_QUESTION);
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
        this.enableInteraction();
        this.startTimerScore();
      break;

      case PLAY_STEP_STATE_RIGHT_CHOICE :
        this.stopTimerScore();
        this.disableInteraction();
        this.setDataAnswer('right');
        this.addBonus();

        this.setTimerPlayStep(function(){
          // TODO : ask for button action instead of timer?
          // TODO : wait for unplug instead of time?
          _this.setPlayStepState(PLAY_STEP_STATE_OUTRO_TRANSITION);
        }, DURATION_BETWEEN_ANSWER_AND_OUTRO_TRANSITION);
      break;

      case PLAY_STEP_STATE_WRONG_CHOICE :
        this.stopTimerScore();
        this.disableInteraction();
        this.setDataAnswer('wrong');
        this.addMalus();

        this.setTimerPlayStep(function(){
          // TODO : ask for button action instead of timer?
          // TODO : wait for unplug instead of time?
          _this.setPlayStepState(PLAY_STEP_STATE_OUTRO_TRANSITION);
        }, DURATION_BETWEEN_ANSWER_AND_OUTRO_TRANSITION);
      break;

      case PLAY_STEP_STATE_OUTRO_TRANSITION :
        this.setTimerPlayStep(function(){
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
