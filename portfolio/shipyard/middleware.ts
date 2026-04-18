// Auth handled by proxy.ts (Next.js 16). This file is a no-op compat shim.
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = { matcher: [] };
