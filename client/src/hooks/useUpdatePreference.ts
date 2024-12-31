import { useMutation, useQueryClient } from "@tanstack/react-query";
import Preference from "../entities/Preference";
import preferenceService from "../services/preferenceService";
import { PREFERENCES_CACHE_KEY } from "../entities/constants";

const useUpdatePreference = (systemId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (body: Preference) => preferenceService.put(body.systemId, body),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: [...PREFERENCES_CACHE_KEY, systemId] }),
    });
}

export default useUpdatePreference;