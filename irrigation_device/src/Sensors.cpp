#include <Arduino.h>
#include "dht_nonblocking.h"

#define DHT_SENSOR_TYPE DHT_TYPE_11

class Sensors
{
private:
    byte dhtPin;
    byte powerPin;
    byte moisturePin;
    DHT_nonblocking dht_sensor;

public:
    Sensors(byte dhtPin, byte powerPin, byte moisturePin) : 
        dhtPin(dhtPin), powerPin(powerPin), 
        moisturePin(moisturePin), 
        dht_sensor(dhtPin, DHT_SENSOR_TYPE) {}

    bool readTempHumidity(float *temp, float *humidity)
    {
        return dht_sensor.measure(temp, humidity);
    }

    int readMoisture()
    {
        digitalWrite(powerPin, HIGH);
        delay(10);
        int val = analogRead(moisturePin);
        digitalWrite(powerPin, LOW);
        return val;
    }
};
