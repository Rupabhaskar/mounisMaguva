import { NextResponse } from "next/server";
import { getFirebaseAdminAuth } from "@/lib/firebase/admin";
import {
  ADMIN_SESSION_COOKIE,
  buildSessionCookieOptions,
  createAdminSessionCookie,
  getAdminProfile,
  isAdminUser,
} from "@/lib/admin-auth";

export async function POST(request) {
  try {
    const body = await request.json();
    const idToken = body?.idToken;
    if (!idToken) {
      return NextResponse.json({ error: "Missing idToken" }, { status: 400 });
    }

    const auth = getFirebaseAdminAuth();
    const decoded = await auth.verifyIdToken(idToken, true);

    if (!(await isAdminUser(decoded))) {
      return NextResponse.json(
        {
          error:
            "Access denied. Create a Firestore document at users/{your-uid} with role set to \"admin\".",
          uid: decoded.uid,
        },
        { status: 403 },
      );
    }

    const sessionCookie = await createAdminSessionCookie(idToken);
    const admin = await getAdminProfile(decoded);
    const response = NextResponse.json({ ok: true, admin });
    response.cookies.set(ADMIN_SESSION_COOKIE, sessionCookie, buildSessionCookieOptions());
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: error.message === "FORBIDDEN" ? "Admin access required" : "Invalid login" },
      { status: error.message === "FORBIDDEN" ? 403 : 401 },
    );
  }
}
