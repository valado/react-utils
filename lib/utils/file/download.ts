export enum FileType {
  PDF = "application/pdf",
  PNG = "image/png",
  JPEG = "image/jpeg",
  JPG = "image/jpg",
  SVG = "image/svg+xml",
  TXT = "text/plain",
  CSV = "text/csv",
  JSON = "application/json",
  ZIP = "application/zip",
}

const extensionMap = {
  [FileType.PDF]: "pdf",
  [FileType.PNG]: "png",
  [FileType.JPEG]: "jpeg",
  [FileType.JPG]: "jpg",
  [FileType.SVG]: "svg",
  [FileType.TXT]: "txt",
  [FileType.CSV]: "csv",
  [FileType.JSON]: "json",
  [FileType.ZIP]: "zip",
};

const addFileExtensionOptionally = (fileName: string, type: FileType) =>
  fileName.includes(".") ? fileName : fileName + "." + extensionMap[type];

export const saveBufferToFile = (
  fileName: string,
  type: FileType,
  bytes: Buffer
) => {
  const blob = new Blob([bytes], { type });
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = addFileExtensionOptionally(fileName, type);
  link.click();
};
