#include <Arduino.h>
#include <Preferences.h>

class Storage {
  private:
    static Preferences preferences;

  public:
    Storage() {
      preferences.begin("smart-irrigation", false);
    }

    static String readValue(const char* key) {
      return preferences.getString(key, "");
    }

    static void writeValue(const char* key, const String& value) {
      preferences.putString(key, value);
    }

    static int readInt(const char* key) {
      return preferences.getInt(key, 0);
    }

    static void writeInt(const char* key, int value) {
      preferences.putInt(key, value);
    }

    static uint32_t readUInt(const char* key) {
      return preferences.getUInt(key, 0);
    }

    static void writeUInt(const char* key, uint32_t value) {
      preferences.putUInt(key, value);
    }

    static void end() {
      preferences.end();
    }
};

