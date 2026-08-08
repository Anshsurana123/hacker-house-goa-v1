// In-memory image store for local dev and image route serving
const imageStore = new Map<string, { buffer: Buffer; mimeType: string; createdAt: number }>();

export function saveImage(id: string, buffer: Buffer, mimeType = 'image/png') {
  imageStore.set(id, { buffer, mimeType, createdAt: Date.now() });

  // Garbage collect entries older than 2 hours
  const twoHours = 2 * 60 * 60 * 1000;
  const now = Date.now();
  for (const [key, val] of imageStore.entries()) {
    if (now - val.createdAt > twoHours) {
      imageStore.delete(key);
    }
  }
}

export function getImage(id: string) {
  return imageStore.get(id);
}
