const STATE_WAIT_FIRST_PLAYER = 'wait-first-player',
      STATE_WAIT_MORE_PLAYERS = 'wait-more-players',
      STATE_INTRO = 'intro',
      STATE_VOTE_PICK_THEME = 'vote-pick-theme',
      STATE_LISTEN_TO_VOTES = 'listen-to-votes',
      STATE_VOTE_CHOICE_1 = 'vote-choice-1',
      STATE_VOTE_CHOICE_2 = 'vote-choice-2',
      STATE_VOTE_CHOICE_3 = 'vote-choice-3',
      STATE_VOTE_ENDED = 'vote-ended',
      STATE_TALK = 'talk',
      STATE_OUTRO = 'outro';

const DURATION_WAIT_FIRST_PLAYER_LOOP = 60000, // Temps entre chaque répétition du message d'accueil
      DURATION_WAIT_MORE_PLAYERS = 10000, // Temps pour que d'autres joueurs rejoignent le premier
      DURATION_NEW_THEME_READING = 6000, // Temps pour que le joueur lise le thème à voix haute
      DURATION_BETWEEN_RULES_AND_VOTE_1 = 1000, // Temps entre les règles du jeu et le premier vote
      DURATION_VOTE = 5000, // Temps pour voter
      DURATION_MAX_TIMER_TALK = 15000, // Temps MAXIMUM pour parler (par joueur)
      DURATION_OUTRO_TO_NEXT_GAME = 10000; // Temps entre la fin de partie et la prochaine partie


let   AUDIO_WAIT_FIRST_PLAYER = 'WAIT_FIRST_PLAYER',
      AUDIO_WAIT_MORE_PLAYERS = 'WAIT_MORE_PLAYERS', // TO DO
      AUDIO_INTRO = 'INTRO',
      AUDIO_VOTE_PICK_THEME = 'VOTE_P', // 1, 2, 3, 4
      AUDIO_VOTE_START_TIMER = 'VOTE_START_TIMER',
      AUDIO_VOTE_CHOICE_1 = 'VOTE_CHOICE_1',
      AUDIO_VOTE_CHOICE_2 = 'VOTE_CHOICE_2',
      AUDIO_VOTE_CHOICE_3 = 'VOTE_CHOICE_3',
      AUDIO_VOTE_ENDED = 'VOTE_ENDED',
      AUDIO_TALK_START = 'TALK_START_P', // 1, 2, 3, 4
      AUDIO_TALK_THEN = 'TALK_THEN_P', // 1, 2, 3, 4
      AUDIO_TALK_LAST_PLAYER_PREFIX = 'TALK_LAST_PLAYER_PREFIX',
      AUDIO_OUTRO = 'OUTRO';

const AUDIO_FOLDER = 'audio/',
      AUDIO_FADEOUT = 600;



class Game {
  constructor() {
    this.serial;

    this.players;
    this.alivePlayers;
    this.playersWhoCanTalk;
    this.currentPlayerTalking;
    this.listenToTalkEnd = false;

    this.timerState = null;

    this.audioId = 0;
    this.sound = null;
    this.soundId = null;
    this.soundTimeout = null;

    this.$body = document.getElementsByTagName('body')[0]
  }

  init(params = {}) {
    if (params.serial) this.serial = params.serial;
    this.initGame();
  }

  setState(state) {
    let _this = this;

    this.state = state;
    this.$body.setAttribute('data-state', this.state);

    switch (this.state) {
      case STATE_WAIT_FIRST_PLAYER :
        clearTimeout(this.timerState);

        this.writeData("state/waitfirstplayer");

        this.initGame();
        this.loopAudioWithDelay(AUDIO_WAIT_FIRST_PLAYER, DURATION_WAIT_FIRST_PLAYER_LOOP);
      break;

      case STATE_WAIT_MORE_PLAYERS :

        clearTimeout(this.timerState);
        this.writeData("state/waitmoreplayers");

        this.playAudioThen(AUDIO_WAIT_MORE_PLAYERS, function(){
          _this.doThisAfterDelay(function(){
            console.log('settimeOUT check');
            _this.checkPlayersBeforeIntro();
          }, DURATION_WAIT_MORE_PLAYERS);
        });
      break;

      case STATE_INTRO :
        clearTimeout(this.timerState);

        this.writeData("state/intro");

        this.playAudioThen(AUDIO_INTRO, function(){
          _this.setNextState();
        });
      break;

      case STATE_VOTE_PICK_THEME :
        clearTimeout(this.timerState);

        // choose random alive player
        let randomAlivePlayer = this.getRandomAlivePlayer();

        this.writeData("state/votepicktheme");
        this.writeData("playerpicktheme/"+randomAlivePlayer);

        this.playAudioThen(AUDIO_VOTE_PICK_THEME + randomAlivePlayer, function(){
          _this.setNextStateAfterDelay(DURATION_NEW_THEME_READING);
        });
      break;

      case STATE_LISTEN_TO_VOTES :
        clearTimeout(this.timerState);

        this.writeData("state/listentovotes");

        this.playAudioThen(AUDIO_VOTE_START_TIMER, function(){
          _this.doThisAfterDelay(function(){
            _this.setNextState();
          }, DURATION_BETWEEN_RULES_AND_VOTE_1);
        });
      break;

      case STATE_VOTE_CHOICE_1 :
        this.writeData("state/votechoice1");

        this.playAudioThen(AUDIO_VOTE_CHOICE_1, function(){
          _this.doThisAfterDelay(function(){
            _this.setNextState();
          }, DURATION_VOTE);
        });
      break;

      case STATE_VOTE_CHOICE_2 :
        this.writeData("state/votechoice2");

        this.playAudioThen(AUDIO_VOTE_CHOICE_2, function(){
          _this.doThisAfterDelay(function(){
            _this.setNextState();
          }, DURATION_VOTE);
        });
      break;

      case STATE_VOTE_CHOICE_3 :
        this.writeData("state/votechoice3");

        this.playAudioThen(AUDIO_VOTE_CHOICE_3, function(){
          _this.doThisAfterDelay(function(){
            _this.setNextState();
          }, DURATION_VOTE);
        });
      break;

      case STATE_VOTE_ENDED :
        clearTimeout(this.timerState);

        this.writeData("state/voteended");

        this.playAudioThen(AUDIO_VOTE_ENDED, function(){
          _this.setNextState();
        });
      break;

      case STATE_TALK :
        this.writeData("state/talk");
        this.checkNextTalk();
      break;

      case STATE_OUTRO :
        clearTimeout(this.timerState);

        this.writeData("state/outro");

        this.playAudioThen(AUDIO_OUTRO, function(){
          _this.setNextStateAfterDelay(DURATION_OUTRO_TO_NEXT_GAME);
        });
      break;
    }
  }

  doThisAfterDelay(callback, delay) {
    clearTimeout(this.timerState);

    this.timerState = setTimeout(callback, delay);
  }

  setNextStateAfterDelay(delay) {
    const _this = this;
    clearTimeout(this.timerState);

    this.timerState = setTimeout(function(){
      _this.setNextState();
    }, delay);
  }

  setCurrentPlayerTalking() {
    let player;

    if (this.playersWhoCanTalk.length > 1) {
      player = this.playersWhoCanTalk.shift();
    } else {
      player = this.playersWhoCanTalk[0];
      this.playersWhoCanTalk = [];
    }

    this.players[player].hasTalked = true;
    this.currentPlayerTalking = player;

    this.writeData("player/" + player);
  }

  listenToTalk() {
    this.listenToTalkEnd = true;
  }

  isFirstPlayerToTalk() {
    return this.playersWhoCanTalk.length == this.alivePlayers.length;
  }

  isLastPlayerToTalk() {
    return this.playersWhoCanTalk.length == 1;
  }

  checkNextTalk() {
    const _this = this;

    clearTimeout(_this.timerState);

    // first player of talk
    if (this.isFirstPlayerToTalk()) {
      this.setCurrentPlayerTalking();

      this.playAudioThen(AUDIO_TALK_START + this.currentPlayerTalking, function() {
        _this.listenToTalk();

        _this.timerState = setTimeout(function(){
          _this.endTalkAndContinue();
        }, DURATION_MAX_TIMER_TALK);
        /*
        _this.doThisAfterDelay(function(){
          _this.checkNextTalk();
        }, DURATION_MAX_TIMER_TALK);
        */
      });
    }

    // last player: play prefix then last player
    else if (this.isLastPlayerToTalk()) {
      this.playAudioThen(AUDIO_TALK_LAST_PLAYER_PREFIX, function(){
        clearTimeout(_this.timerState);

        _this.setCurrentPlayerTalking();

        _this.playAudioThen(AUDIO_TALK_THEN + _this.currentPlayerTalking, function(){
          _this.listenToTalk();

          _this.timerState = setTimeout(function(){
            _this.endTalkAndContinue();
          }, DURATION_MAX_TIMER_TALK);
          //_this.setNextStateAfterDelay(DURATION_MAX_TIMER_TALK);
        });
      });
    }

    // either 2nd of 3 or 4 players, or 3rd of 4 players
    else {
      clearTimeout(this.timerState);

      this.setCurrentPlayerTalking();

      this.playAudioThen(AUDIO_TALK_THEN + this.currentPlayerTalking, function(){
        _this.listenToTalk();

        _this.timerState = setTimeout(function(){
          _this.endTalkAndContinue();
        }, DURATION_MAX_TIMER_TALK);
        /*
        _this.doThisAfterDelay(function(){
          _this.checkNextTalk();
        }, DURATION_MAX_TIMER_TALK);
        */
      });
    }
  }

  setNextState() {
    switch (this.state) {
      case STATE_WAIT_FIRST_PLAYER :
        this.setState(STATE_WAIT_MORE_PLAYERS);
      break;

      case STATE_WAIT_MORE_PLAYERS :
        this.setState(STATE_INTRO);
      break;

      case STATE_INTRO :
        this.setState(STATE_VOTE_PICK_THEME);
      break;

      case STATE_VOTE_PICK_THEME :
        this.setState(STATE_LISTEN_TO_VOTES);
      break;

      case STATE_LISTEN_TO_VOTES :
        this.setState(STATE_VOTE_CHOICE_1);
      break;

      case STATE_VOTE_CHOICE_1 :
        this.setState(STATE_VOTE_CHOICE_2);
      break;

      case STATE_VOTE_CHOICE_2 :
        this.setState(STATE_VOTE_CHOICE_3);
      break;

      case STATE_VOTE_CHOICE_3 :
        this.setState(STATE_VOTE_ENDED);
      break;

      case STATE_VOTE_ENDED :
        this.setState(STATE_TALK);
      break;

      case STATE_TALK :
        this.setState(STATE_OUTRO);
      break;

      case STATE_OUTRO :
        this.setState(STATE_WAIT_FIRST_PLAYER);
      break;
    }
  }

  isState(state) {
    return state == this.state;
  }

  onData(rawData) {
    let data = rawData.trim();

    console.log('onData', data);

    let parts = data.split('/');

    if (parts.length != 3) return;

    let dataPlayer = parseInt(parts[0]);
    let dataController = parts[1];
    let dataValue = parts[2];


    if (this.isState(STATE_WAIT_FIRST_PLAYER)) {
      // detect a single button
      // '1/button/true'

      if (
        dataController == 'button'
        && dataValue == 'true'
      ) {
         this.addPlayer(dataPlayer);
      }
    }

    else if (this.isState(STATE_WAIT_MORE_PLAYERS)) {
      // detect a single button
      // can be called multiple times
      // '2/button/true'

      if (
        dataController == 'button'
        && dataValue == 'true'
      ) {
         this.addPlayer(dataPlayer);
      }
    }

    else if (this.isState(STATE_LISTEN_TO_VOTES)) {
      // detect a single pot
      // can be called multiple times
      // '3/pot/850'

      if (this.alivePlayers.indexOf(dataPlayer) == -1) return;

      if (dataController == 'pot') {
        // set current pot value
        this.setPlayerVote(dataPlayer, dataValue);
      }

      // detect a single button
      // can be called multiple times
      // '4/button/true'

      if (
        dataController == 'button'
        && dataValue == 'true'
      ) {
        // TODO : useful ? laisser le temps gérer le rythme ?
      }
    }

    else if (this.isState(STATE_VOTE_CHOICE_1)
          || this.isState(STATE_VOTE_CHOICE_2)
          || this.isState(STATE_VOTE_CHOICE_3)) {


      if (this.alivePlayers.indexOf(dataPlayer) == -1) return;

      // detect a single button
      // can be called multiple times
      // '4/button/true'

      if (
        dataController == 'button'
        && dataValue == 'true'
      ) {
                  console.log('send playervote');
                  console.log('playervote/'+dataPlayer);
        this.writeData('playervote/'+dataPlayer);
      }
    }

    else if (this.isState(STATE_TALK)) {
      // detect a single button
      // if a talk has started
      // and this is the current player's button
      // '2/button/true'

      if (
        this.listenToTalkEnd == true
        && this.currentPlayerTalking == dataPlayer
        && dataController == 'button'
        && dataValue == 'true'
      ) {
        // do end player talk
        this.endTalkAndContinue();
      }
    }
  }

  endTalkAndContinue() {
    this.listenToTalkEnd = false;

    if (this.isNoPlayerLeftWhoCanTalk()) {
      this.setNextState();
    } else {
      this.checkNextTalk();
    }
  }

  isNoPlayerLeftWhoCanTalk() {
    return this.playersWhoCanTalk.length == 0;
  }

  writeData(data) {
    console.log('Game -> Arduino', data);
    serial.write(data)
  }

  playAudio(soundName) {
    this.setNextAudioId();
    this.doAudio(new Howl({
      src: [this.getSoundFilePath(soundName)]
    }));
  }

  playAudioThen(soundName, callbackOnEnd) {
    this.setNextAudioId();
    this.doAudio(new Howl({
      src: [this.getSoundFilePath(soundName)],
      onend: callbackOnEnd
    }));
  }

  loopAudio(soundName) {
    this.setNextAudioId();
    this.doAudio(new Howl({
      src: [this.getSoundFilePath(soundName)],
      loop: true
    }));
  }

  loopAudioWithDelay(soundName, delay) {
    const _this = this;

    this.setNextAudioId();

    const audioId = this.audioId;

    this.doAudio(new Howl({
      src: [this.getSoundFilePath(soundName)],
      onend: function(){
        if (audioId == _this.audioId) {
          _this.soundTimeout = setTimeout(function(){
            _this.loopAudioWithDelay(soundName, delay);
          }, delay);
        }
      }
    }));
  }

  doAudio(audio) {
    const _this = this;

    let delayBeforeSound = this.stopPreviousSound();

    this.soundTimeout = setTimeout(function(){
      _this.sound = null;
      _this.sound = audio;
      _this.soundId = _this.sound.play();
    }, delayBeforeSound);
  }

  setNextAudioId() {
    this.audioId++;
  }

  stopPreviousSound() {
    let delayBeforeSound = 0;

    if (this.soundId != null) {
      this.sound.fade(1, 0, AUDIO_FADEOUT, this.soundId);
      delayBeforeSound = AUDIO_FADEOUT;
    }

    clearTimeout(this.soundTimeout);

    return delayBeforeSound;
  }

  getSoundFilePath(soundName) {
    return AUDIO_FOLDER + soundName + '.mp3'
  }

  canInteract() {
    return this.interactionEnabled;
  }

  initGame() {
    this.listenToTalkEnd = false;
    this.currentPlayerTalking = null;
    this.alivePlayers = [];
    this.playersWhoCanTalk = [];
    this.players = {
      1: {
        alive: false,
        hasTalked: false,
        pot: null,
        vote: null
      },
      2: {
        alive: false,
        hasTalked: false,
        pot: null,
        vote: null
      },
      3: {
        alive: false,
        hasTalked: false,
        pot: null,
        vote: null
      },
      4: {
        alive: false,
        hasTalked: false,
        pot: null,
        vote: null
      }
    };
  }

  addPlayer(player) {
    if (this.players[player].alive == false) {
      this.players[player].alive = true;
      this.alivePlayers.push(player);
      this.playersWhoCanTalk.push(player);

      this.writeData(player + "/playeralive");

      // if this is the 1st player
      if (this.isState(STATE_WAIT_FIRST_PLAYER)) {
        this.setState(STATE_WAIT_MORE_PLAYERS);
      }

      // if this is the 2nd, 3rd or 4th player
      else if (this.isState(STATE_WAIT_MORE_PLAYERS)) {
        // if this is the last player (4th),
        // let's go to next state
        if (this.alivePlayers.length == 4) {
          this.checkPlayersBeforeIntro();
        }

      }
    }
  }

  checkPlayersBeforeIntro() {
    console.log('check it');
    if (this.alivePlayers.length >= 2) {
      if (this.state == STATE_WAIT_FIRST_PLAYER
       || this.state == STATE_WAIT_MORE_PLAYERS) {

        this.shuffle(this.playersWhoCanTalk);
        this.setNextState();
      }
    } else {
      // reset game
      this.setState(STATE_WAIT_FIRST_PLAYER);
    }

    //clearTimeout(this.timerState);
  }

  setPlayerVote(player, value) {
    this.players[player].pot = value;

    let vote = 0;

    if (value <= 341) {
      vote = -1;
    } else if (value >= 682) {
      vote = 1;
    }

    this.players[player].vote = vote;
  }

  getRandomAlivePlayer() {
    return this.alivePlayers[Math.round(Math.random() * (this.alivePlayers.length - 1))];
  }

  shuffle(array) {
    let currentIndex = array.length,  randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array;
  }
}
