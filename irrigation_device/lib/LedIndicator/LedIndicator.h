#ifndef LEDINDICATOR_H
#define LEDINDICATOR_H

#include <Arduino.h>

class LedIndicator {
  private:
    byte redPin;
    byte greenPin;
    byte bluePin;
  public:
    LedIndicator(byte red, byte green, byte blue);
    void wifiError();
    void netError();
    void errResponse();
    void success();
    void setup();
};

#endif // LEDINDICATOR_H
