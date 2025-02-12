#include <Arduino.h>
#include "LedIndicator.h"

#include "LedIndicator.h"

LedIndicator::LedIndicator(byte red, byte green, byte blue) {
  redPin = red;
  greenPin = green;
  bluePin = blue;
}

// red color
void LedIndicator::wifiError() {
  analogWrite(greenPin, 0);
  analogWrite(bluePin, 0);
  analogWrite(redPin, 200);
}

// magenta color
void LedIndicator::netError() {
  analogWrite(redPin, 255);
  analogWrite(greenPin, 0);
  analogWrite(bluePin, 255);
}

// cyan color
void LedIndicator::failSafe() {
  analogWrite(redPin, 0);
  analogWrite(greenPin, 255);
  analogWrite(bluePin, 255);
}

// yellow color
void LedIndicator::unauthorized() {
  analogWrite(redPin, 255);
  analogWrite(greenPin, 255);
  analogWrite(bluePin, 0);
}

// blue
void LedIndicator::setup() {
  analogWrite(redPin, 0);
  analogWrite(greenPin, 0);
  analogWrite(bluePin, 255);
}

// green color
void LedIndicator::success() {
  analogWrite(greenPin, 200);
  analogWrite(redPin, 0);
  analogWrite(bluePin, 0);
}

