#ifndef DAYTRACKER_H
#define DAYTRACKER_H

#include <DS3231.h>

class DayTracker
{
public:
    DayTracker();
    bool isNextDay();

private:
    DS3231 clock;
    void setupDateTime();
    void updateStorage();
};

#endif // DAYTRACKER_H
