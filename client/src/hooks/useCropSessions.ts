import { useQuery } from "@tanstack/react-query";
import { DAY, SESSION_CACHE_KEY } from "../entities/constants";
import cropSessionService from "../services/cropSessionService";
import QueryParams from "../entities/QueryParams";
import SessionPagination from "../entities/SessionPagination";
import CropSession from "../entities/CropSession";
import { AxiosError } from "axios";

const useCropSessions = (systemId: string, search?: string) => {
    const params: QueryParams = {
        page: 1,
        pageSize: 100,
    };
    if (search) params.seed = search;

    return useQuery<SessionPagination | CropSession[], AxiosError>({
        queryKey: search ? [...SESSION_CACHE_KEY, search] : SESSION_CACHE_KEY,
        queryFn: () => cropSessionService.setSubroute(`/${systemId}`).get('', params),
        staleTime: DAY,
    });
};

export default useCropSessions;