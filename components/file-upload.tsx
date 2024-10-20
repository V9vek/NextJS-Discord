"use client";

import { UploadDropzone } from "@/lib/uploadthing";
import { FileIcon, X } from "lucide-react";
import Image from "next/image";

interface FileUploadProps {
  endpoint: "serverImage" | "messageFile";
  value: { url: string; type: string };
  onChange: ({ url, type }: { url?: string; type?: string }) => void;
}

export function FileUpload({ endpoint, value, onChange }: FileUploadProps) {
  const fileType = value.type?.split("/").pop();

  if (value.url && fileType !== "pdf") {
    return (
      <div className="relative h-20 w-20">
        <Image
          src={value.url}
          alt="Upload"
          width={80}
          height={80}
          className="rounded-full aspect-square object-cover"
        />
        <button
          onClick={() => onChange({ url: "", type: "" })}
          className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
        >
          <X className="h-3 w-3" />
        </button>
      </div>
    );
  }

  if (value.url && fileType === "pdf") {
    return (
      <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
        <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
        <a
          href={value.url}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 text-wrap"
        >
          {value.url}
        </a>
        <button
          onClick={() => onChange({ url: "", type: "" })}
          className="bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-sm"
        >
          <X className="h-3 w-3" />
        </button>
      </div>
    );
  }

  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        console.log("server image upload complete");
        onChange({ url: res[0].url, type: res[0].type });
      }}
      onUploadError={(error) => {
        console.error(error);
      }}
    />
  );
}
