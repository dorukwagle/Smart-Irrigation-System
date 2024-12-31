import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SESSION_CACHE_KEY, SESSION_INFO_CACHE_KEY } from "../entities/constants";
import CropSession from "../entities/CropSession";
import cropSessionService from "../services/cropSessionService";

const useUpdateCropSession = () => {
    const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (session: CropSession) => cropSessionService.put(`${session.systemId}/${session.cropSessionId}`, session),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey:  SESSION_CACHE_KEY});
      queryClient.invalidateQueries({ queryKey:  SESSION_INFO_CACHE_KEY});
    },
  });
};

export default useUpdateCropSession;