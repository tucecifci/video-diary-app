import * as ImagePicker from "expo-image-picker";
import { Alert, Platform } from "react-native";

/**
 * Galeri erişimi için gerekli izinleri kontrol eder ve ister
 * Hem Android hem iOS için çalışır
 * @returns {Promise<boolean>} İzin verildiyse true, reddedildiyse false
 */
export async function requestGalleryPermission(): Promise<boolean> {
  try {
    // iOS için media library izni
    if (Platform.OS === "ios") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "İzin Gerekli",
          "Galeriye erişmek için izin gerekiyor. Lütfen ayarlardan izin verin.",
          [{ text: "Tamam" }]
        );
        return false;
      }
      return true;
    }

    // Android için media library izni
    if (Platform.OS === "android") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "İzin Gerekli",
          "Galeriye erişmek için izin gerekiyor. Lütfen ayarlardan izin verin.",
          [{ text: "Tamam" }]
        );
        return false;
      }
      return true;
    }

    // Web veya diğer platformlar için
    return true;
  } catch (error) {
    console.error("İzin hatası:", error);
    Alert.alert("Hata", "İzin kontrolü sırasında bir hata oluştu.", [
      { text: "Tamam" },
    ]);
    return false;
  }
}

/**
 * Mevcut galeri izin durumunu kontrol eder (izin istemez)
 * @returns {Promise<boolean>} İzin varsa true, yoksa false
 */
export async function checkGalleryPermission(): Promise<boolean> {
  try {
    const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
    return status === "granted";
  } catch (error) {
    console.error("İzin kontrolü hatası:", error);
    return false;
  }
}
