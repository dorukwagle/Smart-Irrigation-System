#include <Arduino.h>
#include <HTTPClient.h>
#include <Arduino_JSON.h>
#include <map>
#include "ApiClient.h"

ApiClient::ApiClient(const std::string& baseApi, const std::string& identifier) : baseApi_(baseApi), identifier_(identifier) {}

std::string ApiClient::sendPostRequest(const std::string& endpoint, const std::map<std::string, std::string>& data) {
    HTTPClient http;
    std::string url = baseApi_ + endpoint + "?identifier=" + identifier_;
    http.begin(url.c_str());
    http.addHeader("Content-Type", "application/json");

    JSONVar jsonDoc;
    for (const auto& pair : data) {
        jsonDoc[pair.first.c_str()] = pair.second.c_str();
    }

    String requestBody = JSON.stringify(jsonDoc);
    int httpCode = http.POST(requestBody);
    if (httpCode > 0) {
        return http.getString().c_str();
    } else {
        return "Error on HTTP request";
    }
}

std::string ApiClient::sendPutRequest(const std::string& endpoint) {
    HTTPClient http;
    std::string url = baseApi_ + endpoint + "?identifier=" + identifier_;
    http.begin(url.c_str());
    http.addHeader("Content-Type", "application/json");

    int httpCode = http.PUT("");  // No body needed
    if (httpCode > 0) {
        return http.getString().c_str();
    } else {
        return "Error on HTTP request";
    }
}

int ApiClient::predictIrrigation(const std::map<std::string, std::string>& data) {
    std::string response = sendPostRequest("/system/irrigation", data);
    JSONVar jsonDoc = JSON.parse(response.c_str());

    if (JSON.typeof(jsonDoc) == "undefined" || !jsonDoc.hasOwnProperty("irrigate")) {
        return -1;  // Error case
    }
    return int(jsonDoc["irrigate"]);
}

bool ApiClient::updateLiveStatus(const std::map<std::string, std::string>& data) {
    std::string response = sendPostRequest("/system/live", data);
    JSONVar jsonDoc = JSON.parse(response.c_str());

    if (JSON.typeof(jsonDoc) == "undefined" || !jsonDoc.hasOwnProperty("success")) {
        return false;
    }
    return bool(jsonDoc["success"]);
}

bool ApiClient::updateCropDays() {
    std::string response = sendPutRequest("/increase-crop-days");
    return response == "success";
}

