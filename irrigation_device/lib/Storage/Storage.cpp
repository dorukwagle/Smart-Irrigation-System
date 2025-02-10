#include <Preferences.h>
#include <Arduino.h>
#include "Storage.h"

Preferences Storage::preferences;

void Storage::begin() {
  preferences.begin("config", false);
}

String Storage::readValue(const char* key) {
  if (!preferences.isKey(key))
    return "";
  return preferences.getString(key, "");
}

void Storage::writeValue(const char* key, const String& value) {
  preferences.putString(key, value);
}

int Storage::readInt(const char* key) {
  if (!preferences.isKey(key))
    return 0;
  return preferences.getInt(key, 0);
}

void Storage::writeInt(const char* key, int value) {
  preferences.putInt(key, value);
}

uint32_t Storage::readUInt(const char* key) {
  if (!preferences.isKey(key))
    return 0;
  return preferences.getUInt(key, 0);
}

void Storage::writeUInt(const char* key, uint32_t value) {
  preferences.putUInt(key, value);
}

void Storage::end() {
  preferences.end();
}

