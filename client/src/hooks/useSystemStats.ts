import { useQuery } from "@tanstack/react-query";
import { DAY, SYSTEM_STATISTICS_CACHE_KEY } from "../entities/constants";
import systemStatService from "../services/systemStatService";


const useSystemStats = (systemId: string) => {
    return useQuery({
        queryKey: [...SYSTEM_STATISTICS_CACHE_KEY, systemId],
        queryFn: () => systemStatService.setSubroute(`/${systemId}`).get(),
        staleTime: DAY
    });
};

export default useSystemStats;