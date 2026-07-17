import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";

import clientPromise from "@/lib/mongodb";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { getGoogleDrive } from "@/lib/googleDrive";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  request: Request,
  { params }: RouteContext
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return Response.json(
        { error: "Invalid file id" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("StudentDash");

    const file = await db.collection("files").findOne({
      _id: new ObjectId(id),
    });

    if (!file) {
      return Response.json(
        { error: "File not found" },
        { status: 404 }
      );
    }

    if (file.userEmail !== session.user.email) {
      return Response.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const drive = getGoogleDrive(session.accessToken!);

    const response = await drive.files.get({
      fileId: file.driveFileId,
      fields: "webContentLink",
    });

    return Response.json({
      downloadUrl: response.data.webContentLink,
    });

  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Failed to download file" },
      { status: 500 }
    );
  }
}