import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { saveCroppedVideo } from "@/lib/videoStorage";
import { useVideoStore } from "@/store/videoStore";
import { useMutation } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { trimVideo } from "expo-trim-video";
import { useState } from "react";

export default function MetadataScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    videoUri: string;
    startTime: string;
    endTime: string;
  }>();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const addVideo = useVideoStore((state) => state.addVideo);

  const startTime = parseFloat(params.startTime || "0");
  const endTime = parseFloat(params.endTime || "5");

  const cropMutation = useMutation({
    mutationKey: ["videos", "crop"],
    mutationFn: async () => {
      if (!params.videoUri) {
        throw new Error("Video bulunamadı.");
      }

      // 1) Videoyu belirtilen segment'e göre kırp
      const trimResult = await trimVideo({
        uri: params.videoUri,
        start: startTime,
        end: endTime,
      });

      // 2) Kırpılmış videoyu kalıcı dizine kaydet
      const videoId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const savedUri = await saveCroppedVideo(trimResult.uri, videoId);

      // 3) Videoyu store'a ekle
      addVideo({
        id: videoId,
        name: name.trim(),
        description: description.trim(),
        uri: savedUri,
        originalUri: params.videoUri,
        createdAt: new Date().toISOString(),
        duration: endTime - startTime,
      });
    },
  });

  const handleBack = () => {
    router.back();
  };

  const handleCropVideo = async () => {
    if (!name.trim()) {
      Alert.alert("Hata", "Lütfen video için bir isim girin.");
      return;
    }

    try {
      await cropMutation.mutateAsync();

      // Başarılıysa kullanıcıya bilgi ver ve ana ekrana dön
      Alert.alert("Başarılı", "Video başarıyla croplandı.", [
        {
          text: "Tamam",
          onPress: () => {
            router.replace("/");
          },
        },
      ]);
    } catch (error) {
      console.error("Video crop işlemi sırasında hata:", error);
      Alert.alert(
        "Hata",
        "Video croplanırken bir hata oluştu. Lütfen tekrar deneyin."
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top", "bottom"]}>
      {/* Üst Bar */}
      <View className="flex-row items-center px-4 py-3 bg-black/80 rounded-b-lg">
        <TouchableOpacity onPress={handleBack}>
          <IconSymbol name="chevron.left" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-semibold ml-4">
          Video Bilgileri
        </Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          className="flex-1 px-4 py-6"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Name Input */}
          <View className="mb-6">
            <Text className="text-white text-sm font-semibold mb-2">
              Video İsmi *
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Video ismini girin"
              placeholderTextColor="#9ca3af"
              className="bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700"
              style={{ color: "#ffffff" }}
              autoFocus={false}
              returnKeyType="next"
              blurOnSubmit={false}
            />
          </View>

          {/* Description Input */}
          <View className="mb-6">
            <Text className="text-white text-sm font-semibold mb-2">
              Açıklama
            </Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Video açıklaması (opsiyonel)"
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              className="bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 min-h-[100px]"
              style={{ color: "#ffffff" }}
              returnKeyType="done"
              blurOnSubmit={true}
            />
          </View>

          {/* Segment Bilgisi */}
          <View className="mb-6 p-4 bg-gray-800 rounded-lg">
            <Text className="text-white text-sm font-semibold mb-2">
              Seçilen Segment
            </Text>
            <Text className="text-gray-400 text-xs">
              Başlangıç: {startTime.toFixed(1)}s
            </Text>
            <Text className="text-gray-400 text-xs">
              Bitiş: {endTime.toFixed(1)}s
            </Text>
            <Text className="text-gray-400 text-xs">
              Süre: {(endTime - startTime).toFixed(1)}s
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Alt Bar - Crop Butonu */}
      <View className="bg-black/90 px-4 py-6 rounded-t-lg">
        <TouchableOpacity
          onPress={handleCropVideo}
          disabled={!name.trim() || cropMutation.isPending}
          className={`py-4 rounded-lg ${
            name.trim() && !cropMutation.isPending
              ? "bg-blue-500"
              : "bg-gray-600 opacity-50"
          }`}
        >
          <Text className="text-white font-semibold text-center text-lg">
            {cropMutation.isPending ? "Croplanıyor..." : "Crop Video"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
