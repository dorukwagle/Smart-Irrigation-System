import { useMutation, useQueryClient } from "@tanstack/react-query";
import systemService from "../services/systemService";
import { SYSTEM_INFO_KEY } from "../entities/constants";


const useRegenerateIdentifier = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (systemId: string) => systemService.setSubroute(`/regenerate/${systemId}`).post(),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: SYSTEM_INFO_KEY }),
    });
}

export default useRegenerateIdentifier;