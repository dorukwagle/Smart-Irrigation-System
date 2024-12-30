import CropSession from "../entities/CropSession";
import QueryParams from "../entities/QueryParams";
import SessionPagination from "../entities/SessionPagination";
import APIClient from "./apiClient";


const cropSessionService = new APIClient<SessionPagination | CropSession[], CropSession, QueryParams>("/crop-sessions");

export default cropSessionService;