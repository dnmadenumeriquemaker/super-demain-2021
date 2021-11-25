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

CRGB leds[NUM_LEDS];

String state = "ARDUINOBOOT";
String dataFromGame = "";

float breathTime = 0;
int breathSpeed = 8;

float hueTime = 0;
int hueSpeed = 8;

int playersLed[4][6] = {
  {0, 1, 2, 3, 4, 5},
  {6, 7, 8, 9, 10, 11},
  {12, 13, 14, 15, 16},
  {17, 18, 19, 20, 21, 22}
};

CRGB colorNoPlayer = CRGB(0, 0, 0);


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

  Serial.print("but1 (");
  Serial.print(valButton1);

  Serial.print(") but2 (");
  Serial.print(valButton2);

  Serial.print(") but3 (");
  Serial.print(valButton3);

  Serial.print(") but4 (");
  Serial.print(valButton4);

  Serial.println(")");


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

  float breath = map(sin(breathTime / breathSpeed) * 100, -100, 100, 50.0, 210.0);
  float hue = map(sin(hueTime / hueSpeed) * 100, -100, 100, 180, 210);

  CRGB colorBreath = CHSV(hue, 255, breath);


  setPlayerColor(1, colorBreath);
  setPlayerColor(2, colorBreath);
  setPlayerColor(3, colorBreath);
  setPlayerColor(4, colorBreath);


  FastLED.show();
  /* //DEV */

  
  if (state == "STATE_WAIT_FIRST_PLAYER") {
    breathTime++;
    hueTime++;

    //setPlayerColor(1, colorBreath);
    /*
      setPlayerColor(2, color);
      setPlayerColor(3, color);
      setPlayerColor(4, color);
    */

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
    CRGB colorAlivePlayer = CRGB(205, 150, 0);
    /*

    setPlayerColorIfAliveOrElse(1, colorAlivePlayer, colorBreath);
    setPlayerColorIfAliveOrElse(2, colorAlivePlayer, colorBreath);
    setPlayerColorIfAliveOrElse(3, colorAlivePlayer, colorBreath);
    setPlayerColorIfAliveOrElse(4, colorAlivePlayer, colorBreath);
    */

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
    CRGB colorAlivePlayer = CRGB(0, 255, 0);
/*
    setPlayerColorIfAliveOrElse(1, colorAlivePlayer, colorNoPlayer);
    setPlayerColorIfAliveOrElse(2, colorAlivePlayer, colorNoPlayer);
    setPlayerColorIfAliveOrElse(3, colorAlivePlayer, colorNoPlayer);
    setPlayerColorIfAliveOrElse(4, colorAlivePlayer, colorNoPlayer);
    */
  }


  else if (state == "STATE_LISTEN_TO_VOTES") {
    CRGB color = CRGB::Blue;

   // setPlayerColor(1, color);
    /*
      setPlayerColor(2, color);
      setPlayerColor(3, color);
      setPlayerColor(4, color);
    */
  }

  else if (state == "STATE_LISTEN_TO_VOTES") {

    CRGB color = CRGB::Black;
    /*
      if (valPot1 < 330) {
      color = CRGB::Cyan;
      }

      else if (valPot1 >= 330 && valPot1 < 660) {
      color = CRGB::Blue;
      }

      else if (valPot1 >= 660) {
      color = CRGB::Purple;
      }


      for (int i = 0; i < 6; i++) {
      leds[i] = color;
      }
    */

  }
  
  if (state == "STATE_TALK") {
    breathTime++;
    hueTime++;

    //setPlayerColor(1, colorBreath);
    /*
      setPlayerColor(2, color);
      setPlayerColor(3, color);
      setPlayerColor(4, color);
    */

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

  FastLED.show();

  /*
    // DEUXIEME BOUTON COULEUR
    int valPot2 = analogRead(A1);

    if (valPot2 < 330)
    {
      for (int i = 6; i < 12; i++)
      {
        leds[i] = CRGB::Green;

        // Show the leds (only one of which is set to white, from above)
        FastLED.show();
      }
    }

    else if (valPot2 > 330 && valPot2 < 660)
    {
      for (int i = 6; i < 12; i++)
      {
        leds[i] = CRGB::Yellow;

        // Show the leds (only one of which is set to white, from above)
        FastLED.show();
      }
    }

    else if (valPot2 > 660)
    {
      for (int i = 6; i < 12; i++)
      {
        leds[i] = CRGB::Red;

        // Show the leds (only one of which is set to white, from above)
        FastLED.show();
      }
    }

    //TROISIEME BOUTON COULEUR
    int valPot3 = analogRead(A2);

    if (valPot3 < 330)
    {
      for (int i = 12; i < 18; i++)
      {
        leds[i] = CRGB::Green;

        // Show the leds (only one of which is set to white, from above)
        FastLED.show();
      }
    }

    else if (valPot3 > 330 && valPot3 < 660)
    {
      for (int i = 12; i < 18; i++)
      {
        leds[i] = CRGB::Yellow;

        // Show the leds (only one of which is set to white, from above)
        FastLED.show();
      }
    }

    else if (valPot3 > 660)
    {
      for (int i = 12; i < 18; i++)
      {
        leds[i] = CRGB::Red;

        // Show the leds (only one of which is set to white, from above)
        FastLED.show();
      }
    }

    // QUATRIEME BOUTON COULEUR
    int valPot4 = analogRead(A3);

    if (valPot4 < 330)
    {
      for (int i = 18; i < 24; i++)
      {
        leds[i] = CRGB::Green;

        // Show the leds (only one of which is set to white, from above)
        FastLED.show();
      }
    }

    else if (valPot4 > 330 && valPot4 < 660)
    {
      for (int i = 18; i < 24; i++)
      {
        leds[i] = CRGB::Yellow;

        // Show the leds (only one of which is set to white, from above)
        FastLED.show();
      }
    }

    else if (valPot4 > 660)
    {
      for (int i = 18; i < 24; i++)
      {
        leds[i] = CRGB::Red;

        // Show the leds (only one of which is set to white, from above)
        FastLED.show();
      }
    }
  */
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

  if (dataFromGame == "state/waitfirstplayer") {
    state = "STATE_WAIT_FIRST_PLAYER";
    return;
  }

  if (dataFromGame == "state/listentovotes") {
    state = "STATE_LISTEN_TO_VOTES";
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
