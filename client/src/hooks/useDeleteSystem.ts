import { useMutation, useQueryClient } from "@tanstack/react-query";
import systemService from "../services/systemService";
import { SYSTEM_INFO_KEY, SYSTEMS_CACHE_KEY } from "../entities/constants";

const useDeleteSystem = (onSuccess?: () => void) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number | string) =>
            systemService.setSubroute("/delete").delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: SYSTEM_INFO_KEY });
            queryClient.invalidateQueries({ queryKey: SYSTEMS_CACHE_KEY });
            onSuccess && onSuccess();
        },
    });
};

export default useDeleteSystem;
