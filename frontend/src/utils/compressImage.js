// Reads an image File, downscales it to fit `maxDim`, and returns a compressed
// data-URL plus its (scaled) pixel size. Keeps uploads small enough to live
// inside the house `design` document (see house-implementation.md H5).
export default function compressImage(file, maxDim = 512, quality = 0.82) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Please choose an image file"));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read the file"));
    reader.onload = () => {
      const img = new window.Image();
      img.onerror = () => reject(new Error("Could not load the image"));
      img.onload = () => {
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        const w = Math.max(1, Math.round(img.width * scale));
        const h = Math.max(1, Math.round(img.height * scale));

        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        canvas.getContext("2d").drawImage(img, 0, 0, w, h);

        // Preserve transparency for PNGs; JPEG (smaller) for photos.
        const type = file.type === "image/png" ? "image/png" : "image/jpeg";
        const dataUrl = canvas.toDataURL(type, quality);
        resolve({ dataUrl, width: w, height: h });
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}
