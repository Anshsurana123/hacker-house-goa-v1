export async function convertHeicIfNeeded(file: File): Promise<Blob> {
  const isHeic = /\.(heic|heif)$/i.test(file.name);
  if (!isHeic) return file;
  
  const heic2any = (await import('heic2any')).default;
  const result = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.85 });
  return Array.isArray(result) ? result[0] : result;
}
