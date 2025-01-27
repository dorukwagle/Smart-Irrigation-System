#include <WiFi.h>
#include <vector>

// Static IP configuration
IPAddress local_ip(192, 168, 1, 1); // Set your desired IP address
IPAddress gateway(192, 168, 1, 1);  // Gateway (usually the same as the local IP for AP mode)
IPAddress subnet(255, 255, 255, 0); // Subnet mask

bool configureHotspot()
{
    if (WiFi.softAPConfig(local_ip, gateway, subnet))
        return true;

    Serial.println("Failed to configure static IP!");
    return false;
}

bool createHotspot(char *ssid, char *password)
{

    // Start the Access Point
    if (WiFi.softAP(ssid, password))
    {
        Serial.println("Wi-Fi Hotspot Created! SSID: " + String(ssid) + ", Password: " +
                       String(password) + ", Static IP Address: " + WiFi.softAPIP().toString());
        return true;
    }

    Serial.println("Failed to start the Access Point!");
    return false;
}

std::vector<String> getAvailableNetworks()
{
    // Start Wi-fi in STA (Station) mode
    WiFi.mode(WIFI_STA);
    WiFi.disconnect(); // Disconnect from any previously connected network
    delay(100);

    // Scan for networks
    int networkCount = WiFi.scanNetworks();

    if (networkCount == 0)
        return {};

    std::vector<String> networks(networkCount);
    for (int i = 0; i < networkCount; i++)
        // Print network details
        networks[i] = WiFi.SSID(i); // Network name (SSID)

    // Clear the results from memory
    WiFi.scanDelete();

    return networks;
}

bool connectToNetwork(char *ssid, char *password)
{
    int maxTries = 3;

    // Start Wi-fi in STA (Station) mode
    WiFi.mode(WIFI_STA);
    WiFi.disconnect(); // Disconnect from any previously connected network
    delay(100);

    // Connect to the network
    WiFi.begin(ssid, password);

    Serial.println("Connecting to Wi-Fi...");
    int retries = 0;

    while (WiFi.status() != WL_CONNECTED && retries < maxTries)
    {
        delay(1000);
        Serial.print(".");
        retries++;
    }

    if (WiFi.status() != WL_CONNECTED)
    {
        Serial.println("Failed to connect to the network!");
        return false;
    }

    Serial.println(WiFi.localIP());
    return true;
}

bool isConnected()
{
    if (WiFi.status() == WL_CONNECTED)
        return true;
    return false;
}