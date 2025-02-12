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
    void success();
    void setup();
    void failSafe();
    void unauthorized();
};

#endif // LEDINDICATOR_H
