import { AxiosError } from "axios";
import CropSession from "../entities/CropSession";
import SessionPagination from "../entities/SessionPagination";
import { DAY, SESSION_INFO_CACHE_KEY } from "../entities/constants";
import cropSessionService from "../services/cropSessionService";
import { useQuery } from "@tanstack/react-query";

const useSessionInfo = (id: string) => {
    return useQuery<SessionPagination | CropSession[], AxiosError>({
        queryKey: [...SESSION_INFO_CACHE_KEY, id],
        queryFn: () => cropSessionService.setSubroute("/info").get(id),
        staleTime: DAY,
    });
}

export default useSessionInfo;