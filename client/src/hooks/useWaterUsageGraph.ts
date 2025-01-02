import { useQuery } from "@tanstack/react-query";
import waterUsageService from "../services/waterUsageService";
import { DAY, WATER_USAGE_GRAPH_CACHE_KEY } from "../entities/constants";

const useWaterUsageGraph = (systemId: string, sessionId: string) => {
    return useQuery({
        queryKey: [...WATER_USAGE_GRAPH_CACHE_KEY, systemId, sessionId],
        queryFn: () => waterUsageService.setSubroute(`/${systemId}/${sessionId}`).get(),
        staleTime: DAY
    });
};

export default useWaterUsageGraph;