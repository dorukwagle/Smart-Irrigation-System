#ifndef CONFIGSERVER_H
#define CONFIGSERVER_H

#include <Arduino.h>
#include <ESPAsyncWebServer.h>
#include <functional>
#include "Storage.h"


class ConfigServer {
public:
    ConfigServer(); // Constructor
    void start(); // Start the server
    void setOnRestart(std::function<void()> callback); // Set a callback for restart

private:
    AsyncWebServer server; // The async web server instance
    std::function<void()> callbackFunction; // Callback function for restarting
    static std::vector<String> networks;

    // Route handlers
    void handleRoot(AsyncWebServerRequest *request);
    void handleForm(AsyncWebServerRequest *request);
    void handleRestart(AsyncWebServerRequest *request);
};

#endif 
