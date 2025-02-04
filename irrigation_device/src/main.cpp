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

// clock
byte sda = 21;
byte scl = 22;

void setup() {
  // put your setup code here, to run once: 
  Serial.begin(9600);
  pinMode(red,OUTPUT);
  pinMode(green,OUTPUT);
  pinMode(blue,OUTPUT);
  pinMode(togglePin, INPUT);
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
}
