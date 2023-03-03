import { entriesDb } from "../db";
import shell from "../../utils/shell";
import { updateServerConfigs } from "../../nginx";

const maxRetries = 3;

export async function reconfigureNGINX(
  force: boolean = false
): Promise<boolean> {
  await updateServerConfigs(entriesDb.read(), force);
  for (var i = 0; i < maxRetries; i++) {
    try {
      await shell("nginx -s reload");
      console.log("Reconfigured NGINX");
      return true;
    } catch (e) {
      console.log("Failed to reconfigure NGINX");
    }
    await new Promise((r) => setTimeout(r, 3000));
  }
  return false;
}
