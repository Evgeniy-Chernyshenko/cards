export const getBase64FromFile = (file: File, maxSize: number = 1048576) => {
  return new Promise<string>((resolve, reject) => {
    if (file.size > maxSize) {
      reject(new Error(`File size cannot exceed ${maxSize} bytes`));
    }

    const fileReader = new FileReader();

    fileReader.onloadend = () => {
      const fileBase64 = fileReader.result as string;

      resolve(fileBase64);
    };

    fileReader.readAsDataURL(file);
  });
};
