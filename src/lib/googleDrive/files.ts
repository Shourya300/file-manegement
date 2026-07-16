import { getGoogleDrive } from "./client";
import { Readable } from "stream";

export async function uploadFile(
  accessToken: string,
  file: File,
  folderId: string
) {
  const drive = getGoogleDrive(accessToken);

  const bytes = await file.arrayBuffer();

  const buffer = Buffer.from(bytes);

  const stream = Readable.from(buffer);

  const response = await drive.files.create({
    requestBody: {
      name: file.name,
      parents: [folderId],
    },

    media: {
      mimeType: file.type,
      body: stream,
    },

    fields: "id,name,mimeType,size",
  });

  return response.data;
}