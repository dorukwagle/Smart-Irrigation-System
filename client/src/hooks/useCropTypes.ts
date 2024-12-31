import { useQuery } from "@tanstack/react-query";
import { CROP_TYPES_CACHE_KEY, DAY } from "../entities/constants";
import cropTypeService from "../services/cropTypesService";

const useCropTypes = () => {
    return useQuery({
        queryKey: CROP_TYPES_CACHE_KEY,
        queryFn: () => cropTypeService.get(),
        staleTime: DAY
    });
};

export default useCropTypes;