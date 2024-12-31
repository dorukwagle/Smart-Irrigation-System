import { useQuery } from "@tanstack/react-query";
import { DAY, PREFERENCES_CACHE_KEY } from "../entities/constants";
import preferenceService from "../services/preferenceService";


const usePreference = (systemId: string) => {
    return useQuery({
        queryKey: [...PREFERENCES_CACHE_KEY, systemId],
        queryFn: () => preferenceService.setSubroute(`/${systemId}`).get(),
        staleTime: DAY
    });
}

export default usePreference;