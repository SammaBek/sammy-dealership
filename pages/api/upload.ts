import formidable from "formidable";
import fs from "fs";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import type { NextApiRequest, NextApiResponse } from "next";
import { uploadHandler } from "@/controllers/uploadController";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const form = formidable({ multiples: true, keepExtensions: true });

  const {
    fields,
    files,
  }: { fields: formidable.Fields; files: formidable.Files } = await new Promise(
    (resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    }
  );

  const { savedFields, imageUrls } = (await uploadHandler({
    fields,
    files,
  })) ?? { savedFields: null, imageUrls: [] };

  res.status(200).json({
    message: "Upload successful",
    imageUrls,
    savedFields,
  });
}
