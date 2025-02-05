#include <Arduino.h>
#include <ESPAsyncWebServer.h>
#include "connector.h"
#include "Storage.h"
#include "WebServer.h"

#include "WebServer.h"

WebServer::WebServer() : server(80) {}

void WebServer::start()
{
    server.on("/", HTTP_GET, [this](AsyncWebServerRequest *request)
              { this->handleRoot(request); });
    server.on("/submit", HTTP_POST, [this](AsyncWebServerRequest *request)
              { this->handleForm(request); });
    server.on("/restart", HTTP_GET, [this](AsyncWebServerRequest *request)
              { this->handleRestart(request); });

    server.begin();
}

void WebServer::setOnRestart(std::function<void()> callback)
{
    callbackFunction = callback;
}

void WebServer::handleRoot(AsyncWebServerRequest *request)
{
    std::vector<std::string> networks = getAvailableNetworks();

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
    networks.clear();

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

void WebServer::handleForm(AsyncWebServerRequest *request)
{
    if (!(request->hasParam("ssid") && request->hasParam("password") && request->hasParam("serverUrl") && request->hasParam("identifier")))
    {
        String html = "<!DOCTYPE html><html><head><title>Smart Irrigation</title></head><body><h1>Smart Irrigation</h1><p>Invalide data sent. all fields are required</p></body></html>";
        request->send(400, "text/html", html);
        return;
    }

    String ssid = request->getParam("ssid")->value();
    String password = request->getParam("password")->value();
    String serverUrl = request->getParam("serverUrl")->value();
    String identifier = request->getParam("identifier")->value();

    // handle the form data
    Storage storage;
    storage.writeValue("ssid", ssid);
    storage.writeValue("password", password);
    storage.writeValue("serverUrl", serverUrl);
    storage.writeValue("identifier", identifier);

    Serial.println("SSID: " + ssid + ", Password: " + password + ", Server URL: " + serverUrl + ", Identifier: " + identifier);

    String html = "<!DOCTYPE html><html><head><title>Smart Irrigation</title></head><body><h1>Smart Irrigation</h1><p>Form submitted successfully!</p><button onclick=\"location.href='/restart'\">Restart System</button></body></html>";
    request->send(200, "text/html", html);
}

void WebServer::handleRestart(AsyncWebServerRequest *request)
{
    String html = "<!DOCTYPE html><html><head><title>Smart Irrigation</title></head><body><h1>Smart Irrigation</h1><p>Restarting...</p></body></html>";
    request->send(200, "text/html", html);

    if (callbackFunction)
        callbackFunction();
}


