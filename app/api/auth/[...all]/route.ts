import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth/index";

export const { POST, GET } = toNextJsHandler(auth);
