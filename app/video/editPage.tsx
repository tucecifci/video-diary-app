import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { VideoMetadataFields } from "@/components/video/VideoMetadataFields";
import { VideoNotFound } from "@/components/video/VideoNotFound";
import { useVideoStore } from "@/store/videoStore";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";

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
    return <VideoNotFound onBack={handleBack} />;
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
          <VideoMetadataFields
            name={name}
            description={description}
            onChangeName={setName}
            onChangeDescription={setDescription}
          />
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
