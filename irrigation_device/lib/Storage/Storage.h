#ifndef STORAGE_H
#define STORAGE_H

#include <Arduino.h>
#include <Preferences.h>

class Storage {
private:
  static Preferences preferences;

public:
  static void begin();
  static String readValue(const char* key);
  static void writeValue(const char* key, const String& value);
  static int readInt(const char* key);
  static void writeInt(const char* key, int value);
  static uint32_t readUInt(const char* key);
  static void writeUInt(const char* key, uint32_t value);
  static void end();
};

#endif // STORAGE_H
