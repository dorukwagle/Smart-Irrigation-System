import { z } from "zod";

const LiveStatus = z.object({
    irrigationStatus: z.union([
        z.literal("ON"), z.literal("OFF")]),
    temperature: z.coerce.number(),
    humidity: z.coerce.number(),
    moisture: z.coerce.number(),
});

export type LiveStatusType = z.infer<typeof LiveStatus>;
export default LiveStatus;