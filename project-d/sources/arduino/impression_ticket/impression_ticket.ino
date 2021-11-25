#include "Adafruit_Thermal.h"
#include "frame.h"
#include "logo.h"
#include "SoftwareSerial.h"
#define TX_PIN 6 // Arduino transmit  YELLOW WIRE  labeled RX on printer
#define RX_PIN 5 // Arduino receive   GREEN WIRE   labeled TX on printer


int article = 3;
int donnees[] = {0, 1, 0, 1, 1, 0, 1, 1 , 1};
int prix = 0;

String cart;
String item = "";

String dataFromGame = "";

SoftwareSerial mySerial(RX_PIN, TX_PIN); // Declare SoftwareSerial obj first
Adafruit_Thermal printer(&mySerial);

void setup() {
  Serial.begin(9600);
  // put your setup code here, to run once:
  mySerial.begin(19200);  // Initialize SoftwareSerial
  //Serial1.begin(19200); // Use this instead if using hardware serial
}

void loop() {
  // put your main code here, to run repeatedly:

}




void serialEvent() {
  while (Serial.available()) {
    char inChar = (char)Serial.read();

    /*
      if (inChar != 'c' && inChar != 'i') {
        cart[cartIndex] = inChar;
        cartIndex++;
      }
    */


    if (inChar == '\n') {
      dataFromGame.trim();
      Serial.print("dataFromGame : ");
      Serial.print(dataFromGame);

      if (dataFromGame.charAt(0) == 'C') {
        // cart list
        dataFromGame.remove(0, 1);
        cart = dataFromGame;
        prix = 0;

        printTicket();
      }

      if (dataFromGame.charAt(0) == 'I') {
        dataFromGame.remove(0, 1);
        item = dataFromGame;
      }

      checkData();
      dataFromGame = "";
    }
    else dataFromGame += inChar;
  }
}

void checkData() {
  Serial.print("checkData / dataFromGame : ");
  Serial.println(dataFromGame);


  Serial.println(item);

  Serial.println(cart);

  if (dataFromGame == "state/wait") {
    // state = "STATE_WAIT";
    return;
  }
}



void printTicket() {
  
  printer.wake();       // MUST wake() before printing again, even if reset
  printer.setDefault();
  printer.begin();
  printer.justify('L');
  printer.printBitmap(logo_width, logo_height, logo_data);
  printer.println(F(""));
  printer.println(F(""));
  printer.println(F("VOTRE SUPERMARCHE DES DONNEES"));
  printer.println(F("EST OUVERT LE VENDREDI DE 9H"));
  printer.println(F("A 17H30 ET LE SAMEDI ET DIMANCHE"));
  printer.println(F("DE 10H A 18H"));
  printer.println(F("_______________________________"));
  printer.boldOn();
  printer.println(F("Votre achat"));
  printer.boldOff();
  printer.println(F(""));
  if (item == "1") {
    printer.print(F("UNE PAIRE D'ECOUTEURS       100$"));
  }
  else if (item == "2") {
    printer.print(F("UN TELEPHONE              1 000$"));
  }
  else {
    printer.print(F("UNE VOITURE DE SPORT     30 000$"));
  }

  printer.println(F("_______________________________"));
  printer.boldOn();
  printer.println(F("Donnees echangees"));
  printer.boldOff();
  printer.println(F(""));
  if (cart.indexOf("1") != -1) {
    printer.println(F("NOM/PRENOM                  10R"));
    prix = prix + 10;
  }
  if (cart.indexOf("2") != -1) {
    printer.println(F("GROUPE SANGUIN              10R"));
    prix = prix + 10;
  }
  if (cart.indexOf("3") != -1) {
    printer.println(F("POIDS                       10R"));
    prix = prix + 10;
  }
  if (cart.indexOf("4") != -1) {
    printer.println(F("ADRESSE                     30R"));
    prix = prix + 30;
  }
  if (cart.indexOf("5") != -1) {
    printer.println(F("PANIER D'ACHAT EN LIGNE     30R"));
    prix = prix + 30;
  }
  if (cart.indexOf("6") != -1) {
    printer.println(F("ORIENTATION SEXUELLE        30R"));
    prix = prix + 30;
  }
  if (cart.indexOf("7") != -1) {
    printer.println(F("ARBRE GENEALOGIQUE          90R"));
    prix = prix + 90;
  }
  if (cart.indexOf("8") != -1) {
    printer.println(F("SITUATION FINANCIERE        90R"));
    prix = prix + 90;
  }
  if (cart.indexOf("9") != -1) {
    printer.println(F("GALERIE PHOTO               90R"));
    prix = prix + 90;
  }


  printer.print(F("TOTAL REGLE                 "));
  printer.print((prix));
  printer.println(F("R"));
  printer.println(F("_______________________________"));
  printer.boldOn();
  printer.println(F("Ce que vous allez vraiment payer"));
  printer.boldOff();
  printer.println(F(""));

  if (cart.indexOf("1") != -1) {
    printer.println(F("USURPATION D'IDENTITE"));

  }
  if (cart.indexOf("2") != -1) {


  }
  if (cart.indexOf("3") != -1) {
    printer.println(F("PUB DE REGIME"));
    printer.println(F("PUB DE SALLE DE SPORT"));

  }
  if (cart.indexOf("4") != -1) {
    printer.println(F("HARCELEMENT PAR LA POSTE"));
    printer.println(F("PORTE A PORTE"));

  }
  if (cart.indexOf("5") != -1) {
    printer.println(F("PUB CIBLEES SUR VOS GOUTS"));
    printer.println(F("ARNAQUE DE PAIEMENTS"));

  }
  if (cart.indexOf("6") != -1) {
    printer.println(F("COMING OUT NON VOULU"));
    printer.println(F("POP UP SITE DE RENCONTRE"));

  }
  if (cart.indexOf("7") != -1) {
    printer.println(F("SPAMS PERSONNALISES"));

  }
  if (cart.indexOf("8") != -1) {
    printer.println(F("DEMANDE DE RANCON"));

  }
  if (cart.indexOf("9") != -1) {
    printer.println(F("DEEP FAKE"));
    printer.println(F("LOCALISATION"));
    printer.println(F("FUITE DE PHOTOS"));

  }





  printer.println(F("_______________________________"));
  printer.boldOn();
  printer.println(F("FELICITATION"));
  printer.println(F("VOUS N'AVEZ PLUS"));
  printer.println(F("DE VIE PRIVEE !"));

  
  if (item == "1") {
    printer.println(F("MAIS VOUS AVEZ DES ECOUTEURS"));
  }
  else if (item == "2") {
    printer.println(F("MAIS VOUS AVEZ UN TELEPHONE"));
  }
  else if (item == "3") {
    printer.println(F("MAIS VOUS AVEZ UNE VOITURE"));
  }
  printer.boldOff();
  printer.println(F(""));
  printer.println(F("MERCI D'AVOIR FAIT CONFIANCE"));
  printer.println(F("AU SUPERMARCHE DES DONNEES"));
  printer.println(F(""));

  printer.justify('C');
  printer.printBitmap(frame_width, frame_height, frame_data);
  printer.println(F(" "));
  printer.println(F(" "));
  printer.println(F(" "));

  printer.sleep();      // Tell printer to sleep
  //delay(3000L);         // Sleep for 3 seconds
  

}
