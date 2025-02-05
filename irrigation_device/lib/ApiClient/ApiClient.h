#ifndef CLIENT_H
#define CLIENT_H

#include <string>
#include <map>

class ApiClient {
public:
    ApiClient(const std::string& baseApi, const std::string& identifier);
    bool updateCropDays();
    int predictIrrigation(const std::map<std::string, std::string>& data);
    bool updateLiveStatus(const std::map<std::string, std::string>& data);

private:
    std::string sendPutRequest(const std::string& endpoint);
    std::string sendPostRequest(const std::string& endpoint, const std::map<std::string, std::string>& data);
    
    std::string baseApi_;
    std::string identifier_;
};

#endif // CLIENT_H

