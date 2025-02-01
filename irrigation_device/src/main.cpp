#include <Arduino.h>
#include "RandomNumber.h"
#include "LedIndicator.h"
#include "Storage.h"
#include "connector.h"
#include "WebServer.h"
#include "ApiClient.h"

byte red = 27;
byte green = 26;
byte blue = 25;
byte togglePin = 13;

int toggleCount = 0;

void setup() {
  // put your setup code here, to run once: 
  Serial.begin(9600);
  pinMode(red,OUTPUT);
  pinMode(green,OUTPUT);
  pinMode(blue,OUTPUT);
  pinMode(togglePin, INPUT);
}

void increase(byte pin){
  for (int i = 0; i <= 255; i++) {
    analogWrite(pin,i);
    delay(1);
  }
}

void decrease(byte pin){
  for (int i = 255; i >= 0; i--) {
    analogWrite(pin,i);
    delay(1);
  }
}

void loop() {
  int buttonState = digitalRead(togglePin);
  if (buttonState == HIGH) {
    toggleCount++;
    Serial.println("Toggle count: " + String(toggleCount));
    delay(500);
    return;
  }
  Serial.println("Button state: " + String(buttonState));
  delay(500);
  return;
  byte randNumber = generateRandom();

  if (randNumber == 1) {
    increase(red);
    delay(500);
    increase(green);
    delay(500);
    increase(blue);
    delay(500);
  } else if (randNumber == 2) {
    increase(green);
    delay(500);
    increase(blue);
    delay(500);
    increase(red);
    delay(500);
  } else if (randNumber == 3) {
    increase(blue);
    delay(500);
    increase(red);
    delay(500);
    increase(green);
    delay(500);
  }

  randNumber = generateRandom();

  if (randNumber == 1) {
    decrease(red);
    delay(500);
    decrease(green);
    delay(500);
    decrease(blue);
    delay(500);
  } else if (randNumber == 2) {
    decrease(green);
    delay(500);
    decrease(blue);
    delay(500);
    decrease(red);
    delay(500);
  } else if (randNumber == 3) {
    decrease(blue);
    delay(500);
    decrease(red);
    delay(500);
    decrease(green);
    delay(500);
}
}
