import { connectR2 } from "wrangler-proxy";

export const handle = async ({ resolve, event }) => {
  event.locals.R2 = event.platform?.env?.R2 ?? connectR2("R2");
  return resolve(event);
};
