import { auth } from "@clerk/nextjs/server";
import { createUploadthing } from "uploadthing/next";
import { FileRouter, UploadThingError } from "uploadthing/server";

const f = createUploadthing();

const handleAuth = () => {
  const { userId } = auth();
  if (!userId) throw new UploadThingError("Unauthorized");
  return { userId };
};

export const fileRouter = {
  serverImage: f({ image: { maxFileSize: "1MB", maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),

  messageFile: f(["image", "pdf"])
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
} satisfies FileRouter;

export type AppFileRouter = typeof fileRouter;
