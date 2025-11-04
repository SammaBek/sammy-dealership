import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import formidable from "formidable";
import { UploadDto } from "../types/UploadFileDTO";
import dbConnect from "@/lib/dbConnect";
import { AppError } from "@/utils/AppError";
import Car from "@/models/carModel";

const s3 = new S3Client({
  region: "ca-central-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function uploadHandler({ fields, files }: UploadDto) {
  await dbConnect();

  const uploadedUrls: string[] = [];

  if (files.imageUrls) {
    const fileArray = Array.isArray(files.imageUrls)
      ? files.imageUrls.filter(Boolean)
      : files.imageUrls
        ? [files.imageUrls]
        : [];

    for (const file of fileArray) {
      const fileContent = fs.readFileSync(file.filepath);

      const command = new PutObjectCommand({
        Bucket: "sammy-dealership",
        Key: `uploads/${Date.now()}-${file.originalFilename}`,
        Body: fileContent,
        ContentType: file.mimetype || "application/octet-stream",
      });

      await s3.send(command);

      const region = await s3.config.region();

      uploadedUrls.push(
        `https://${command.input.Bucket}.s3.${region}.amazonaws.com/${command.input.Key}`
      );
    }
  } else if (fields.existingImageUrls) {
    const existing = Array.isArray(fields.existingImageUrls)
      ? fields.existingImageUrls[0]
      : fields.existingImageUrls;

    const parsed = JSON.parse(existing) as string[];
    uploadedUrls.push(...parsed);
  }

  const {
    make,
    type,
    year,
    vin,
    name,
    description,
    isOnSale,
    isAvailable,
    promoEndDate,
    promoStartDate,
    promoPercentage,
    price,
  } = fields;

  try {
    console.log(`{"my id is:" ${fields._id}}`);
    console.log("Creating car with details:");
    console.log(
      make,
      type,
      year,
      vin,
      name,
      uploadedUrls,
      description,
      isOnSale,
      isAvailable,
      promoEndDate,
      promoStartDate,
      promoPercentage,
      price
    );

    function normalizeField(
      value: string | string[] | undefined,
      type: "string" | "boolean" | "number" | "date" = "string"
    ) {
      const raw = Array.isArray(value) ? value[0] : value;

      switch (type) {
        case "boolean":
          return raw === "true";
        case "number":
          return raw ? parseFloat(raw) : 0;
        case "date": {
          const parsed = raw ? new Date(raw) : null;
          return parsed && !isNaN(parsed.getTime()) ? parsed : null;
        }
        default:
          return raw?.trim() || "";
      }
    }

    // We Normalize fields to ensure they are strings before saving to the database Formidable can return fields as string or string[]
    const carData = {
      name: normalizeField(fields.name),
      make: normalizeField(fields.make),
      description: normalizeField(fields.description),
      year: normalizeField(fields.year, "number"),
      vin: normalizeField(fields.vin),
      imageUrls: uploadedUrls,
      type: normalizeField(fields.type),
      isAvailable: normalizeField(fields.isAvailable, "boolean"),
      isOnSale: normalizeField(fields.isOnSale, "boolean"),
      promoEndDate: normalizeField(fields.promoEndDate, "date"),
      promoStartDate: normalizeField(fields.promoStartDate, "date"),
      promoPercentage: normalizeField(fields.promoPercentage, "number"),
      price: normalizeField(fields.price, "number"),
    };

    console.log("Here is CarData:");
    console.log(carData);

    if (fields._id) {
      console.log("Here is CarData:");
      console.log(carData);
      const updatedVehicle = await Car.findByIdAndUpdate(
        fields._id,

        carData,

        { new: true }
      );

      return { savedFields: updatedVehicle, imageUrls: uploadedUrls };
    } else if (!fields._id) {
      const newCar = await Car.create(carData);

      return { savedFields: newCar, imageUrls: uploadedUrls };
    }
  } catch (error: unknown) {
    throw new AppError("Failed to create car", 500);
  }
}
