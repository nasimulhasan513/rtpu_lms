import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export default defineEventHandler(async (event) => {
  await validateRequest(event);

  try {
    const body = await readBody(event);
  
    const {
      CLOUDFLARE_ACCESS_ID,
      CLOUDFLARE_BUCKET_NAME,
      CLOUDFLARE_ACCESS_KEY,
      CLOUDFLARE_ENDPOINT,
    } = process.env;

    if (
      !CLOUDFLARE_ACCESS_ID ||
      !CLOUDFLARE_BUCKET_NAME ||
      !CLOUDFLARE_ACCESS_KEY ||
      !CLOUDFLARE_ENDPOINT
    ) {
      console.error("Missing Cloudflare credentials");
      return {
        error: "Missing Cloudflare credentials",
      };
    }

    const S3 = new S3Client({
      region: "auto",
      endpoint: CLOUDFLARE_ENDPOINT,
      credentials: {
        accessKeyId: CLOUDFLARE_ACCESS_ID,
        secretAccessKey: CLOUDFLARE_ACCESS_KEY,
      },
    });

    if (typeof body !== "object" || body === null || !body.fileName) {
      console.error("Invalid request body or missing fileName");
      return { error: "Invalid request body or missing fileName" };
    }

    const { fileName, fileSize, fileType } = body;

    if (!fileName.trim()) {
      console.error("File name cannot be empty");
      return { error: "File name cannot be empty" };
    }

    const command = new PutObjectCommand({
      Bucket: CLOUDFLARE_BUCKET_NAME,
      Key: fileName,
      ContentLength: fileSize,
      ContentType: fileType,
    });

    const uploadUrl = await getSignedUrl(S3, command, { expiresIn: 3600 }); // 1 hour expiration

    await db.user.update({
      where: { id: event.context.user?.id },
      data: {
        image: `https://pub-de86fc8fea3047248c160c647017965e.r2.dev/${fileName}`,
      },
    });

    return { uploadUrl };
  } catch (error) {
    console.error("Error generating signed URL:", error as string);
    return { error: "Error generating signed URL" };
  }
});
