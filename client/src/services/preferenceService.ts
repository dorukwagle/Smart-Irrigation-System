import Preference from "../entities/Preference";
import APIClient from "./apiClient";

const preferenceService = new APIClient<Preference, Preference>("/preferences");

export default preferenceService;