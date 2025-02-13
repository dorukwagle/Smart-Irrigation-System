#ifndef CONTROLLER_H
#define CONTROLLER_H

#include "LedIndicator.h"
#include "Sensors.h"
#include "ApiClient.h"

class Controller {
public:
    Controller(LedIndicator* ledIndicator, Sensors* sensors, byte motorSpeed, byte dir1, byte dir2);
    void run();

private:
    LedIndicator* ledIndicator_;
    Sensors* sensors_;
    ApiClient* client_;
    u_int16_t last_status_update = 0;
    u_int16_t live_status_delay = 5000;
    u_int16_t api_call_delay = 5000;
    u_int16_t irrigate_api_call_delay = 5000;
    bool irrigating = false;
    byte motorSpeed;
    byte dir1;
    byte dir2;

    void controllIrrigation();
    bool shouldIrrigate();
    void getSensorValues(std::map<std::string, std::string>& data);
    void updateLiveStatus();
    void indicateResponse(int res);
};

#endif // CONTROLLER_H

