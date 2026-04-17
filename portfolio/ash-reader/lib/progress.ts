const PREFIX = "ash_reader_";

export function markSent(key: string, index: number, sent: boolean) {
  if (sent) {
    localStorage.setItem(`${PREFIX}${key}_${index}`, "1");
  } else {
    localStorage.removeItem(`${PREFIX}${key}_${index}`);
  }
}

export function isSent(key: string, index: number): boolean {
  return localStorage.getItem(`${PREFIX}${key}_${index}`) === "1";
}

export function getSentCount(key: string, total: number): number {
  let count = 0;
  for (let i = 0; i < total; i++) {
    if (isSent(key, i)) count++;
  }
  return count;
}

export function resetProgress(key: string, total: number) {
  for (let i = 0; i < total; i++) {
    localStorage.removeItem(`${PREFIX}${key}_${i}`);
  }
}

export function markActionDone(id: string, done: boolean) {
  if (done) {
    localStorage.setItem(`${PREFIX}action_${id}`, "1");
  } else {
    localStorage.removeItem(`${PREFIX}action_${id}`);
  }
}

export function isActionDone(id: string): boolean {
  return localStorage.getItem(`${PREFIX}action_${id}`) === "1";
}

export function getPromptPrefix(): string {
  return (
    localStorage.getItem(`${PREFIX}prompt_prefix`) ??
    "Here's a section from my capture system conversation. Walk me through it like a therapist and help me process what I was feeling and what I learned:"
  );
}

export function setPromptPrefix(val: string) {
  localStorage.setItem(`${PREFIX}prompt_prefix`, val);
}

export function isPromptPrefixEnabled(): boolean {
  return localStorage.getItem(`${PREFIX}prompt_prefix_on`) === "1";
}

export function setPromptPrefixEnabled(on: boolean) {
  if (on) {
    localStorage.setItem(`${PREFIX}prompt_prefix_on`, "1");
  } else {
    localStorage.removeItem(`${PREFIX}prompt_prefix_on`);
  }
}

export function exportAll(): string {
  const data: Record<string, string> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i)!;
    if (k.startsWith(PREFIX)) data[k] = localStorage.getItem(k)!;
  }
  return JSON.stringify(data, null, 2);
}

export function importAll(json: string): { chunks: number; actions: number } {
  const data = JSON.parse(json) as Record<string, string>;
  let chunks = 0;
  let actions = 0;
  for (const [k, v] of Object.entries(data)) {
    if (!k.startsWith(PREFIX)) continue;
    localStorage.setItem(k, v);
    if (k.includes("_action_")) actions++;
    else chunks++;
  }
  return { chunks, actions };
}
