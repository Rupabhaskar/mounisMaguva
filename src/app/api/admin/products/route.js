import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { COLLECTIONS, dbNow, listCollection, setDocument } from "@/lib/firestore";
import { normalizeProductInput } from "@/lib/admin-models";
import { requireAdminApi, jsonError } from "@/lib/admin-api";

export async function GET(request) {
  const { error } = await requireAdminApi(request);
  if (error) return error;
  try {
    const products = await listCollection(COLLECTIONS.products, {
      orderBy: "updatedAt",
      direction: "desc",
    });
    return NextResponse.json({ products });
  } catch (routeError) {
    return jsonError(routeError);
  }
}

export async function POST(request) {
  const { error } = await requireAdminApi(request);
  if (error) return error;
  try {
    const body = await request.json();
    const data = normalizeProductInput(body);
    const id = body?.id || randomUUID();
    await setDocument(COLLECTIONS.products, id, {
      ...data,
      id,
      createdAt: dbNow(),
      updatedAt: dbNow(),
    });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (routeError) {
    return jsonError(routeError);
  }
}
