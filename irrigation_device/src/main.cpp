#include <Arduino.h>
#include "RandomNumber.h"
#include "LedIndicator.h"
#include "Storage.h"
#include "connector.h"
#include "WebServer.h"
#include "ApiClient.h"
#include "DayTracker.h"
#include "pump.h"
#include "Sensors.h"

byte red = 27;
byte green = 26;
byte blue = 25;
byte togglePin = 13;

int toggleCount = 0;

bool setupRunning = false;
bool configured = false;

// clock
byte sda = 21;
byte scl = 22;

void  checkConfigured() {
    Storage::begin();
    String ssid = Storage::readValue("ssid");
    String password = Storage::readValue("password");
    String serverUrl = Storage::readValue("serverUrl");
    String identifier = Storage::readValue("identifier");
    configured = !ssid.isEmpty() && !password.isEmpty() && !serverUrl.isEmpty() && !identifier.isEmpty();
}

void setup() {
  // put your setup code here, to run once: 
  Serial.begin(9600);
  pinMode(red,OUTPUT);
  pinMode(green,OUTPUT);
  pinMode(blue,OUTPUT);
  pinMode(togglePin, INPUT);

  checkConfigured();
}

void loop() {
  int buttonState = digitalRead(togglePin);

  // if (buttonState == HIGH) {
  //   setupRunning = true;
  //   Serial.println("Setup running: " + String(setupRunning));
  //   return;
  // }
  // if (setupRunning && buttonState == LOW) {
  //   setupRunning = false;
  //   Serial.println("Setup closed: " + String(setupRunning));
  //   return;
  // }

  if (buttonState == HIGH || !configured) {
    toggleCount++;
    Serial.println("Toggle count: " + String(toggleCount));
    delay(500);
    return;
  }
  Serial.println("Button state: " + String(buttonState));
  delay(500);
}
