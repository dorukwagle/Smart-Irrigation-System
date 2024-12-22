import { z } from "zod";
import { CROP_TYPES } from "../entities/constants";

const values: readonly [string, ...string[]] = [...CROP_TYPES];

const CropSessionForm = z.object({
    cropName: z.enum(values, { required_error: "Crop Name is required" }),
    ageCount: z.coerce.number({ required_error: "Age Count is required" })
        .int("Age Count must be an integer")
        .min(0, "Age Count cannot be negative"),
});

export type CropSessionFormType = z.infer<typeof CropSessionForm>;
export default CropSessionForm;

