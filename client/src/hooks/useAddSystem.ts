import { useMutation, useQueryClient } from "@tanstack/react-query";
import System from "../entities/System";
import systemService from "../services/systemService";
import { SYSTEMS_CACHE_KEY } from "../entities/constants";


const useAddSystem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (system: System) => systemService.setSubroute("/register").post(system),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: SYSTEMS_CACHE_KEY }),
    });
}

export default useAddSystem;