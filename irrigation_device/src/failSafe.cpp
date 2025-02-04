#include <Arduino.h>

const int MAX_SOIL_MOISTURE[2] = {600, 800};
const int MIN_SOIL_MOISTURE = 500;

const int max_a = 600;
const int max_b = 800;
const int min = 550;

bool failSafeIrrigate(int moisture, bool isWatering) {
    if (!isWatering && moisture > max_a && moisture < max_b) {
        return true;
    }
    if (!isWatering && moisture > min) {
        return false;
    }   
    if (isWatering && moisture > min)
        return true;

    return false;
}