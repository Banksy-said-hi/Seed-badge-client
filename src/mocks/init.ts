import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

if (typeof window !== "undefined") {
  const worker = setupWorker(...handlers);

  worker.start();
}
