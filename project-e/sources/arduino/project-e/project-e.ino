#include <FastLED.h>
#define NUM_LEDS 24
#define DATA_PIN 8

// analog : A0, A1…
/*
  int pot1 = 0;
  int pot2 = 1;
  int pot3 = 2;
  int pot4 = 3;
*/

// digital : D2, D3…
int button1 = 2;
int button2 = 3;
int button3 = 4;
int button4 = 5;

bool players[4] = {false, false, false, false};

int playersVotes[4] = {0, 0, 0, 0};

CRGB leds[NUM_LEDS];

String state = "ARDUINOBOOT";
String dataFromGame = "";

float breathTime = 0;
int breathSpeed = 8;

float hueTime = 0;
int hueSpeed = 8;

int playerPickTheme = 0;

int playerTalking = 0;

int playersLed[4][6] = {
  {0, 1, 2, 3, 4, 5},
  {6, 7, 8, 9, 10, 11},
  {12, 13, 14, 15, 16},
  {17, 18, 19, 20, 21, 22}
};

CRGB colorNoPlayer = CRGB(0, 0, 0);

float breath;
float hue;


void setup() {

  delay(1000);

  /*
    pinMode(pot1, INPUT);
    pinMode(pot2, INPUT);
    pinMode(pot3, INPUT);
    pinMode(pot4, INPUT);
  */

  pinMode(button1, INPUT_PULLUP);
  pinMode(button2, INPUT_PULLUP);
  pinMode(button3, INPUT_PULLUP);
  pinMode(button4, INPUT_PULLUP);

  FastLED.setBrightness(255);
  FastLED.addLeds<NEOPIXEL, DATA_PIN>(leds, NUM_LEDS);

  Serial.begin(9600);
}


void loop() {

  /*
    int valPot1 = analogRead(pot1);
    int valPot2 = analogRead(pot2);
    int valPot3 = analogRead(pot3);
    int valPot4 = analogRead(pot4);
  */

  int valButton1 = digitalRead(button1);
  int valButton2 = digitalRead(button2);
  int valButton3 = digitalRead(button3);
  int valButton4 = digitalRead(button4);
  /*
    Serial.print("but1 (");
    Serial.print(valButton1);

    Serial.print(") but2 (");
    Serial.print(valButton2);

    Serial.print(") but3 (");
    Serial.print(valButton3);

    Serial.print(") but4 (");
    Serial.print(valButton4);

    Serial.println(")");
  */

  /* DEV*/


  breathTime++;
  hueTime++;

  // Breath function
  if (breathTime > breathSpeed * 10) {
    breathTime = 0;
  }

  if (hueTime > hueSpeed * 10) {
    hueTime = 0;
  }

  breath = map(sin(breathTime / breathSpeed) * 100, -100, 100, 50.0, 210.0);
  hue = map(sin(hueTime / hueSpeed) * 100, -100, 100, 180, 210);

  CRGB colorBreath = CHSV(hue, 255, breath);


  setPlayerColor(1, colorBreath);
  setPlayerColor(2, colorBreath);
  setPlayerColor(3, colorBreath);
  setPlayerColor(4, colorBreath);


  /* //DEV */


  if (state == "STATE_WAIT_FIRST_PLAYER") {

    if (valButton1 == 0) {
      Serial.println("1/button/true");
    }

    if (valButton2 == 0) {
      Serial.println("2/button/true");
    }

    if (valButton3 == 0) {
      Serial.println("3/button/true");
    }

    if (valButton4 == 0) {
      Serial.println("4/button/true");
    }
  }


  else if (state == "STATE_WAIT_MORE_PLAYERS") {
    CRGB colorAlivePlayer = CRGB(255, 255, 255);


    setPlayerColorIfAliveOrElse(1, colorAlivePlayer, colorBreath);
    setPlayerColorIfAliveOrElse(2, colorAlivePlayer, colorBreath);
    setPlayerColorIfAliveOrElse(3, colorAlivePlayer, colorBreath);
    setPlayerColorIfAliveOrElse(4, colorAlivePlayer, colorBreath);


    if (valButton1 == 0) {
      Serial.println("1/button/true");
    }

    if (valButton2 == 0) {
      Serial.println("2/button/true");
    }

    if (valButton3 == 0) {
      Serial.println("3/button/true");
    }

    if (valButton4 == 0) {
      Serial.println("4/button/true");
    }
  }


  else if (state == "STATE_INTRO") {
    CRGB colorAlivePlayer = CRGB(255, 255, 255);

    setPlayerColorIfAliveOrElse(1, colorAlivePlayer, colorNoPlayer);
    setPlayerColorIfAliveOrElse(2, colorAlivePlayer, colorNoPlayer);
    setPlayerColorIfAliveOrElse(3, colorAlivePlayer, colorNoPlayer);
    setPlayerColorIfAliveOrElse(4, colorAlivePlayer, colorNoPlayer);

  }


  else if (state == "STATE_VOTE_PICK_THEME") {
    CRGB colorAlivePlayer = CHSV(255, 0, 50);
    CRGB colorPlayerPickTheme = CHSV(180, 255, breath);
    //CRGB colorBreath = CHSV(hue, 255, breath);

    setPlayerColorIfPickThemeOrAliveOrElse(1, colorPlayerPickTheme, colorAlivePlayer, colorNoPlayer);
    setPlayerColorIfPickThemeOrAliveOrElse(2, colorPlayerPickTheme, colorAlivePlayer, colorNoPlayer);
    setPlayerColorIfPickThemeOrAliveOrElse(3, colorPlayerPickTheme, colorAlivePlayer, colorNoPlayer);
    setPlayerColorIfPickThemeOrAliveOrElse(4, colorPlayerPickTheme, colorAlivePlayer, colorNoPlayer);

  }


  else if (state == "STATE_LISTEN_TO_VOTES") {
    CRGB color = CRGB(255, 255, 255);

    setPlayerColorIfAliveOrElse(1, color, colorNoPlayer);
    setPlayerColorIfAliveOrElse(2, color, colorNoPlayer);
    setPlayerColorIfAliveOrElse(3, color, colorNoPlayer);
    setPlayerColorIfAliveOrElse(4, color, colorNoPlayer);

  }

  else if (state == "STATE_VOTE_CHOICE_1") {
    CRGB color = CHSV(180, 255, breath);

    setPlayerColorIfVotedOrAliveOrElse(1, color, colorNoPlayer);
    setPlayerColorIfVotedOrAliveOrElse(2, color, colorNoPlayer);
    setPlayerColorIfVotedOrAliveOrElse(3, color, colorNoPlayer);
    setPlayerColorIfVotedOrAliveOrElse(4, color, colorNoPlayer);



    if (valButton1 == 0) {
      Serial.println("1/button/true");
    }

    if (valButton2 == 0) {
      Serial.println("2/button/true");
    }

    if (valButton3 == 0) {
      Serial.println("3/button/true");
    }

    if (valButton4 == 0) {
      Serial.println("4/button/true");
    }
  }

  else if (state == "STATE_VOTE_CHOICE_2") {
    CRGB color = CHSV(200, 255, breath);

    setPlayerColorIfVotedOrAliveOrElse(1, color, colorNoPlayer);
    setPlayerColorIfVotedOrAliveOrElse(2, color, colorNoPlayer);
    setPlayerColorIfVotedOrAliveOrElse(3, color, colorNoPlayer);
    setPlayerColorIfVotedOrAliveOrElse(4, color, colorNoPlayer);


    if (valButton1 == 0) {
      Serial.println("1/button/true");
    }

    if (valButton2 == 0) {
      Serial.println("2/button/true");
    }

    if (valButton3 == 0) {
      Serial.println("3/button/true");
    }

    if (valButton4 == 0) {
      Serial.println("4/button/true");
    }
  }

  else if (state == "STATE_VOTE_CHOICE_3") {
    CRGB color = CHSV(220, 255, breath);

    setPlayerColorIfVotedOrAliveOrElse(1, color, colorNoPlayer);
    setPlayerColorIfVotedOrAliveOrElse(2, color, colorNoPlayer);
    setPlayerColorIfVotedOrAliveOrElse(3, color, colorNoPlayer);
    setPlayerColorIfVotedOrAliveOrElse(4, color, colorNoPlayer);


    if (valButton1 == 0) {
      Serial.println("1/button/true");
    }

    if (valButton2 == 0) {
      Serial.println("2/button/true");
    }

    if (valButton3 == 0) {
      Serial.println("3/button/true");
    }

    if (valButton4 == 0) {
      Serial.println("4/button/true");
    }
  }

  if (state == "STATE_VOTE_ENDED") {
    CRGB color = CHSV(220, 255, breath);

    setPlayerColorIfVotedOrAliveOrElse(1, color, colorNoPlayer);
    setPlayerColorIfVotedOrAliveOrElse(2, color, colorNoPlayer);
    setPlayerColorIfVotedOrAliveOrElse(3, color, colorNoPlayer);
    setPlayerColorIfVotedOrAliveOrElse(4, color, colorNoPlayer);

    playerTalking = 0;
  }



  if (state == "STATE_TALK") {
    CRGB color = CHSV(220, 255, breath);

    setPlayerColorIfTalkingOrAliveOrElse(1, color, colorNoPlayer);
    setPlayerColorIfTalkingOrAliveOrElse(2, color, colorNoPlayer);
    setPlayerColorIfTalkingOrAliveOrElse(3, color, colorNoPlayer);
    setPlayerColorIfTalkingOrAliveOrElse(4, color, colorNoPlayer);

    if (valButton1 == 0) {
      Serial.println("1/button/true");
    }

    if (valButton2 == 0) {
      Serial.println("2/button/true");
    }

    if (valButton3 == 0) {
      Serial.println("3/button/true");
    }

    if (valButton4 == 0) {
      Serial.println("4/button/true");
    }
  }

  if (state == "STATE_OUTRO") {

    CRGB color = CHSV(220, 255, breath);

    setPlayerColorIfVotedOrAliveOrElse(1, color, colorNoPlayer);
    setPlayerColorIfVotedOrAliveOrElse(2, color, colorNoPlayer);
    setPlayerColorIfVotedOrAliveOrElse(3, color, colorNoPlayer);
    setPlayerColorIfVotedOrAliveOrElse(4, color, colorNoPlayer);
  }

  FastLED.show();

  delay(50);
}



void serialEvent() {
  while (Serial.available()) {
    char inChar = (char)Serial.read();

    if (inChar == '\n') {
      checkData();

      dataFromGame = "";
    }
    else dataFromGame += inChar;
  }
}

void checkData() {
  Serial.print("checkData / dataFromGame : ");
  Serial.println(dataFromGame);

  if (dataFromGame == "state/waitfirstplayer") {
    state = "STATE_WAIT_FIRST_PLAYER";
    players[0] = false;
    players[1] = false;
    players[2] = false;
    players[3] = false;

    playersVotes[0] = 0;
    playersVotes[1] = 0;
    playersVotes[2] = 0;
    playersVotes[3] = 0;

    playerPickTheme = 0;

    breathTime = 0;
    hueTime = 0;
    return;
  }

  if (dataFromGame == "state/waitmoreplayers") {
    state = "STATE_WAIT_MORE_PLAYERS";
    return;
  }

  if (dataFromGame == "state/intro") {
    state = "STATE_INTRO";
    return;
  }

  if (dataFromGame == "state/votepicktheme") {
    state = "STATE_VOTE_PICK_THEME";
    return;
  }

  if (dataFromGame == "state/listentovotes") {
    state = "STATE_LISTEN_TO_VOTES";
    return;
  }

  if (dataFromGame == "state/votechoice1") {
    state = "STATE_VOTE_CHOICE_1";
    return;
  }

  if (dataFromGame == "state/votechoice2") {
    state = "STATE_VOTE_CHOICE_2";
    return;
  }

  if (dataFromGame == "state/votechoice3") {
    state = "STATE_VOTE_CHOICE_3";
    return;
  }

  if (dataFromGame == "state/voteended") {
    state = "STATE_VOTE_ENDED";
    return;
  }

  if (dataFromGame == "state/talk") {
    state = "STATE_TALK";
    return;
  }

  if (dataFromGame == "state/outro") {
    state = "STATE_OUTRO";
    return;
  }




  if (dataFromGame == "1/playeralive") {
    players[0] = true;
    return;
  }

  if (dataFromGame == "2/playeralive") {
    players[1] = true;
    return;
  }

  if (dataFromGame == "3/playeralive") {
    players[2] = true;
    return;
  }

  if (dataFromGame == "4/playeralive") {
    players[3] = true;
    return;
  }




  if (dataFromGame == "player/1") {
    playerTalking = 1;
    return;
  }

  if (dataFromGame == "player/2") {
    playerTalking = 2;
    return;
  }

  if (dataFromGame == "player/3") {
    playerTalking = 3;
    return;
  }

  if (dataFromGame == "player/4") {
    playerTalking = 4;
    return;
  }




  if (dataFromGame == "playerpicktheme/1") {
    playerPickTheme = 1;
    return;
  }
  if (dataFromGame == "playerpicktheme/2") {
    playerPickTheme = 2;
    return;
  }
  if (dataFromGame == "playerpicktheme/3") {
    playerPickTheme = 3;
    return;
  }
  if (dataFromGame == "playerpicktheme/4") {
    playerPickTheme = 4;
    return;
  }




  state.trim();

  if (dataFromGame == "playervote/1") {

    if (state == "STATE_VOTE_CHOICE_1") {
      playersVotes[0] = 1;
    }
    else if (state == "STATE_VOTE_CHOICE_2") {
      playersVotes[0] = 2;
    }
    else if (state == "STATE_VOTE_CHOICE_3") {
      playersVotes[0] = 3;
    }
    return;
  }

  if (dataFromGame == "playervote/2") {
    if (state == "STATE_VOTE_CHOICE_1") {
      playersVotes[1] = 1;
    }
    else if (state == "STATE_VOTE_CHOICE_2") {
      playersVotes[1] = 2;
    }
    else if (state == "STATE_VOTE_CHOICE_3") {
      playersVotes[1] = 3;
    }
    return;
  }

  if (dataFromGame == "playervote/3") {
    if (state == "STATE_VOTE_CHOICE_1") {
      playersVotes[2] = 1;
    }
    else if (state == "STATE_VOTE_CHOICE_2") {
      playersVotes[2] = 2;
    }
    else if (state == "STATE_VOTE_CHOICE_3") {
      playersVotes[2] = 3;
    }
    return;
  }

  if (dataFromGame == "playervote/4") {
    if (state == "STATE_VOTE_CHOICE_1") {
      playersVotes[3] = 1;
    }
    else if (state == "STATE_VOTE_CHOICE_2") {
      playersVotes[3] = 2;
    }
    else if (state == "STATE_VOTE_CHOICE_3") {
      playersVotes[3] = 3;
    }
    return;
  }
}

void setPlayerColor(int playerId, CRGB color) {

  // Player 1 : LEDs 0-5
  // Player 2 : LEDs 6-11
  // Player 3 : LEDs 12-17
  // Player 4 : LEDs 18-23

  for (int i = (6 * (playerId - 1)); i <= (playerId * 6 - 1); i++) {
    leds[i] = color;
  }
}

void setPlayerColorIfAliveOrElse(int playerId, CRGB color1, CRGB color2) {
  if (players[playerId - 1] == true) {
    setPlayerColor(playerId, color1);
  } else {
    setPlayerColor(playerId, color2);
  }
}

void setPlayerColorIfPickThemeOrAliveOrElse(int playerId, CRGB color1, CRGB color2, CRGB color3) {
  if (playerId == playerPickTheme) {
    setPlayerColor(playerId, color1);
  }

  else if (players[playerId - 1] == true) {
    setPlayerColor(playerId, color2);
  }

  else {
    setPlayerColor(playerId, color3);
  }
}

void setPlayerColorIfVotedOrAliveOrElse(int playerId, CRGB color1, CRGB color2) {

  if (players[playerId - 1] == true) {
    if (playersVotes[playerId - 1] == 1) {
      setPlayerColor(playerId, CHSV(180, 255, 255));
    }

    else if (playersVotes[playerId - 1] == 2) {
      setPlayerColor(playerId, CHSV(200, 255, 255));
    }

    else if (playersVotes[playerId - 1] == 3) {
      setPlayerColor(playerId, CHSV(220, 255, 255));
    }

    else if (playersVotes[playerId - 1] == 0) {
      setPlayerColor(playerId, color1);
    }

  }

  else {
    setPlayerColor(playerId, color2);
  }
}





void setPlayerColorIfTalkingOrAliveOrElse(int playerId, CRGB color1, CRGB color2) {

  if (players[playerId - 1] == true) {
    if (playersVotes[playerId - 1] == 1) {
      if (playerTalking == playerId) {
        setPlayerColor(playerId, CHSV(180, 255, breath));
      } else {
        setPlayerColor(playerId, CHSV(180, 255, 255));
      }
    }

    else if (playersVotes[playerId - 1] == 2) {
      if (playerTalking == playerId) {
        setPlayerColor(playerId, CHSV(200, 255, breath));
      } else {
        setPlayerColor(playerId, CHSV(200, 255, 255));
      }
    }

    else if (playersVotes[playerId - 1] == 3) {
      if (playerTalking == playerId) {
        setPlayerColor(playerId, CHSV(220, 255, breath));
      } else {
        setPlayerColor(playerId, CHSV(220, 255, 255));
      }
    }

    else if (playersVotes[playerId - 1] == 0) {
      setPlayerColor(playerId, color1);
    }

  }

  else {
    setPlayerColor(playerId, color2);
  }
}
