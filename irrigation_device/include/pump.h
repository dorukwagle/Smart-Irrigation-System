#ifndef PUMP_H
#define PUMP_H

#include <Arduino.h>

void startPump(byte speed, byte dir1, byte dir2);
void stopPump(byte speed, byte dir1, byte dir2);

#endif // PUMP_H

