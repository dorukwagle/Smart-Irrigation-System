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

    static void end() {
      preferences.end();
    }
};

