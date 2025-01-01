import { useQuery } from "@tanstack/react-query";
import { DAY, LIVE_STATUS_CACHE_KEY } from "../entities/constants";
import liveStatusService from "../services/liveStatusService";


const useLiveStatus = (systemId: string) => {
    return useQuery({
        queryKey: [...LIVE_STATUS_CACHE_KEY, systemId],
        queryFn: () => liveStatusService.setSubroute(`/${systemId}`).get(),
        staleTime: 10 * 1000, // 10 seconds
    });
};

export default useLiveStatus;