// Comprime/redimensiona una imagen en el navegador antes de subirla, para
// que nunca llegue al servidor una foto 4K/ultra pesada. Devuelve un data
// URI JPEG listo para mandar al backend.
const MAX_DIMENSION = 1600;
const JPEG_QUALITY = 0.82;
const MAX_OUTPUT_BYTES = 4 * 1024 * 1024;

export class ImageTooHeavyError extends Error {}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("No se pudo leer la imagen."));
    };
    image.src = url;
  });
}

function estimateDataUriBytes(dataUri: string): number {
  const base64 = dataUri.slice(dataUri.indexOf(",") + 1);
  return Math.ceil((base64.length * 3) / 4);
}

export async function compressImageFile(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("El archivo elegido no es una imagen.");
  }

  const image = await loadImage(file);

  const scale = Math.min(1, MAX_DIMENSION / Math.max(image.width, image.height));
  const width = Math.round(image.width * scale);
  const height = Math.round(image.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Este navegador no puede procesar la imagen.");
  }
  context.drawImage(image, 0, 0, width, height);

  const dataUri = canvas.toDataURL("image/jpeg", JPEG_QUALITY);

  if (estimateDataUriBytes(dataUri) > MAX_OUTPUT_BYTES) {
    throw new ImageTooHeavyError("Esta imagen es demasiado pesada. Probá con otra foto.");
  }

  return dataUri;
}
