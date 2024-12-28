import { AxiosError } from "axios";
import QueryParams from "../entities/QueryParams";
import SystemPagination from "../entities/SystemPagination";
import systemService from "../services/systemService";
import { DAY, SYSTEMS_CACHE_KEY } from "../entities/constants";
import { useQuery } from "@tanstack/react-query";
import System from "../entities/System";

const useSystems = (search?: string) => {
    const params: QueryParams = {
        page: 1,
        pageSize: 100,
    };
    if (search) params.seed = search;

    return useQuery<SystemPagination | System[], AxiosError>({
        queryKey: SYSTEMS_CACHE_KEY,
        queryFn: () => systemService.get('', params),
        staleTime: DAY,
    });
}

export default useSystems;