import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ email: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { email } = await params;
    const backendUrl = process.env.INTERNAL_API_URL ?? "http://localhost:8000";
    const viewerEmail = session.user?.email ?? "";

    const url = `${backendUrl}/users/${encodeURIComponent(email)}/profile?viewer_email=${encodeURIComponent(viewerEmail)}`;
    console.log("Fetching profile from:", url);
    
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Backend response status:", response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.log("Backend error:", errorData);
      return Response.json(
        { error: errorData.detail || "Friend profile not found" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error("Error fetching friend profile:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
