#ifndef STORAGE_H
#define STORAGE_H

#include <Arduino.h>

class Storage {
public:
  static String readValue(const char* key);
  static void writeValue(const char* key, const String& value);
  static void end();
};

#endif // STORAGE_H
