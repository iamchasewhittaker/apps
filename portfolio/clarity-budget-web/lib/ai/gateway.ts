import "server-only";
import { generateObject as aiGenerateObject } from "ai";
import type { ZodType } from "zod";

/**
 * Default model — Vercel AI Gateway routes by `"provider/model"` string.
 * GPT-4o-mini is the cost-optimal pick for personal-finance categorization
 * (see plan: ~$0.0001/tx batched, accurate enough with few-shot history).
 */
export const DEFAULT_MODEL = "openai/gpt-4o-mini" as const;

export type TokenUsage = {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
};

export type GenerateObjectResult<T> = {
  object: T;
  usage: TokenUsage;
  modelId: string;
};

function assertGatewayEnv(): void {
  if (!process.env.AI_GATEWAY_API_KEY) {
    throw new Error("AI_GATEWAY_API_KEY is not set");
  }
}

function normalizeUsage(raw: unknown): TokenUsage {
  if (raw && typeof raw === "object") {
    const r = raw as Record<string, unknown>;
    const input = Number(r.inputTokens ?? r.promptTokens ?? 0) || 0;
    const output = Number(r.outputTokens ?? r.completionTokens ?? 0) || 0;
    const total = Number(r.totalTokens ?? input + output) || input + output;
    return { inputTokens: input, outputTokens: output, totalTokens: total };
  }
  return { inputTokens: 0, outputTokens: 0, totalTokens: 0 };
}

/**
 * Thin wrapper around `ai`'s `generateObject` that pins everything in the
 * codebase to the Vercel AI Gateway and returns a normalized usage shape.
 *
 * Nothing else in the app should import `ai` directly.
 */
export async function generateObject<T>(opts: {
  prompt: string;
  system?: string;
  schema: ZodType<T>;
  model?: string;
  maxOutputTokens?: number;
  temperature?: number;
}): Promise<GenerateObjectResult<T>> {
  assertGatewayEnv();

  const modelId = opts.model ?? DEFAULT_MODEL;

  const result = await aiGenerateObject({
    model: modelId,
    schema: opts.schema,
    prompt: opts.prompt,
    system: opts.system,
    maxOutputTokens: opts.maxOutputTokens,
    temperature: opts.temperature ?? 0,
  });

  return {
    object: result.object as T,
    usage: normalizeUsage((result as { usage?: unknown }).usage),
    modelId,
  };
}
