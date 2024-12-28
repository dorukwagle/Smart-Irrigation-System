import { useMutation, useQueryClient } from "@tanstack/react-query";
import systemService from "../services/systemService";
import { SYSTEMS_CACHE_KEY } from "../entities/constants";

const useDeleteSystem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => systemService.setSubroute("/delete").delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SYSTEMS_CACHE_KEY }),
  });
};

export default useDeleteSystem;

