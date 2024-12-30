import CropTypes from "../entities/CropTypes";
import QueryParams from "../entities/QueryParams";
import APIClient from "./apiClient";


const cropTypeService = new APIClient<CropTypes, CropTypes, QueryParams>("/crop-sessions/crop-types");

export default cropTypeService;