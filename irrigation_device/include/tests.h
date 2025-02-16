#ifndef TESTS_H
#define TESTS_H

#include <Arduino.h>

#include "Sensors.h"
#include "LedIndicator.h"

void motorTest(byte speed, byte dir1, byte dir2);
void sensorTest(Sensors* sensors);
void ledTest(LedIndicator* indicator);

#endif
