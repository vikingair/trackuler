import path from "path";
import { fileURLToPath } from "url";

export const backendRoot = path.dirname(fileURLToPath(import.meta.url));
