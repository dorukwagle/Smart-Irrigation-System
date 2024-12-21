import { z } from "zod";

const SystemUpdateForm = z.object({
    systemName: z.string().min(3, "Name must be at least 3 characters long").optional(),
    pumpFlowRate: z.coerce.number().min(0.1, "Pump/Motor flow rate must be at least 0.1L/min").optional(),
});

export type SystemUpdateFormType = z.infer<typeof SystemUpdateForm>;
export default SystemUpdateForm;