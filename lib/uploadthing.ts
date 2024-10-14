import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";

import { AppFileRouter } from "../app/api/uploadthing/core";

export const UploadButton = generateUploadButton<AppFileRouter>();
export const UploadDropzone = generateUploadDropzone<AppFileRouter>();
