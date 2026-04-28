"use client";

import { useState } from "react";
import { T } from "@/lib/constants";
import { FlagRow, type Flag } from "./FlagRow";

type Props = {
  initialFlags: Flag[];
};

export function FlagList({ initialFlags }: Props) {
  const [flags, setFlags] = useState<Flag[]>(initialFlags);

  function onResolved(id: string) {
    setFlags((prev) => prev.filter((f) => f.id !== id));
  }

  if (flags.length === 0) {
    return (
      <p style={{ color: T.muted, fontSize: 14 }}>
        No open flags. Anomalies show up here after the reconcile cron runs.
      </p>
    );
  }

  return (
    <div>
      {flags.map((f) => (
        <FlagRow key={f.id} flag={f} onResolved={onResolved} />
      ))}
    </div>
  );
}
