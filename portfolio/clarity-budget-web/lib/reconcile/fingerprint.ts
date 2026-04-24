import { createHash } from "node:crypto";

export function fingerprint(ids: string[]): string {
  return createHash("sha256")
    .update([...ids].sort().join("|"))
    .digest("hex");
}
