#include <Arduino.h>
#include <ESPAsyncWebServer.h>
#include "connector.h"
#include "Storage.h"

#include "ConfigServer.h"


std::vector<String> ConfigServer::networks = {};

ConfigServer::ConfigServer() : server(80) {
    networks = getAvailableNetworks();
}

void ConfigServer::start()
{
    server.on("/", HTTP_GET, [this](AsyncWebServerRequest *request)
              { this->handleRoot(request); });
    server.on("/submit", HTTP_POST, [this](AsyncWebServerRequest *request)
              { this->handleForm(request); });
    server.on("/restart", HTTP_GET, [this](AsyncWebServerRequest *request)
              { this->handleRestart(request); });

    server.begin();
}

void ConfigServer::setOnRestart(const std::function<void()> callback)
{
    callbackFunction = callback;
}

void ConfigServer::handleRoot(AsyncWebServerRequest *request)
{
    String html = R"(
    <!DOCTYPE html>
    <html>
        <head>
            <title>Smart Irrigation</title>
        </head>
        <body>
            <h1>Smart Irrigation</h1>
            <h2>Available networks:</h2>
            <ul>
    )";

    for (const auto& network : networks)
        html += "<li>" + String(network.c_str()) + "</li>";

    html += R"(
            </ul>
            <form action="/submit" method="post">
                <label for="ssid">SSID:</label><br>
                <input type="text" id="ssid" name="ssid"><br>
                <label for="password">Password:</label><br>
                <input type="password" id="password" name="password"><br>
                <label for="serverUrl">Server URL:</label><br>
                <input type="text" id="serverUrl" name="serverUrl"><br>
                <label for="identifier">Identifier:</label><br>
                <input type="text" id="identifier" name="identifier"><br>
                <input type="submit" value="Submit">
            </form>
        </body>
    </html>
    )";

    request->send(200, "text/html", html);
}

void ConfigServer::handleForm(AsyncWebServerRequest *request)
{
    String invalidHtml = "<!DOCTYPE html><html><head><title>Smart Irrigation</title></head><body><h1>Smart Irrigation</h1><p>Invalide data sent. all fields are required</p></body></html>";

    int paramsCount = request->params();
    for (int i = 0; i < paramsCount; i++) {
        const AsyncWebParameter* param = request->getParam(i);
        Serial.println(param->name() + ": " + param->value());
        Serial.println("");
    }

    bool hasSsid = request->hasParam("ssid", true);
    bool hasPassword = request->hasParam("password", true);
    bool hasServerUrl = request->hasParam("serverUrl", true);
    bool hasIdentifier = request->hasParam("identifier", true);

    bool allFieldsAvailable = hasSsid && hasPassword && hasServerUrl && hasIdentifier;
    if (!allFieldsAvailable) {
        Serial.println("Not all parameters are sent!!");
        request->send(400, "text/html", invalidHtml);
        return;
    }

    String ssid = request->getParam("ssid", true)->value();
    String password = request->getParam("password", true)->value();
    String serverUrl = request->getParam("serverUrl", true)->value();
    String identifier = request->getParam("identifier", true)->value();

    if (ssid.isEmpty() || serverUrl.isEmpty() || identifier.isEmpty())
    {
        Serial.println("Received some parameters are empty!!");
        request->send(400, "text/html", invalidHtml);
        return;
    }

    // handle the form data
    Storage storage;
    storage.writeValue("ssid", ssid);
    storage.writeValue("password", password);
    storage.writeValue("serverUrl", serverUrl);
    storage.writeValue("identifier", identifier);

    String html = "<!DOCTYPE html><html><head><title>Smart Irrigation</title></head><body><h1>Smart Irrigation</h1><p>Form submitted successfully!</p><button onclick=\"location.href='/restart'\">Restart System</button></body></html>";
    request->send(200, "text/html", html);
}

void ConfigServer::handleRestart(AsyncWebServerRequest *request)
{
    String html = "<!DOCTYPE html><html><head><title>Smart Irrigation</title></head><body><h1>Smart Irrigation</h1><p>Restarting...</p></body></html>";
    request->send(200, "text/html", html);

    if (callbackFunction)
        callbackFunction();
}


