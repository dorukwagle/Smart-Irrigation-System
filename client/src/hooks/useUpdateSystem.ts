import System from "../entities/System";
import systemService from "../services/systemService";
import { SYSTEM_INFO_KEY, SYSTEMS_CACHE_KEY } from "../entities/constants";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateSystem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (system: System) => systemService.setSubroute("/update").put(system.systemId, system),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey:  SYSTEMS_CACHE_KEY});
      queryClient.invalidateQueries({ queryKey:  SYSTEM_INFO_KEY});
    },
  });
};

export default useUpdateSystem;
