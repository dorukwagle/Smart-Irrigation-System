#include<Wire.h>
#include "DS3231.h"
#include "Storage.h"
#include "DayTracker.h"

#include "DayTracker.h"

DayTracker::DayTracker() {
    clock.begin();
    setupDateTime();
}

void DayTracker::setupDateTime() {
    // Manual (YYYY, MM, DD, HH, II, SS
    // clock.setDateTime(2016, 12, 9, 11, 46, 00);
    int year = Storage::readInt("year");
    int month = Storage::readInt("month");
    int day = Storage::readInt("day");
    int hour = Storage::readInt("hour");
    int minute = Storage::readInt("minute");
    int second = Storage::readInt("second");

    if (year == 0 || month == 0 || day == 0) {
        clock.setDateTime(__DATE__, __TIME__);
        auto dt = clock.getDateTime();

        // also save the data
        updateStorage();
        return;
    }

    clock.setDateTime(year, month, day, hour, minute, second);
}

void DayTracker::updateStorage() {
    auto dt = clock.getDateTime();
    Storage::writeInt("year", dt.year);
    Storage::writeInt("month", dt.month);
    Storage::writeInt("day", dt.day);
    Storage::writeInt("hour", dt.hour);
    Storage::writeInt("minute", dt.minute);
    Storage::writeInt("second", dt.second);
    Storage::writeUInt("lastTimestamp", dt.unixtime);
}

bool DayTracker::isNextDay() {
    auto today = clock.getDateTime();
    auto stamp = today.unixtime;        

    u_int32_t lastTimestamp = Storage::readUInt("lastTimestamp");
    u_int32_t oneDayAfter = 24 * 60 * 60 + lastTimestamp;

    if (stamp >= oneDayAfter) {
        Storage::writeInt("lastTimestamp", stamp);
        updateStorage();
        return true;
    }

    return false;
}
