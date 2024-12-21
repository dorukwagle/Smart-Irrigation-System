import { z } from "zod";

const SystemForm = z.object({
    systemName: z.string({ required_error: "System's Name is required" })
        .min(3, "Name must be at least 3 characters long"),
    pumpFlowRate: z.coerce.number({ required_error: "Pump/Motor flow rate in Litre/Min in required"})
        .min(0.1, "Pump/Motor flow rate must be at least 0.1L/min"),
});

export type SystemFormType = z.infer<typeof SystemForm>;
export default SystemForm;