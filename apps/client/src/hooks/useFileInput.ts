import { ChangeEvent, useCallback, useState } from "react";
import { MAX_MESSAGE_IMAGE_SIZE } from "@/constants/common.constants.ts";
import { toast } from "sonner";

type useFileInputProps = {
  multiple: boolean;
  accept?: string;
  maxFileLimit?: number;
};

export type useFileInputResult = {
  files: FileList | null;
  setFiles: (files: FileList | null) => void;
  handleFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  resetFiles: () => void;
  showFilePreview: () => Array<{
    preview: string;
    size: number;
    type: string;
  }>;
  deleteFile: (index: number) => void;
  inputProps: {
    type: "file";
    multiple: boolean;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    accept?: string;
  };
};

export const useFileInput = ({
  multiple,
  accept,
  maxFileLimit,
}: useFileInputProps): useFileInputResult => {
  const [files, setFiles] = useState<FileList | null>(null);

  const handleFileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = event.target.files;
      if (
        selectedFiles &&
        maxFileLimit &&
        selectedFiles.length > 0 &&
        selectedFiles.length > maxFileLimit
      ) {
        toast.error("Limit attachments to 3 files");
        event.target.value = "";
        return;
      }
      const isFileLimit = Array.from(selectedFiles || []).some(
        (file) => file.size >= MAX_MESSAGE_IMAGE_SIZE,
      );
      if (isFileLimit) {
        toast.error("Attachment cannot be greater than 1MB");
        event.target.value = "";
        return;
      }
      setFiles(selectedFiles);
    },
    [],
  );

  const showFilePreview = () => {
    if (!files) return [];
    return Array.from(files).map((file) => {
      return {
        preview: URL.createObjectURL(file),
        type: file.type,
        size: file.size,
      };
    });
  };

  const deleteFile = (index: number) => {
    if (!files) return;
    const filesArray = Array.from(files);
    filesArray.splice(index, 1);
    const newFileList = new DataTransfer(); //create empty FileList
    filesArray.forEach((file) => newFileList.items.add(file));
    setFiles(newFileList.files);
  };

  const resetFiles = useCallback(() => {
    setFiles(null);
  }, []);

  return {
    files,
    handleFileChange,
    resetFiles,
    setFiles,
    inputProps: {
      multiple,
      type: "file",
      onChange: handleFileChange,
      accept: accept ?? undefined,
    },
    showFilePreview,
    deleteFile,
  };
};
