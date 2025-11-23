import * as FileSystem from "expo-file-system/legacy";

/**
 * Video dosyalarını kalıcı olarak saklamak için kullanılan yardımcı fonksiyonlar
 */

// Video dosyalarının saklanacağı dizin (legacy FileSystem API ile, runtime-safe)
const BASE_DIR =
  ((FileSystem as any).documentDirectory as string | undefined) ??
  ((FileSystem as any).cacheDirectory as string | undefined) ??
  "";
const VIDEO_DIRECTORY = `${BASE_DIR}videos/`;

/**
 * Video dizinini oluşturur (yoksa)
 */
export async function ensureVideoDirectory(): Promise<void> {
  const dirInfo = await FileSystem.getInfoAsync(VIDEO_DIRECTORY);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(VIDEO_DIRECTORY, {
      intermediates: true,
    });
  }
}

/**
 * Cropped video dosyasını kalıcı olarak kaydeder
 * @param sourceUri - expo-trim-video'dan gelen geçici dosya URI'si
 * @param videoId - Video ID (dosya adı olarak kullanılacak)
 * @returns Kaydedilen dosyanın URI'si
 */
export async function saveCroppedVideo(
  sourceUri: string,
  videoId: string
): Promise<string> {
  await ensureVideoDirectory();

  const fileName = `cropped_${videoId}.mp4`;
  const destinationUri = `${VIDEO_DIRECTORY}${fileName}`;

  // Dosyayı kopyala (geçici dosyadan kalıcı konuma)
  await FileSystem.copyAsync({
    from: sourceUri,
    to: destinationUri,
  });

  return destinationUri;
}

/**
 * Video dosyasını siler
 * @param videoUri - Silinecek video dosyasının URI'si
 */
export async function deleteVideoFile(videoUri: string): Promise<void> {
  try {
    const fileInfo = await FileSystem.getInfoAsync(videoUri);
    if (fileInfo.exists) {
      await FileSystem.deleteAsync(videoUri, { idempotent: true });
    }
  } catch (error) {
    console.error("Video dosyası silinirken hata:", error);
  }
}

/**
 * Tüm video dosyalarının toplam boyutunu hesaplar (bytes)
 */
export async function getTotalVideoSize(): Promise<number> {
  try {
    await ensureVideoDirectory();
    const files = await FileSystem.readDirectoryAsync(VIDEO_DIRECTORY);
    let totalSize = 0;

    for (const file of files) {
      const fileUri = `${VIDEO_DIRECTORY}${file}`;
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      if (fileInfo.exists && !fileInfo.isDirectory) {
        totalSize += fileInfo.size || 0;
      }
    }

    return totalSize;
  } catch (error) {
    console.error("Video boyutu hesaplanırken hata:", error);
    return 0;
  }
}
