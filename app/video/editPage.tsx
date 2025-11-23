import { IconSymbol } from "@/components/ui/icon-symbol";
import { useVideoStore } from "@/store/videoStore";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
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

export default function VideoEditScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const getVideo = useVideoStore((state) => state.getVideo);
  const updateVideo = useVideoStore((state) => state.updateVideo);

  const video = id ? getVideo(id) : undefined;

  const [name, setName] = useState(video?.name ?? "");
  const [description, setDescription] = useState(video?.description ?? "");

  const handleBack = () => {
    router.back();
  };

  const handleSave = () => {
    if (!video || !id) {
      Alert.alert("Hata", "Video bulunamadı.");
      return;
    }

    if (!name.trim()) {
      Alert.alert("Hata", "Lütfen video için bir isim girin.");
      return;
    }

    updateVideo(id, {
      name: name.trim(),
      description: description.trim(),
    });

    Alert.alert("Başarılı", "Video bilgileri güncellendi.", [
      {
        text: "Tamam",
        onPress: () => {
          router.back();
        },
      },
    ]);
  };

  if (!video) {
    return (
      <SafeAreaView className="flex-1 bg-black items-center justify-center">
        <Text className="text-white text-lg mb-4">
          Video bulunamadı veya silinmiş.
        </Text>
        <TouchableOpacity
          onPress={handleBack}
          className="px-4 py-2 rounded-lg bg-gray-800"
        >
          <Text className="text-white">Geri dön</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top", "bottom"]}>
      <View className="flex-row items-center px-4 py-3 bg-black/80 rounded-b-lg">
        <TouchableOpacity onPress={handleBack}>
          <IconSymbol name="chevron.left" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-semibold ml-4">
          Video Düzenle
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
            />
          </View>
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
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <View className="bg-black/90 px-4 py-6 rounded-t-lg">
        <TouchableOpacity
          onPress={handleSave}
          disabled={!name.trim()}
          className={`py-4 rounded-lg ${
            name.trim() ? "bg-blue-500" : "bg-gray-600 opacity-50"
          }`}
        >
          <Text className="text-white font-semibold text-center text-lg">
            Kaydet
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
