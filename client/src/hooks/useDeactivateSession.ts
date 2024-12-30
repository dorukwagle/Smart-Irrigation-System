import { useMutation, useQueryClient } from "@tanstack/react-query";
import CropSession from "../entities/CropSession";
import cropSessionService from "../services/cropSessionService";
import { SESSION_CACHE_KEY } from "../entities/constants";

const useDeactivateSession = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (session: CropSession) =>
      cropSessionService.setSubroute(`/deactivate/${session.systemId}/${session.cropSessionId}`).post(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SESSION_CACHE_KEY });
      onSuccess && onSuccess();
    },
  });
};

export default useDeactivateSession;
