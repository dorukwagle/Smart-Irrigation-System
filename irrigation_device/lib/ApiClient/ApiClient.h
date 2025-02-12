#ifndef CLIENT_H
#define CLIENT_H

#include <string>
#include <map>

class ApiClient {
public:
    ApiClient(const std::string& baseApi, const std::string& identifier);
    int predictIrrigation(const std::map<std::string, std::string>& data);
    int updateLiveStatus(const std::map<std::string, std::string>& data);

private:
    int sendPutRequest(const std::string& endpoint, String& res);
    int sendPostRequest(const std::string& endpoint, const std::map<std::string, std::string>& data, String& res);
    
    std::string baseApi_;
    std::string identifier_;
};

#endif // CLIENT_H

