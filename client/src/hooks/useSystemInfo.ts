import { AxiosError } from "axios";
import System from "../entities/System";
import { useQuery } from "@tanstack/react-query";
import { DAY, SYSTEM_INFO_KEY, SYSTEMS_CACHE_KEY } from "../entities/constants";
import systemService from "../services/systemService";
import SystemPagination from "../entities/SystemPagination";


const useSystemInfo = (id: string) => {
    return useQuery<SystemPagination | System[], AxiosError>({
        queryKey: SYSTEM_INFO_KEY,
        queryFn: () => systemService.setSubroute("/info").get(id),
        staleTime: DAY,
    });
}

export default useSystemInfo;