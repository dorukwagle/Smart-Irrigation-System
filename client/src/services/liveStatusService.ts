import LiveStatus from "../entities/LiveStatus";
import APIClient from "./apiClient";


const liveStatusService = new APIClient<LiveStatus>("/live-status");

export default liveStatusService;