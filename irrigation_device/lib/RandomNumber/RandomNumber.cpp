#include <Arduino.h>

byte generateRandom() {
  randomSeed(analogRead(32));
  return random(1, 4);
}