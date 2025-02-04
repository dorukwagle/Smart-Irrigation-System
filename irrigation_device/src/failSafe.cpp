#include <Arduino.h>


const int max_a = 600;
const int max_b = 800;
const int min_a = 550;

bool failSafeIrrigate(int moisture, bool isWatering) {
    if (!isWatering && moisture > max_a && moisture < max_b) {
        return true;
    }
    if (!isWatering && moisture > min_a) {
        return false;
    }   
    if (isWatering && moisture > min_a)
        return true;

    return false;
}