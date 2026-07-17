import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";

import clientPromise from "@/lib/mongodb";
import { authOptions } from "../../auth/[...nextauth]/route";
import { deleteFile } from "@/lib/googleDrive";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function DELETE(
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

    const filesCollection = db.collection("files");

    const file = await filesCollection.findOne({
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

    const accessToken = session.accessToken;

    if (!accessToken) {
      return Response.json(
        { error: "Google Drive not authenticated" },
        { status: 401 }
      );
    }

    await deleteFile(
      accessToken,
      file.driveFileId
    );

    await filesCollection.deleteOne({
      _id: new ObjectId(id),
    });

    return Response.json({
      success: true,
    });

  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Failed to delete file" },
      { status: 500 }
    );
  }
}