#include "Controller.h"
#include "Storage.h"
#include "failSafe.h"
#include "connector.h"
#include "pump.h"


Controller::Controller(LedIndicator *ledIndicator, Sensors *sensors, byte speed, byte dir1, byte dir2) : 
    ledIndicator_(ledIndicator),
    sensors_(sensors), client_(nullptr),
    motorSpeed(speed),
    dir1(dir1),
    dir2(dir2)
{
    auto baseApi = Storage::readValue("serverUrl");
    auto identifier = Storage::readValue("identifier");
    Serial.println("Base API: " + baseApi);
    Serial.println("Identifier: " + identifier);
    client_ = new ApiClient(baseApi.c_str(), identifier.c_str());

    last_status_update = millis();
}

void Controller::indicateResponse(int res)
{
    if (res == -1)
    {
        Serial.println("Server connection error.");
        ledIndicator_->netError();
    }
    else if (res == -2)
        Serial.println("Invalid data received from server.");
    else if (res == 401)
    {
        Serial.println("Unauthorized access.");
        ledIndicator_->unauthorized();
    }
    else
        Serial.println(res);
}

void Controller::getSensorValues(std::map<std::string, std::string> &data)
{
    auto moisture = sensors_->readMoisture();
    float temp, humidity;

    // while (!sensors_->readTempHumidity(&temp, &humidity))
    // {
    //     Serial.println("Failed to read temp and humidity.");
    //     delay(500);
    // }
    // dummy
    temp = 25.34;
    humidity = 50.564;
    moisture = 455;

    data["moisture"] = String(static_cast<int>(moisture)).c_str();
    data["temperature"] = String(static_cast<int>(temp)).c_str();
    data["humidity"] = String(static_cast<int>(humidity)).c_str();
    data["irrigationStatus"] = irrigating ? "ON" : "OFF";
}

void Controller::updateLiveStatus()
{
    int res = -4;

    // Read the sensor values
    std::map<std::string, std::string> data;
    getSensorValues(data);

    res = client_->updateLiveStatus(data);
    indicateResponse(res);
}

bool Controller::shouldIrrigate()
{
    int res = -4; // any invalid number

    // Read the sensor values
    std::map<std::string, std::string> data;
    getSensorValues(data);

    res = isConnected() ? client_->predictIrrigation(data) : -4;
    indicateResponse(res);

    // switch to failsafe mode if server unavailable
    if (res != 0 && res != 1)
    {
        delay(1000);
        ledIndicator_->failSafe();
        res = failSafeIrrigate(sensors_->readMoisture(), irrigating);
    }
    else
        ledIndicator_->success();

    return res == 1;
}

void Controller::controllIrrigation()
{
    // Implementation of the irrigation mode
    auto res = shouldIrrigate();

    if (res == 0) {
        stopPump(motorSpeed, dir1, dir2);
        irrigating = false;
        return;
    }

    startPump(motorSpeed, dir1, dir2);
    irrigating = true;
}

void Controller::run()
{
    // update live status in regular interval
    if (((millis() - last_status_update) >= live_status_delay) && isConnected())
    {
        updateLiveStatus();
        last_status_update = millis();
    }

    // Implementation of the run method
    delay(irrigating ? irrigate_api_call_delay : api_call_delay);

    delay(api_call_delay);
    controllIrrigation();
}
