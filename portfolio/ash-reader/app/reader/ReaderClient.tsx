"use client";
import ChunkReader from "@/components/ChunkReader";

export default function ReaderClient({ text }: { text: string }) {
  return <ChunkReader text={text} storageKey="reader" defaultSize={2000} />;
}
