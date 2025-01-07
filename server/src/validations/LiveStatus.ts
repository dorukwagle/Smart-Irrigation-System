import { z } from "zod";

const LiveStatus = z.object({
    irrigationStatus: z.union([
        z.literal("ON"), z.literal("OFF")]),
    temperature: z.coerce.number(),
    humidity: z.coerce.number(),
    soilMoisture: z.coerce.number(),
    currentSchedule: z.string().optional()
});

export type LiveStatusType = z.infer<typeof LiveStatus>;
export default LiveStatus;