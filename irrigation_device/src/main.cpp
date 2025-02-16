#include <Arduino.h>
#include "LedIndicator.h"
#include "Storage.h"
#include "connector.h"
#include "ConfigServer.h"
#include "ApiClient.h"
#include "Sensors.h"
#include "Controller.h"
#include "tests.h"

byte red = 27;
byte green = 26;
byte blue = 25;
byte configPin = 13;
byte moisturePowerPin = 23;

byte dhtPin = 4;
byte moisturePin = 34;

//motor
byte motor = 14;

bool setupRunning = false;
bool configured = false;

LedIndicator indicator(red, green, blue);
ConfigServer* server = nullptr;
Controller* controller = nullptr;
Sensors sensors(dhtPin, moisturePowerPin, moisturePin);

void checkConfigured()
{
  String ssid = Storage::readValue("ssid");
  String serverUrl = Storage::readValue("serverUrl");
  String identifier = Storage::readValue("identifier");
  configured = !(ssid.isEmpty() || serverUrl.isEmpty() || identifier.isEmpty());
}

void setup()
{
  // put your setup code here, to run once:
  Serial.begin(9600);
  pinMode(red, OUTPUT);
  pinMode(green, OUTPUT);
  pinMode(blue, OUTPUT);

  pinMode(moisturePowerPin, OUTPUT);
  pinMode(motor, OUTPUT);

  pinMode(configPin, INPUT); // Use internal pull-up resistor

  Storage::begin();
  controller = new Controller(&indicator, &sensors, motor);

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


void loop()
{
  // ledTest(&indicator);
  // return;

  // sensorTest(&sensors);
  // return;

  checkConfigured();
  bool togglePressed = digitalRead(configPin) == HIGH;
  if (setupRunning || togglePressed || !configured)
  {
    runConfiguration();
    delay(500);
    return;
  }

  if (!connectWifi())
    indicator.wifiError();

// run the main program controller
  controller->run();

  // Serial.println("Server Configured: " + buttonState);

  // Serial.println(Storage::readValue("ssid"));
  // Serial.println(Storage::readValue("password"));
  // Serial.println(Storage::readValue("serverUrl"));
  // Serial.println(Storage::readValue("identifier"));
  // indicator.success();
  delay(500);
}
