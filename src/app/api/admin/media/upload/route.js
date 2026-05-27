import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { COLLECTIONS, dbNow, setDocument } from "@/lib/firestore";
import { requireAdminApi, jsonError } from "@/lib/admin-api";
import { getFirebaseAdminStorage } from "@/lib/firebase/admin";

export async function POST(request) {
  const { error } = await requireAdminApi(request);
  if (error) return error;

  try {
    const form = await request.formData();
    const file = form.get("file");
    const usageTagsRaw = form.get("usageTags");
    const altText = String(form.get("altText") || "").trim();
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }

    const mediaId = randomUUID();
    const ext = file.name.includes(".") ? file.name.split(".").pop() : "jpg";
    const storagePath = `admin-media/${mediaId}.${ext}`;
    const bytes = Buffer.from(await file.arrayBuffer());

    const bucket = getFirebaseAdminStorage().bucket();
    const blob = bucket.file(storagePath);
    await blob.save(bytes, {
      metadata: {
        contentType: file.type || "application/octet-stream",
      },
      resumable: false,
    });

    const [url] = await blob.getSignedUrl({
      action: "read",
      expires: "03-09-2491",
    });

    const usageTags = String(usageTagsRaw || "")
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    await setDocument(COLLECTIONS.media, mediaId, {
      id: mediaId,
      url,
      storagePath,
      usageTags,
      altText,
      createdAt: dbNow(),
      updatedAt: dbNow(),
    });

    return NextResponse.json({ ok: true, media: { id: mediaId, url, storagePath } });
  } catch (routeError) {
    return jsonError(routeError);
  }
}
