#include <Arduino.h>
#include "RandomNumber.h"
#include "LedIndicator.h"
#include "Storage.h"
#include "connector.h"
#include "ConfigServer.h"
#include "ApiClient.h"
#include "DayTracker.h"
#include "pump.h"
#include "Sensors.h"

byte red = 27;
byte green = 26;
byte blue = 25;
byte configPin = 13;
byte powerPin = 2;

int toggleCount = 0;
// IRReader irReader(irPin);

bool setupRunning = false;
bool configured = false;

// clock
byte sda = 21;
byte scl = 22;

LedIndicator indicator(red, green, blue);
ConfigServer* server = nullptr;

void checkConfigured()
{
  Storage::begin();
  String ssid = Storage::readValue("ssid");
  String password = Storage::readValue("password");
  String serverUrl = Storage::readValue("serverUrl");
  String identifier = Storage::readValue("identifier");
  configured = !(ssid.isEmpty() || password.isEmpty() || serverUrl.isEmpty() || identifier.isEmpty());
}

void setup()
{
  // put your setup code here, to run once:
  Serial.begin(9600);
  pinMode(red, OUTPUT);
  pinMode(green, OUTPUT);
  pinMode(blue, OUTPUT);
  pinMode(configPin, INPUT);
  pinMode(powerPin, OUTPUT);
  delay(1000);
  Serial.println("setup done....");
}

void runConfiguration()
{
  indicator.setup();

  if (setupRunning) {
    server->start();
    return;
  }
  
  server = new ConfigServer();
  configureHotspot();

  createHotspot("SmartIrrigation", "irrigation-device");

  server->setOnRestart([]()
                      { ESP.restart(); });

  setupRunning = true;
  Serial.println("Setup server running on: http://192.168.1.1");
  server->start();
}

void loop()
{
  digitalWrite(powerPin, HIGH);

  checkConfigured();

  bool buttonState = digitalRead(configPin) == HIGH;
  if (setupRunning || buttonState || !configured)
  {
    runConfiguration();
    delay(500);
    return;
  }
  Serial.println("Server Configured: " + buttonState);

  Serial.println(Storage::readValue("ssid"));
  Serial.println(Storage::readValue("password"));
  Serial.println(Storage::readValue("serverUrl"));
  Serial.println(Storage::readValue("identifier"));
  indicator.success();
  delay(500);
}
