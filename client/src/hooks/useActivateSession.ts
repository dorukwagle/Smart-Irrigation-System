import { useMutation, useQueryClient } from "@tanstack/react-query";
import cropSessionService from "../services/cropSessionService";
import { SESSION_CACHE_KEY, SESSION_INFO_CACHE_KEY } from "../entities/constants";
import CropSession from "../entities/CropSession";

const useActivateCropSession = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

    return useMutation({
    mutationFn: (session: CropSession) =>
      cropSessionService.setSubroute(`/activate/${session.systemId}/${session.cropSessionId}`).post(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SESSION_CACHE_KEY });
      queryClient.invalidateQueries({ queryKey: SESSION_INFO_CACHE_KEY });
      onSuccess && onSuccess();
    },
  });
};

export default useActivateCropSession;