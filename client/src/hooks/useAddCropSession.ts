import { useMutation, useQueryClient } from "@tanstack/react-query";
import CropSession from "../entities/CropSession";
import cropSessionService from "../services/cropSessionService";
import { SESSION_CACHE_KEY } from "../entities/constants";

const useAddCropSession = (onSuccess?: () => void) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (cropSession: CropSession) =>
            cropSessionService.setSubroute(`/${cropSession.systemId}`).post(cropSession),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey:  SESSION_CACHE_KEY});
            onSuccess && onSuccess();
        }
    });
}

export default useAddCropSession;