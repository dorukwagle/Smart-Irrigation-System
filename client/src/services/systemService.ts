import QueryParams from "../entities/QueryParams";
import System from "../entities/System";
import SystemPagination from "../entities/SystemPagination";
import APIClient from "./apiClient";

const systemService = new APIClient<SystemPagination | System[], System, QueryParams>("/systems");

export default systemService;