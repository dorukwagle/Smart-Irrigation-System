import SessionStatistics from "../entities/SessionStatistics";
import APIClient from "./apiClient";


const sessionStatService = new APIClient<SessionStatistics>("/statistics/session-water-usage");

export default sessionStatService;