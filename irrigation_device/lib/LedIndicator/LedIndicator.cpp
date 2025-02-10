#include <Arduino.h>
#include "LedIndicator.h"

#include "LedIndicator.h"

LedIndicator::LedIndicator(byte red, byte green, byte blue) {
  redPin = red;
  greenPin = green;
  bluePin = blue;
}

void LedIndicator::wifiError() {
  analogWrite(greenPin, 0);
  analogWrite(bluePin, 0);
  analogWrite(redPin, 200);
}

void LedIndicator::netError() {
  analogWrite(bluePin, 0);
  analogWrite(redPin, 200);
  analogWrite(greenPin, 128);
}

void LedIndicator::errResponse() {
  analogWrite(bluePin, 0);
  analogWrite(greenPin, 0);
  analogWrite(redPin, 200);
}

void LedIndicator::setup() {
  analogWrite(redPin, 200);
  analogWrite(greenPin, 200);
  analogWrite(bluePin, 0);
}

void LedIndicator::success() {
  analogWrite(greenPin, 200);
  analogWrite(redPin, 0);
  analogWrite(bluePin, 0);
}

