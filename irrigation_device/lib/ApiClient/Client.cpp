#include <Arduino.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <map>

class Client {
 public:
  Client(const std::string& baseApi, const std::string& identifier)
      : baseApi_(baseApi), identifier_(identifier) {}

  std::string post(const map<std::string, std::string>& data) {
    HTTPClient http;
    http.begin(baseApi_ + "/api/irrigation");
    http.addHeader("Content-Type", "application/json");
    http.addHeader("X-Identifier", identifier_.c_str());

    DynamicJsonDocument jsonDoc(2048);
    for (const auto& pair : data) {
      jsonDoc[pair.first] = pair.second;
    }

    String requestBody;
    jsonDoc.printTo(requestBody);
    int httpCode = http.POST(requestBody);
    if (httpCode > 0) {
      return http.getString();
    } else {
      return "Error on HTTP request";
    }
  }

  std::string get(const std::string& endpoint) {
    HTTPClient http;
    http.begin(baseApi_ + endpoint);
    http.addHeader("X-Identifier", identifier_.c_str());

    int httpCode = http.GET();
    if (httpCode > 0) {
      return http.getString();
    } else {
      return "Error on HTTP request";
    }
  }

 private:
  std::string baseApi_;
  std::string identifier_;
};
