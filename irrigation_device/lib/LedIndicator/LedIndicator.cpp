#include <Arduino.h>

class LedIndicator {
  private:
    byte redPin;
    byte greenPin;
    byte bluePin;

  public:
    LedIndicator(byte red, byte green, byte blue) {
      redPin = red;
      greenPin = green;
      bluePin = blue;
    }

    void wifiError() {
      analogWrite(redPin, 200);
    }

    void netError() {
      analogWrite(redPin, 200);
      analogWrite(greenPin, 128);
    }

    void errResponse() {
      analogWrite(redPin, 200);
    }

    void success() {
      analogWrite(greenPin, 200);
    }
};
