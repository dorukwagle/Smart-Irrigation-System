import { useQuery } from "@tanstack/react-query";
import { DAY, SESSION_STATISTICS_CACHE_KEY } from "../entities/constants";
import sessionStatService from "../services/sessionStatService";


const useSessionStat = (systemId: string, sessionId: string) => {
    return useQuery({
        queryKey: SESSION_STATISTICS_CACHE_KEY,
        queryFn: () => sessionStatService.setSubroute(`/${systemId}/${sessionId}`).get(),
        staleTime: DAY
    });
};

export default useSessionStat;