import SystemStatistics from "../entities/SystemStatistics";
import APIClient from "./apiClient";

const systemStatService = new APIClient<SystemStatistics>("/statistics/system-water-usage");

export default systemStatService;