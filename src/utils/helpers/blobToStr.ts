export const imageProcessor = async (image: File | string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const fReader = new FileReader();
    if (typeof image === "string") {
      resolve(image);
      return;
    }
    fReader.readAsDataURL(image);
    fReader.onload = (e) => {
      if (e.target?.result && typeof e.target.result === "string")
        resolve(e.target.result);
      else {
        reject("Unsopperted File Format");
      }
    };
  });
};
