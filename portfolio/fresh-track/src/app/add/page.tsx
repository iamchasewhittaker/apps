"use client";

import { ItemForm } from "@/components/item-form";

export default function AddPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <header className="mb-5">
        <h1 className="text-2xl font-bold">Add Item</h1>
        <p className="text-sm text-zinc-500 mt-0.5">
          Search for a food to auto-fill expiration dates
        </p>
      </header>
      <ItemForm />
    </div>
  );
}
