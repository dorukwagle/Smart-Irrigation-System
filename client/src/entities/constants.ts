const BASE_URL = "http://localhost:8080/api";
const USER_CACHE_KEY = ["user"];
const TODOS_CACHE_KEY = ["todos"];
const SYSTEMS_CACHE_KEY= ["systems"];
const NET_ERR_KEY = ["net_err"];
const SYSTEM_INFO_KEY = ["system_info"];
const SESSION_CACHE_KEY = ["session"];
const SESSION_INFO_CACHE_KEY = ["session_info"];
const CROP_TYPES_CACHE_KEY = ["crop_types"];
const PREFERENCES_CACHE_KEY = ["preferences"];
const LIVE_STATUS_CACHE_KEY = ["live_status"];
const SYSTEM_STATISTICS_CACHE_KEY = ["system_statistics"];
const SESSION_STATISTICS_CACHE_KEY = ["session_statistics"];

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

export {
    USER_CACHE_KEY,
    TODOS_CACHE_KEY,
    BASE_URL,
    NET_ERR_KEY,
    SYSTEMS_CACHE_KEY,
    SESSION_CACHE_KEY,
    SESSION_INFO_CACHE_KEY,
    CROP_TYPES_CACHE_KEY,
    PREFERENCES_CACHE_KEY,
    LIVE_STATUS_CACHE_KEY,
    SYSTEM_STATISTICS_CACHE_KEY,
    SESSION_STATISTICS_CACHE_KEY,
    SYSTEM_INFO_KEY,
    HOUR,
    DAY
}