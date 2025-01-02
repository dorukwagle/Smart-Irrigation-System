import WaterUsageGraph from "../entities/WaterUsageGraph";
import APIClient from "./apiClient";

const waterUsageService = new APIClient<WaterUsageGraph>("/statistics/session-water-usage-graph");

export default waterUsageService;