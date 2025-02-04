#ifndef SENSORS_H
#define SENSORS_H

#include "dht_nonblocking.h"

class Sensors {
public:
    Sensors(byte dhtPin, byte powerPin, byte moisturePin);
    bool readTempHumidity(float *temp, float *humidity);
    int readMoisture();
private:
    byte dhtPin;
    byte powerPin;
    byte moisturePin;
    DHT_nonblocking dht_sensor;
};

#endif // SENSORS_H
