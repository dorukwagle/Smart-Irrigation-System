#ifndef CONNECTOR_H
#define CONNECTOR_H

#include <WiFi.h>
#include <vector>
#include <string>

bool configureHotspot();
bool createHotspot(char *ssid, char *password);
bool connectToNetwork(char *ssid, char *password);
std::vector<std::string> getAvailableNetworks();
bool isConnected();

#endif // CONNECTOR_H
