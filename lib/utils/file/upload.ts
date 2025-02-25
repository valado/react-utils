const DEFAULT_ACCEPTED_FILE_TYPES = "image/png, image/jpeg";
const DEFAULT_MAX_FILE_SIZE_IN_MB = 4.5;

type Size = {
  width: number;
  height: number;
};

type ReturnFileType = {
  name: string;
  content?: string;
  res?: Size;
  size?: number;
};

type Options = {
  multiple?: boolean;
  acceptedFileTypes?: string;
  maxFileSizeInMB?: number;
  progressCallback?: (progressPercentage: number) => void;
  notifyError?: (error: string) => void;
};

export const requestImages = ({
  multiple = true,
  acceptedFileTypes = DEFAULT_ACCEPTED_FILE_TYPES,
  maxFileSizeInMB = DEFAULT_MAX_FILE_SIZE_IN_MB,
  progressCallback,
  notifyError,
}: Options): Promise<ReturnFileType[]> =>
  new Promise((resolve) => {
    const maxFileSize = 1024 * 1024 * maxFileSizeInMB; // 5MB
    const input = document.createElement("input") as HTMLInputElement;
    input.type = "file";
    input.multiple = multiple;
    input.accept = acceptedFileTypes;
    let processedFiles = 0;
    const handleProgress = (progress: number) => {
      if (progressCallback) {
        progressCallback(progress);
      }
    };

    input.onchange = (event: any) => {
      const files: File[] = event?.target?.files;
      const calcProgress = () =>
        Number(((++processedFiles / files.length) * 100).toFixed(0));

      if (files) {
        const filteredFiles = Array.from(files).filter(
          (file) => file.size <= maxFileSize
        );
        if (files.length !== filteredFiles.length && notifyError) {
          notifyError(`Maximum file size is ${maxFileSizeInMB} MB`);
        }
        const imagePromises = filteredFiles.map(
          (file): Promise<ReturnFileType | null> =>
            readImg(file)
              .then((img) => {
                handleProgress(calcProgress());
                return img;
              })
              .catch((_) => {
                if (notifyError) {
                  notifyError("Reading failed");
                }
                return null;
              })
        );

        return Promise.all(imagePromises).then((imgs) =>
          resolve(imgs.filter(Boolean) as ReturnFileType[])
        );
      }
      return resolve([]);
    };
    input.oncancel = () => resolve([]);
    input.onabort = () => resolve([]);
    input.onerror = (e) => {
      console.log(e);
      resolve([]);
    };
    handleProgress(0);
    input.click();
  });

const readImg = (f: File): Promise<ReturnFileType> => {
  return new Promise((resolve) => {
    readFile(f).then((file) => {
      if (file.content) {
        const img = new Image();
        img.onload = () => {
          resolve({
            ...file,
            res: { width: img.width, height: img.height },
          });
        };
        img.onerror = () => {
          resolve(file);
        };
        img.src = file.content;
      } else {
        resolve(file);
      }
    });
  });
};

const readFile = (file: File): Promise<ReturnFileType> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const content = e.target.result;
      if (typeof content === "string") {
        const name = file.name.replace(/\.(png|jpg|jpeg)/gi, "");
        resolve({ name, content });
      }
    };
    reader.onerror = () => {
      resolve({ name: file.name });
    };
    reader.readAsDataURL(file);
  });
};
