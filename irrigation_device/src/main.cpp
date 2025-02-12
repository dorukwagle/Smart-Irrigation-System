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
#include "Controller.h"

byte red = 27;
byte green = 26;
byte blue = 25;
byte configPin = 13;
byte moisturePowerPin = 33;

byte powerPin = 2;
byte dhtPin = 4;
byte moisturePin = 5;

//motor
byte speed = 14;
byte dir1 = 15;
byte dir2 = 16;

int toggleCount = 0;
// IRReader irReader(irPin);

bool setupRunning = false;
bool configured = false;

LedIndicator indicator(red, green, blue);
ConfigServer* server = nullptr;
Controller* controller = nullptr;
Sensors sensors(dhtPin, moisturePowerPin, moisturePin);


void checkConfigured()
{
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

  Storage::begin();
  controller = new Controller(&indicator, &sensors, speed, dir1, dir2);

  delay(1000);

  Serial.println("setup done....");
}

void runConfiguration()
{
  indicator.setup();

  if (setupRunning) {
    delay(200);
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

bool connectWifi()
{
  if (isConnected())
    return true;

  String ssid = Storage::readValue("ssid");
  String password = Storage::readValue("password");
  return connectToNetwork(ssid.c_str(), password.c_str());
}


void ledTest() {
  int wait = 3000;
  Serial.println("Wifi error: ");
  indicator.wifiError();
  delay(wait);

  Serial.println("Net error: ");
  indicator.netError();
  delay(wait);

  Serial.println("Fail safe: ");
  indicator.failSafe();
  delay(wait);

  Serial.println("Setup: ");
  indicator.setup();
  delay(wait);

  Serial.println("Unauthorized: ");
  indicator.unauthorized();
  delay(wait);

  Serial.println("Success: ");
  indicator.success();
  delay(wait);
}

void loop()
{
  ledTest();
  return;
  digitalWrite(powerPin, HIGH);
  checkConfigured();

  bool buttonState = digitalRead(configPin) == HIGH;
  if (setupRunning || buttonState || !configured)
  {
    runConfiguration();
    delay(500);
    return;
  }

  if (!connectWifi())
    indicator.wifiError();

// run the main program controller
  controller->run();

  Serial.println("Server Configured: " + buttonState);

  // Serial.println(Storage::readValue("ssid"));
  // Serial.println(Storage::readValue("password"));
  // Serial.println(Storage::readValue("serverUrl"));
  // Serial.println(Storage::readValue("identifier"));
  // indicator.success();
  delay(500);
}
