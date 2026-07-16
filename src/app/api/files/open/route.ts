import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getGoogleDrive } from "@/lib/googleDrive";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);

    const driveFileId = searchParams.get("driveFileId");

    if (!driveFileId) {
      return Response.json(
        { error: "driveFileId is required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("StudentDash");

    const filesCollection = db.collection("files");

    const file = await filesCollection.findOne({
      driveFileId,
      userEmail: session.user.email,
    });

    if (!file) {
      return Response.json(
        { error: "File not found" },
        { status: 404 }
      );
    }

    const accessToken = session.accessToken;

    if (!accessToken) {
      return Response.json(
        { error: "Google Drive not authenticated" },
        { status: 401 }
      );
    }

    const drive = getGoogleDrive(accessToken);

    const response = await drive.files.get({
      fileId: driveFileId,
      fields: "webViewLink",
    });

    return Response.json({
      webViewLink: response.data.webViewLink,
    });

  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Failed to open file" },
      { status: 500 }
    );
  }
}