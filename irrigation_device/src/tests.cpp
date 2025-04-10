#include "tests.h"

void ledTest(LedIndicator* indicator) {
    int wait = 3000;
    Serial.println("Wifi error: ");
    indicator->wifiError();
    delay(wait);
  
    Serial.println("Net error: ");
    indicator->netError();
    delay(wait);
  
    Serial.println("Fail safe: ");
    indicator->failSafe();
    delay(wait);
  
    Serial.println("Setup: ");
    indicator->setup();
    delay(wait);
  
    Serial.println("Unauthorized: ");
    indicator->unauthorized();
    delay(wait);
  
    Serial.println("Success: ");
    indicator->success();
    delay(wait);
  }
  
  void sensorTest(Sensors* sensors) {
    auto moisture = sensors->readMoisture();
    float temp, humidity;
    bool m = sensors->readTempHumidity(&temp, &humidity);
    if (!m) {
      return;
    }
    Serial.println("Measured: " + String(m));
    Serial.println("Moisture: " + String(moisture));
    Serial.println("Temp: " + String(temp));
    Serial.println("Humidity: " + String(humidity));
    delay(500);
  }

  void motorTest(byte motorPin) {
    Serial.println("Motor on");
    digitalWrite(motorPin, HIGH);
    delay(5000);
    Serial.println("Motor off");
    digitalWrite(motorPin, LOW);
    delay(5000);
  }
