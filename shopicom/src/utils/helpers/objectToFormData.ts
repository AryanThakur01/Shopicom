export const objectToFormData = (
  object: { [key: string]: any },
  parentKey?: string,
  formData = new FormData(),
): FormData => {
  for (let key in object) {
    let value = object[key];
    if (parentKey) key = `${parentKey}[${key}]`;

    if (value instanceof FileList) value = value.item(0);
    else if (typeof value === "object")
      value = objectToFormData(value, key, formData);

    if (typeof value !== "object" || value instanceof File)
      formData.append(key, value);
  }
  return formData;
};
