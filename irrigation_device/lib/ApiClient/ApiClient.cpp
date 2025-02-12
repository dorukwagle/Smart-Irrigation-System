#include <Arduino.h>
#include <HTTPClient.h>
#include <Arduino_JSON.h>
#include <map>
#include "ApiClient.h"

ApiClient::ApiClient(const std::string& baseApi, const std::string& identifier) : baseApi_(baseApi), identifier_(identifier) {}

int ApiClient::sendPostRequest(const std::string& endpoint, const std::map<std::string, std::string>& data, String& res) {
    HTTPClient http;
    std::string url = baseApi_ + "/intercom" + endpoint + "?identifier=" + identifier_;
    http.begin(url.c_str());
    // Serial.print("baseUrl: "); Serial.println(baseApi_.c_str());
    // Serial.println(url.c_str());
    Serial.print("Sending request to: "); Serial.println(url.c_str());
    
    http.addHeader("Content-Type", "application/json");

    JSONVar jsonDoc;
    for (const auto& pair : data) {
        jsonDoc[pair.first.c_str()] = pair.second.c_str();
    }

    String requestBody = JSON.stringify(jsonDoc);
    int httpCode = http.POST(requestBody);
    if (httpCode > 0) 
        res = http.getString().c_str();
    else 
        res = "Error on HTTP request";

    return httpCode;
}

int ApiClient::sendPutRequest(const std::string& endpoint, String& res) {
    HTTPClient http;
    std::string url = baseApi_ + endpoint + "?identifier=" + identifier_;
    http.begin(url.c_str());
    http.addHeader("Content-Type", "application/json");
    
    int httpCode = http.PUT("");  // No body needed
    if (httpCode > 0) 
        res = http.getString().c_str();
    else 
        res = "Error on HTTP request";

    return httpCode;
}

int ApiClient::predictIrrigation(const std::map<std::string, std::string>& data) {
    String response;
    int code = sendPostRequest("/system/irrigation", data, response);
    JSONVar jsonDoc = JSON.parse(response.c_str());

    if (code != 200) 
        return code;
    
    if (JSON.typeof(jsonDoc) == "undefined" || !jsonDoc.hasOwnProperty("irrigate")) {
        return -2;  // Error case
    }

    return int(jsonDoc["irrigate"]);
}

int ApiClient::updateLiveStatus(const std::map<std::string, std::string>& data) {
    String response;
    int code = sendPostRequest("/system/live", data, response);
    JSONVar jsonDoc = JSON.parse(response.c_str());

    if (code != 200) 
        return code;

    if (JSON.typeof(jsonDoc) == "undefined" || !jsonDoc.hasOwnProperty("status")) 
        return -2;

    return String((const char*)jsonDoc["status"]) == "success";
}

