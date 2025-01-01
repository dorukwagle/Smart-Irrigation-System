import { z } from "zod";

const systemPreference = z.object({
    isManualOverride: z.coerce.boolean().optional(),
    isIrrigationActive: z.coerce.boolean().optional(),
});

export type SystemPreferenceType = z.infer<typeof systemPreference>;
export default systemPreference;