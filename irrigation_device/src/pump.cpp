#include <Arduino.h>

void startPump(byte speed, byte dir1, byte dir2) {
    analogWrite(speed, 250);
    digitalWrite(dir1, HIGH);
    digitalWrite(dir2, LOW);
}

void stopPump(byte speed, byte dir1, byte dir2) {
    analogWrite(speed, 0);
    digitalWrite(dir1, LOW);
    digitalWrite(dir2, LOW);
}