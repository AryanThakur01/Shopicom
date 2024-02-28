import { TFormInput } from "@/types/products";

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

export const processAllImages = async (data: TFormInput) => {
  for (let i = 0; i < data.variants.length; i++) {
    const variantImages = data.variants[i].images;
    const images: typeof variantImages = [];
    for (let j = 0; j < variantImages.length; j++) {
      if (!variantImages[j].value) delete variantImages[j];
      else {
        if (typeof variantImages[j].value === "string") continue;
        const fileBlobList = variantImages[j].value;
        if (!fileBlobList) throw new Error("Improper file format");
        const image = await imageProcessor(fileBlobList[0]);
        images.push({ ...variantImages[j], value: image });
      }
    }
    data.variants[i].images = images;
  }
};
