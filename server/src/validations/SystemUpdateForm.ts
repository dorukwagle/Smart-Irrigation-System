import { z } from "zod";
import SystemForm from "./SystemForm";

const SystemUpdateForm = SystemForm.partial();

export type SystemUpdateFormType = z.infer<typeof SystemUpdateForm>;
export default SystemUpdateForm;