#ifndef WEBSERVER_H
#define WEBSERVER_H

#include <Arduino.h>
#include <ESPAsyncWebServer.h>
#include <functional>
#include "Storage.h"

class WebServer {
public:
    WebServer(); // Constructor
    void start(); // Start the server
    void setOnRestart(std::function<void()> callback); // Set a callback for restart

private:
    AsyncWebServer server; // The async web server instance
    std::function<void()> callbackFunction; // Callback function for restarting

    // Route handlers
    void handleRoot(AsyncWebServerRequest *request);
    void handleForm(AsyncWebServerRequest *request);
    void handleRestart(AsyncWebServerRequest *request);
};

#endif // WEBSERVER_H
