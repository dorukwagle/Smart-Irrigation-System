#include <Arduino.h>
#include "LedIndicator.h"

#include "LedIndicator.h"

LedIndicator::LedIndicator(byte red, byte green, byte blue) {
  redPin = red;
  greenPin = green;
  bluePin = blue;
}

void LedIndicator::wifiError() {
  analogWrite(redPin, 200);
}

void LedIndicator::netError() {
  analogWrite(redPin, 200);
  analogWrite(greenPin, 128);
}

void LedIndicator::errResponse() {
  analogWrite(redPin, 200);
}

void LedIndicator::success() {
  analogWrite(greenPin, 200);
}

