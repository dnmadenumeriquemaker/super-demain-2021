const STATE_WAIT = 'wait',
      STATE_INTRO = 'intro',
      STATE_VOTE = 'vote',
      STATE_INTRO_VOTE = 'intro-vote',
      STATE_LISTEN_TO_VOTES = 'listen-to-votes',
      STATE_OUTRO_VOTE = 'outro-vote'
      STATE_SHARE = 'share',
      STATE_INTRO_PLAYER = 'intro-player',
      STATE_LISTEN_TO_PLAYER = 'listen-to-player',
      STATE_OUTRO_PLAYER = 'outro-player'
      STATE_OUTRO = 'outro';

const DURATION_WAIT_LOOP = 15000,
      DURATION_INTRO_TO_VOTE = 2000,
      DURATION_VOTE_TO_INTRO_VOTE = 5000,

      DURATION_LISTEN_TO_PLAYER = 30000, // to test
      DURATION_OUTRO_TO_NEXT_GAME = 10000; // to test

let AUDIO_WAIT,
    AUDIO_INTRO,
    AUDIO_VOTE,
    AUDIO_INTRO_VOTE,
    AUDIO_LISTEN_TO_VOTES,
    AUDIO_OUTRO_VOTE;

AUDIO_WAIT = new Howl({
  src: ['audio/audio_wait.mp3'],
  html5: true,
});

AUDIO_INTRO = new Howl({
  src: ['audio/audio_intro.mp3'],
  html5: true,
});

AUDIO_VOTE = new Howl({
  src: ['audio/audio_vote.mp3'],
  html5: true,
});

AUDIO_INTRO_VOTE = new Howl({
  src: ['audio/audio_intro_vote.mp3'],
  html5: true,
});

AUDIO_LISTEN_TO_VOTES = new Howl({
  src: ['audio/audio_listen_to_votes.mp3'],
  html5: true,
});

AUDIO_OUTRO_VOTE = new Howl({
  src: ['audio/audio_intro_vote.mp3'], // TODO : right recording
  html5: true,
});

class Game {
  constructor() {
    this.playStepId;
    this.interactionEnabled;

    this.players;
    this.nbPlayers;

    this.timerInteraction = null;
    this.timerAudioWait = null;
    this.timerAudio = null;
    this.timerVote = null;
    this.timerVoteCount;

    this.$body = document.getElementsByTagName('body')[0]
  }

  init() {
    this.resetPlayers();
  }

  setState(state) {
    const _this = this;
    this.state = state;
    this.$body.setAttribute('data-state', this.state);

    switch (this.state) {
      case STATE_WAIT :
        this.enableInteraction();
        this.loopAudioWait();
      break;

      case STATE_INTRO :
        this.disableInteraction();
        this.stopAudioWait();
        this.playAudioThen(AUDIO_INTRO, function(){
          _this.setState(STATE_VOTE);
        }, DURATION_INTRO_TO_VOTE);
      break;

      case STATE_VOTE :
        this.playAudioThen(AUDIO_VOTE, function(){
          _this.setState(STATE_INTRO_VOTE);
        }, DURATION_VOTE_TO_INTRO_VOTE);
      break;

      case STATE_INTRO_VOTE :
        this.playAudioThen(AUDIO_INTRO_VOTE, function(){
          _this.setState(STATE_LISTEN_TO_VOTES);
        });
      break;

      case STATE_LISTEN_TO_VOTES :
        this.playAudioThen(AUDIO_LISTEN_TO_VOTES, function(){
          _this.setState(STATE_OUTRO_VOTE);
        });
      break;

      case STATE_OUTRO_VOTE :
        this.playAudioThen(AUDIO_OUTRO_VOTE, function(){
          _this.setState(STATE_SHARE);
        });
      break;

      // TODO : rest of all states


      case STATE_SHARE :

      break;

      case STATE_INTRO_PLAYER :

      break

      case STATE_LISTEN_TO_PLAYER :

      break;

      case STATE_OUTRO_PLAYER :
        // goto STATE_INTRO_PLAYER if not last player
        // goto STATE_OUTRO if last player
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
        this.setState(STATE_INTRO);
      break;

      case STATE_INTRO :
        this.setState(STATE_VOTE);
      break;

      case STATE_VOTE :
        this.setState(STATE_INTRO_VOTE);
      break;

      // TODO all states
    }
  }

  loopAudioWait() {
    const _this = this;
    AUDIO_WAIT.play();

    this.timerAudioWait = setTimeout(function(){
      _this.loopAudioWait();
    }, DURATION_WAIT_LOOP);
  }

  stopAudioWait() {
    AUDIO_WAIT.fade(1.0, 0.0, 500);
    clearTimeout(this.timerAudioWait);
  }

  /*
  playAudioThen(audio, callbackAtEnd) {
    audio.play();
    audio.on('end', callbackAtEnd);
  }
  */

  playAudioThen(audio, callbackAtEnd, delay = 0) {
    const _this = this;
    audio.play();
    audio.on('end', function(){
      clearTimeout(_this.timerAudio);
      _this.timerAudio = setTimeout(function(){
        callbackAtEnd();
      }, delay);
    });
  }

  startTimerVote() {
    const _this = this;

    this.stopTimerVote();
    this.timerVoteCount = 0;
    this.timerVote = setInterval(function(){
      _this.tickTimerVote();
    }, 1000);
  }

  stopTimerVote() {
    clearInterval(this.timerVote);
  }

  tickTimerVote() {
    this.timerVoteCount++;
    this.checkTimerVote();
  }

  checkTimerVote() {
    if (this.timerVoteCount >= DURATION_LISTEN_TO_VOTES) {
      this.stopTimerVote();
      this.setState(STATE_OUTRO_VOTE);
    }
  }

  resetPlayers() {
    this.players = {};
    this.nbPlayers = 0;
  }

  setPlayers(playersId) {
    const _this = this;
    playersId.forEach(function(playerId) {
      _this.players[playerId] = {
        'vote': null,
        'hasTalk': false
      };
    });

    this.nbPlayers = playersId.length;
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
