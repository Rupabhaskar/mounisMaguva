import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { COLLECTIONS, dbNow, listCollection, setDocument } from "@/lib/firestore";
import { normalizeOrderInput } from "@/lib/admin-models";
import { requireAdminApi, jsonError } from "@/lib/admin-api";

export async function GET(request) {
  const { error } = await requireAdminApi(request);
  if (error) return error;
  try {
    const orders = await listCollection(COLLECTIONS.orders, {
      orderBy: "updatedAt",
      direction: "desc",
    });
    return NextResponse.json({ orders });
  } catch (routeError) {
    return jsonError(routeError);
  }
}

export async function POST(request) {
  const { error } = await requireAdminApi(request);
  if (error) return error;
  try {
    const body = await request.json();
    const data = normalizeOrderInput(body);
    const id = body?.id || randomUUID();
    await setDocument(COLLECTIONS.orders, id, {
      ...data,
      id,
      createdAt: dbNow(),
      updatedAt: dbNow(),
    });
    return NextResponse.json({ ok: true, id }, { status: 201 });
  } catch (routeError) {
    return jsonError(routeError);
  }
}
