#ifndef CONNECTOR_H
#define CONNECTOR_H

#include <WiFi.h>
#include <vector>
#include <string>
#include <Arduino.h>

bool configureHotspot();
bool createHotspot(const char *ssid, const char *password);
bool connectToNetwork(char *ssid, char *password);
std::vector<String> getAvailableNetworks();
bool isConnected();
void displayHotspotInfo();

#endif // CONNECTOR_H
